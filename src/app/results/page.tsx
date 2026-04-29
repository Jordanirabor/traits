'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { ErrorDisplay } from '@/components/common/ErrorBoundary';
import {
  InsightsSkeleton,
  ProfileSkeleton,
  ResultsSkeleton,
} from '@/components/common/LoadingSkeleton';
import { InsightCard } from '@/components/results/InsightCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRetry } from '@/hooks/useRetry';
import { analysisEngine } from '@/lib/services/analysisEngine';
import { getDisplayName } from '@/lib/utils/name';
import { AnalysisResults, N8nInsightsResponse } from '@/types/insights';
import { PersonalityData } from '@/types/personality';
import { getFrameworkDescription } from '@/utils/frameworkDescriptions';
import {
  AlertTriangle,
  ArrowLeft,
  Edit,
  ExternalLink,
  Heart,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hasAnyData(d: {
  bigFive?: unknown;
  mbti?: unknown;
  zodiac?: unknown;
  chineseZodiac?: unknown;
  humanDesign?: unknown;
  attachmentStyle?: unknown;
  loveLanguages?: unknown[];
}): boolean {
  return !!(
    d.bigFive ||
    d.mbti ||
    d.zodiac ||
    d.chineseZodiac ||
    d.humanDesign ||
    d.attachmentStyle ||
    (d.loveLanguages && d.loveLanguages.length > 0)
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ResultsPage() {
  const router = useRouter();
  const { session, loading: isSessionPending } = useAuth();

  // Data loading — DB for authenticated users, localStorage for guests
  const [data, setData] = useState<PersonalityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (session?.user?.id) {
          // Load from database
          const response = await fetch('/api/personality-data');
          if (response.ok) {
            const dbData = await response.json();
            setData(dbData);
          }
        } else {
          // Load from localStorage (guest mode)
          const stored = localStorage.getItem('guestPersonalityData');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.timestamp) parsed.timestamp = new Date(parsed.timestamp);
            setData(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to load personality data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isSessionPending) {
      loadData();
    }
  }, [session?.user?.id, isSessionPending]);

  const clearData = useCallback(async () => {
    if (session?.user?.id) {
      await fetch('/api/personality-data', { method: 'DELETE' });
    }
    localStorage.removeItem('guestPersonalityData');
    setData(null);
  }, [session?.user?.id]);

  // Client-side fallback insights
  const [localInsights, setLocalInsights] = useState<AnalysisResults | null>(
    null
  );
  // n8n AI insights
  const [n8nInsights, setN8nInsights] = useState<N8nInsightsResponse | null>(
    null
  );
  const [isGeneratingN8n, setIsGeneratingN8n] = useState(false);
  const [n8nError, setN8nError] = useState<string | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const hasAttemptedN8n = useRef(false);

  // ---- Client-side insights (instant fallback) ----
  const generatedInsights = useMemo(() => {
    if (!data || !hasAnyData(data)) return null;
    try {
      return analysisEngine.generateInsights(data);
    } catch {
      return null;
    }
  }, [data]);

  const generateInsights = useCallback(async () => {
    if (!data) return;
    setIsGeneratingInsights(true);
    setInsightsError(null);
    try {
      if (!generatedInsights) {
        router.push('/assessment');
        return;
      }
      await new Promise((r) => setTimeout(r, 100));
      setLocalInsights(generatedInsights);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Failed to generate insights';
      setInsightsError(msg);
      toast.error('Failed to generate insights. Please try again.');
    } finally {
      setIsGeneratingInsights(false);
    }
  }, [data, generatedInsights, router]);

  const { execute: retryGenerateInsights, isRetrying } = useRetry(
    generateInsights,
    {
      maxAttempts: 3,
      delay: 1000,
      onError: (error, attempt) => {
        if (attempt < 3) toast.error(`Retrying… (Attempt ${attempt + 1}/3)`);
      },
      onSuccess: () => toast.success('Insights generated successfully'),
    }
  );

  // Generate local insights on load
  useEffect(() => {
    if (!isLoading && data && hasAnyData(data)) {
      generateInsights();
    }
  }, [data, isLoading, generateInsights]);

  // ---- n8n AI insights ----
  const generateN8nInsights = useCallback(async () => {
    if (isGeneratingN8n || !data || !hasAnyData(data)) return;
    setIsGeneratingN8n(true);
    setN8nError(null);
    hasAttemptedN8n.current = true;

    try {
      const res = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error || body.message || `Server returned ${res.status}`
        );
      }

      const result = await res.json();
      if (result.success && result.insights) {
        setN8nInsights(result.insights as N8nInsightsResponse);
        setN8nError(null);
        if (result.duration) {
          console.log(`[n8n] Insights generated in ${result.duration}`);
        }
      } else {
        throw new Error('Invalid response from insight generation service');
      }
    } catch (error) {
      console.error('n8n insight generation failed:', error);
      const msg =
        error instanceof Error ? error.message : 'Failed to generate insights';
      setN8nError(msg);
    } finally {
      setIsGeneratingN8n(false);
    }
  }, [data, isGeneratingN8n]);

  // Auto-trigger n8n when authenticated and data is ready
  useEffect(() => {
    if (
      session?.user &&
      !isSessionPending &&
      data &&
      hasAnyData(data) &&
      !n8nInsights &&
      !isGeneratingN8n &&
      !hasAttemptedN8n.current
    ) {
      generateN8nInsights();
    }
  }, [
    session,
    isSessionPending,
    data,
    n8nInsights,
    isGeneratingN8n,
    generateN8nInsights,
  ]);

  // ---- Reset ----
  const handleReset = async () => {
    if (confirm('Clear all data? This cannot be undone.')) {
      try {
        clearData();
        setN8nInsights(null);
        hasAttemptedN8n.current = false;
        toast.success('Data cleared successfully');
        router.push('/');
      } catch {
        toast.error('Failed to clear data. Please try again.');
      }
    }
  };

  // ---- Loading states ----
  if (isLoading || (isGeneratingInsights && !localInsights) || isRetrying) {
    return <ResultsSkeleton />;
  }

  if (insightsError && !localInsights) {
    return (
      <div className="min-h-screen gradient-soft">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ErrorDisplay
            title="Failed to Generate Insights"
            message={insightsError}
            onRetry={() => retryGenerateInsights()}
          />
        </div>
      </div>
    );
  }

  if (!data || !hasAnyData(data)) {
    return (
      <div className="min-h-screen gradient-soft">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Start Your Journey</h1>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
            Add personality data to generate personalized insights. You
            don&apos;t need to complete all traits. Insights are generated based
            on whatever data you provide.
          </p>
          <Button size="lg" onClick={() => router.push('/assessment')}>
            Add Your Data →
          </Button>
        </div>
      </div>
    );
  }

  const displayName = getDisplayName(
    session?.user?.name ?? null,
    session?.user?.email ?? null
  );

  const completedCount = Object.values(
    data
      ? {
          bigFive: !!data.bigFive,
          mbti: !!data.mbti,
          zodiac: !!data.zodiac,
          chineseZodiac: !!data.chineseZodiac,
          humanDesign: !!data.humanDesign,
          attachmentStyle: !!data.attachmentStyle,
          loveLanguages:
            !!data.loveLanguages && data.loveLanguages.length === 5,
        }
      : {}
  ).filter(Boolean).length;

  // Determine which markdown content to show (if any)
  const n8nMarkdown: string | null =
    n8nInsights?.output && typeof n8nInsights.output === 'string'
      ? n8nInsights.output
      : null;

  return (
    <div className="min-h-screen gradient-soft">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/assessment')}
              className="h-10 w-10"
              aria-label="Go back to assessment page"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Your Insights</h1>
              {session?.user && (
                <p className="text-sm text-muted-foreground">
                  Personalized for{' '}
                  <span className="font-semibold">{displayName}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
              {completedCount} trait{completedCount !== 1 ? 's' : ''} completed
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
              aria-label="Reset all personality data"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Reset</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            <TabsTrigger
              value="insights"
              className="text-sm md:text-base py-2 md:py-3"
            >
              Insights
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-sm md:text-base py-2 md:py-3"
            >
              Profile
            </TabsTrigger>
          </TabsList>

          {/* ============ Insights Tab ============ */}
          <TabsContent value="insights" className="space-y-8 mt-6">
            {/* n8n AI Insights section */}
            {session?.user && (
              <section className="space-y-4">
                {isGeneratingN8n && (
                  <Card className="p-8 text-center shadow-card">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">
                      Generating AI Insights
                    </h3>
                    <p className="text-muted-foreground">
                      This usually takes 2–3 minutes. Please keep this page
                      open.
                    </p>
                  </Card>
                )}

                {n8nError && !n8nInsights && (
                  <Card className="p-6 border-destructive/30 shadow-card">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-destructive mb-1">
                          AI Insight Generation Failed
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {n8nError}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            hasAttemptedN8n.current = false;
                            generateN8nInsights();
                          }}
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {n8nMarkdown && (
                  <Card className="p-6 md:p-10 shadow-card">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold">
                          AI-Powered Insights
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          Personalized analysis generated by AI
                        </p>
                      </div>
                    </div>
                    <div className="prose prose-slate max-w-none">
                      <MarkdownContent content={n8nMarkdown} />
                    </div>
                  </Card>
                )}

                {/* Structured n8n fallback (non-markdown) */}
                {n8nInsights &&
                  !n8nMarkdown &&
                  'selfImprovement' in n8nInsights && (
                    <N8nStructuredInsights insights={n8nInsights} />
                  )}
              </section>
            )}

            {/* Client-side insights — only for guest (unauthenticated) users */}
            {!session?.user && (
              <>
                {isGeneratingInsights ? (
                  <InsightsSkeleton />
                ) : (
                  localInsights && (
                    <>
                      {localInsights.selfImprovement.length > 0 && (
                        <InsightSection
                          id="growth-areas"
                          title="Growth Areas"
                          icon={<TrendingUp className="h-5 w-5 text-primary" />}
                          iconBg="bg-primary/10"
                          insights={localInsights.selfImprovement}
                          type="improvement"
                        />
                      )}

                      {localInsights.strengths.length > 0 && (
                        <InsightSection
                          id="strengths"
                          title="Strengths"
                          icon={<Sparkles className="h-5 w-5 text-accent" />}
                          iconBg="bg-accent/10"
                          insights={localInsights.strengths}
                          type="strength"
                        />
                      )}

                      {localInsights.greenFlags.length > 0 && (
                        <InsightSection
                          id="green-flags"
                          title="What to Seek"
                          icon={<Heart className="h-5 w-5 text-success" />}
                          iconBg="bg-success/10"
                          insights={localInsights.greenFlags}
                          type="greenFlag"
                        />
                      )}

                      {localInsights.redFlags.length > 0 && (
                        <InsightSection
                          id="red-flags"
                          title="Watch Out For"
                          icon={
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                          }
                          iconBg="bg-destructive/10"
                          insights={localInsights.redFlags}
                          type="redFlag"
                        />
                      )}
                    </>
                  )
                )}
              </>
            )}

            {/* Prompt to generate AI insights if not authenticated */}
            {!session?.user && !isSessionPending && (
              <Card className="p-6 text-center shadow-card">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">Want AI-Powered Insights?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in to unlock deeper, AI-generated personality insights
                  tailored just for you.
                </p>
                <Button variant="default" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* ============ Profile Tab ============ */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            {isLoading ? (
              <ProfileSkeleton />
            ) : (
              <>
                <ProfileCard
                  title="Big Five Personality Traits"
                  data={data.bigFive}
                  learnMoreUrl="https://en.wikipedia.org/wiki/Big_Five_personality_traits"
                  onEdit={() => router.push('/assessment')}
                >
                  {data.bigFive && (
                    <>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {getFrameworkDescription('bigFive', data.bigFive)}
                      </p>
                      <div className="space-y-3">
                        {Object.entries(data.bigFive).map(([trait, score]) => (
                          <div key={trait}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize font-medium">
                                {trait}
                              </span>
                              <span className="text-muted-foreground">
                                {score}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-smooth"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </ProfileCard>

                <ProfileCard
                  title="MBTI Type"
                  data={data.mbti}
                  learnMoreUrl={
                    data.mbti
                      ? `https://www.16personalities.com/${data.mbti.toLowerCase()}-personality`
                      : undefined
                  }
                  onEdit={() => router.push('/assessment')}
                >
                  {data.mbti && (
                    <>
                      <p className="text-2xl font-bold text-primary mb-3">
                        {data.mbti}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {getFrameworkDescription('mbti', data.mbti)}
                      </p>
                    </>
                  )}
                </ProfileCard>

                <ProfileCard
                  title="Attachment Style"
                  data={data.attachmentStyle}
                  learnMoreUrl="https://www.attachmentproject.com/blog/four-attachment-styles/"
                  onEdit={() => router.push('/assessment')}
                >
                  {data.attachmentStyle && (
                    <>
                      <p className="text-2xl font-bold text-primary capitalize mb-3">
                        {data.attachmentStyle.replace('-', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {getFrameworkDescription(
                          'attachmentStyle',
                          data.attachmentStyle
                        )}
                      </p>
                    </>
                  )}
                </ProfileCard>

                <ProfileCard
                  title="Love Languages"
                  data={
                    data.loveLanguages && data.loveLanguages.length > 0
                      ? data.loveLanguages
                      : undefined
                  }
                  learnMoreUrl="https://5lovelanguages.com/"
                  onEdit={() => router.push('/assessment')}
                >
                  {data.loveLanguages && data.loveLanguages.length > 0 && (
                    <>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {getFrameworkDescription(
                          'loveLanguages',
                          data.loveLanguages
                        )}
                      </p>
                      <div className="space-y-2">
                        {data.loveLanguages
                          .sort((a, b) => a.rank - b.rank)
                          .map((lang) => (
                            <div
                              key={lang.type}
                              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                            >
                              <span className="font-bold text-primary">
                                #{lang.rank}
                              </span>
                              <span className="capitalize font-medium">
                                {lang.type.replace('-', ' ')}
                              </span>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </ProfileCard>

                <ProfileCard
                  title="Zodiac Sign"
                  data={data.zodiac}
                  learnMoreUrl={
                    data.zodiac
                      ? `https://www.astrology.com/zodiac-signs/${data.zodiac.sun.toLowerCase()}`
                      : undefined
                  }
                  onEdit={() => router.push('/assessment')}
                >
                  {data.zodiac && (
                    <>
                      <p className="text-2xl font-bold text-primary capitalize mb-3">
                        {data.zodiac.sun}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {getFrameworkDescription('zodiacSign', data.zodiac.sun)}
                      </p>
                    </>
                  )}
                </ProfileCard>

                <ProfileCard
                  title="Chinese Zodiac"
                  data={data.chineseZodiac}
                  learnMoreUrl="https://www.travelchinaguide.com/intro/social_customs/zodiac/"
                  onEdit={() => router.push('/assessment')}
                >
                  {data.chineseZodiac && (
                    <>
                      <p className="text-2xl font-bold text-primary capitalize mb-3">
                        {data.chineseZodiac.animal}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {getFrameworkDescription(
                          'chineseZodiac',
                          data.chineseZodiac.animal
                        )}
                      </p>
                    </>
                  )}
                </ProfileCard>

                <ProfileCard
                  title="Human Design Type"
                  data={data.humanDesign}
                  learnMoreUrl="https://www.jovianarchive.com/Human_Design/Types"
                  onEdit={() => router.push('/assessment')}
                >
                  {data.humanDesign && (
                    <>
                      <p className="text-2xl font-bold text-primary capitalize mb-3">
                        {data.humanDesign.type.replace('-', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {getFrameworkDescription(
                          'humanDesign',
                          data.humanDesign.type
                        )}
                      </p>
                    </>
                  )}
                </ProfileCard>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <div className="mt-8 p-5 rounded-xl bg-muted/50 border">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong>Disclaimer:</strong> These insights are for self-reflection
            and personal growth, not clinical diagnosis. Personality traits are
            models, not absolute truths. If you&apos;re experiencing serious
            concerns, please seek professional help.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InsightSection({
  id,
  title,
  icon,
  iconBg,
  insights,
  type,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  insights: AnalysisResults['selfImprovement'];
  type: 'improvement' | 'strength' | 'greenFlag' | 'redFlag';
}) {
  return (
    <section aria-labelledby={`${id}-heading`}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
          aria-hidden="true"
        >
          {icon}
        </div>
        <h2 id={`${id}-heading`} className="text-xl md:text-2xl font-bold">
          {title}
        </h2>
      </div>
      <div className="space-y-4">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            title={insight.title}
            description={insight.description}
            reasoning={insight.explanation}
            type={type}
          />
        ))}
      </div>
    </section>
  );
}

function ProfileCard({
  title,
  data,
  learnMoreUrl,
  onEdit,
  children,
}: {
  title: string;
  data: unknown;
  learnMoreUrl?: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  if (!data) return null;

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="flex gap-2">
          {learnMoreUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Learn More
              </a>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
      {children}
    </Card>
  );
}

/**
 * Renders structured n8n insights (non-markdown fallback format).
 */
function N8nStructuredInsights({
  insights,
}: {
  insights: N8nInsightsResponse;
}) {
  const sections = [
    {
      title: '🌱 Self-Improvement',
      subtitle: 'Areas for personal growth',
      items: insights.selfImprovement,
      color: 'teal' as const,
    },
    {
      title: '💪 Unique Strengths',
      subtitle: 'Your distinctive positive attributes',
      items: insights.strengths,
      color: 'teal' as const,
    },
    {
      title: '✨ What to Look For in Yourself',
      subtitle: 'Positive qualities to nurture',
      items: insights.selfGreenFlags,
      color: 'green' as const,
    },
    {
      title: '🧘 Things to Be Mindful Of',
      subtitle: 'Areas to watch and grow',
      items: insights.selfRedFlags,
      color: 'amber' as const,
    },
    {
      title: '💚 What to Look For in a Partner',
      subtitle: 'Positive qualities to seek',
      items: insights.partnerGreenFlags,
      color: 'green' as const,
    },
    {
      title: '🔍 Potential Challenges',
      subtitle: 'Things to be aware of',
      items: insights.partnerRedFlags,
      color: 'amber' as const,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {sections.map(
        (section) =>
          section.items &&
          section.items.length > 0 && (
            <Card key={section.title} className="p-6 shadow-card">
              <h3 className="text-lg font-bold mb-1">{section.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {section.subtitle}
              </p>
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 border">
                    <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                    {item.reasoning && (
                      <p className="text-xs text-muted-foreground mt-2 italic border-l-2 border-muted pl-3">
                        {item.reasoning}
                      </p>
                    )}
                    {item.action && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs">
                          <span className="font-semibold">💡 Action:</span>{' '}
                          {item.action}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )
      )}
    </div>
  );
}

/**
 * Simple Markdown renderer — converts markdown text to styled HTML.
 * Escapes HTML first to prevent XSS, then applies markdown formatting.
 */
function MarkdownContent({ content }: { content: string }) {
  const formatMarkdown = (text: string): string => {
    const esc = (s: string) =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const lines = text.split('\n');
    const out: string[] = [];
    let inList = false;

    const inlineMd = (s: string) =>
      esc(s)
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-bold text-foreground">$1</strong>'
        )
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(
          /`([^`]+)`/g,
          '<code class="bg-muted px-2 py-0.5 rounded text-sm font-mono">$1</code>'
        );

    for (const raw of lines) {
      const line = raw.trim();

      if (line.startsWith('### ')) {
        if (inList) {
          out.push('</ul>');
          inList = false;
        }
        out.push(
          `<h3 class="text-xl font-bold mt-8 mb-4">${esc(line.slice(4))}</h3>`
        );
      } else if (line.startsWith('## ')) {
        if (inList) {
          out.push('</ul>');
          inList = false;
        }
        out.push(
          `<h2 class="text-2xl font-bold mt-10 mb-5">${esc(line.slice(3))}</h2>`
        );
      } else if (line.startsWith('# ')) {
        if (inList) {
          out.push('</ul>');
          inList = false;
        }
        out.push(
          `<h1 class="text-3xl font-bold mt-12 mb-6">${esc(line.slice(2))}</h1>`
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          out.push('<ul class="list-disc ml-6 mb-4 space-y-2">');
          inList = true;
        }
        out.push(`<li class="leading-relaxed">${inlineMd(line.slice(2))}</li>`);
      } else if (line.startsWith('> ')) {
        if (inList) {
          out.push('</ul>');
          inList = false;
        }
        out.push(
          `<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">${esc(line.slice(2))}</blockquote>`
        );
      } else if (!line) {
        if (inList) {
          out.push('</ul>');
          inList = false;
        }
        out.push('<br />');
      } else {
        if (inList) {
          out.push('</ul>');
          inList = false;
        }
        out.push(`<p class="leading-relaxed mb-4">${inlineMd(line)}</p>`);
      }
    }

    if (inList) out.push('</ul>');
    return out.join('\n');
  };

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
    />
  );
}
