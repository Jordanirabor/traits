'use client';

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
import { usePersonalityData } from '@/hooks/usePersonalityData';
import { useRetry } from '@/hooks/useRetry';
import { analysisEngine } from '@/lib/services/analysisEngine';
import { AnalysisResults } from '@/types/insights';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function ResultsPage() {
  const router = useRouter();
  const { data, isLoading, clearData } = usePersonalityData();
  const [insights, setInsights] = useState<AnalysisResults | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Memoize insights generation for performance
  const generatedInsights = useMemo(() => {
    if (!data) return null;

    // Check if user has any data
    const hasData =
      data.bigFive ||
      data.mbti ||
      data.zodiac ||
      data.chineseZodiac ||
      data.humanDesign ||
      data.attachmentStyle ||
      data.loveLanguages;

    if (!hasData) return null;

    try {
      return analysisEngine.generateInsights(data);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return null;
    }
  }, [data]);

  // Generate insights with error handling
  const generateInsights = useCallback(async () => {
    if (!data) return;

    setIsGeneratingInsights(true);
    setInsightsError(null);

    try {
      if (!generatedInsights) {
        router.push('/assessment');
        return;
      }

      // Simulate async operation for insights generation
      await new Promise((resolve) => setTimeout(resolve, 100));
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate insights';
      setInsightsError(errorMessage);
      toast.error('Failed to generate insights. Please try again.');
    } finally {
      setIsGeneratingInsights(false);
    }
  }, [data, generatedInsights, router]);

  // Retry hook for generating insights
  const { execute: retryGenerateInsights, isRetrying } = useRetry(
    generateInsights,
    {
      maxAttempts: 3,
      delay: 1000,
      onError: (error, attempt) => {
        console.error(`Insights generation attempt ${attempt} failed:`, error);
        if (attempt < 3) {
          toast.error(`Retrying... (Attempt ${attempt + 1}/3)`);
        }
      },
      onSuccess: () => {
        toast.success('Insights generated successfully');
      },
    }
  );

  useEffect(() => {
    if (!isLoading && data) {
      generateInsights();
    }
  }, [data, isLoading, generateInsights]);

  const handleReset = async () => {
    if (confirm('Clear all data? This cannot be undone.')) {
      try {
        clearData();
        toast.success('Data cleared successfully');
        router.push('/');
      } catch (error) {
        console.error('Failed to clear data:', error);
        toast.error('Failed to clear data. Please try again.');
      }
    }
  };

  if (isLoading || isGeneratingInsights || isRetrying) {
    return <ResultsSkeleton />;
  }

  // Show error state with retry option
  if (insightsError) {
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

  if (!data || !insights) return null;

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
            <h1 className="text-2xl md:text-3xl font-bold">Your Insights</h1>
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

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-8 mt-6">
            {isGeneratingInsights ? (
              <InsightsSkeleton />
            ) : (
              <>
                {/* Growth Areas */}
                {insights.selfImprovement.length > 0 && (
                  <section aria-labelledby="growth-areas-heading">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <h2
                        id="growth-areas-heading"
                        className="text-xl md:text-2xl font-bold"
                      >
                        Growth Areas
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {insights.selfImprovement.map((insight, idx) => (
                        <InsightCard
                          key={insight.id}
                          title={insight.title}
                          description={insight.description}
                          reasoning={insight.explanation}
                          type="improvement"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Strengths */}
                {insights.strengths.length > 0 && (
                  <section aria-labelledby="strengths-heading">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <Sparkles className="h-5 w-5 text-accent" />
                      </div>
                      <h2
                        id="strengths-heading"
                        className="text-xl md:text-2xl font-bold"
                      >
                        Strengths
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {insights.strengths.map((insight, idx) => (
                        <InsightCard
                          key={insight.id}
                          title={insight.title}
                          description={insight.description}
                          reasoning={insight.explanation}
                          type="strength"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* What to Seek (Green Flags) */}
                {insights.greenFlags.length > 0 && (
                  <section aria-labelledby="green-flags-heading">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <Heart className="h-5 w-5 text-success" />
                      </div>
                      <h2
                        id="green-flags-heading"
                        className="text-xl md:text-2xl font-bold"
                      >
                        What to Seek
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {insights.greenFlags.map((insight, idx) => (
                        <InsightCard
                          key={insight.id}
                          title={insight.title}
                          description={insight.description}
                          reasoning={insight.explanation}
                          type="greenFlag"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Watch Out For (Red Flags) */}
                {insights.redFlags.length > 0 && (
                  <section aria-labelledby="red-flags-heading">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <h2
                        id="red-flags-heading"
                        className="text-xl md:text-2xl font-bold"
                      >
                        Watch Out For
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {insights.redFlags.map((insight, idx) => (
                        <InsightCard
                          key={insight.id}
                          title={insight.title}
                          description={insight.description}
                          reasoning={insight.explanation}
                          type="redFlag"
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            {isLoading ? (
              <ProfileSkeleton />
            ) : (
              <>
                {/* Big Five */}
                {data.bigFive && (
                  <Card className="p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">
                        Big Five Personality Traits
                      </h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href="https://en.wikipedia.org/wiki/Big_Five_personality_traits"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Learn More
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push('/assessment')}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
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
                  </Card>
                )}

                {/* MBTI */}
                {data.mbti && (
                  <Card className="p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">MBTI Type</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://www.16personalities.com/${data.mbti.toLowerCase()}-personality`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Learn More
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push('/assessment')}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-3">
                      {data.mbti}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {getFrameworkDescription('mbti', data.mbti)}
                    </p>
                  </Card>
                )}

                {/* Attachment Style */}
                {data.attachmentStyle && (
                  <Card className="p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Attachment Style</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href="https://www.attachmentproject.com/blog/four-attachment-styles/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Learn More
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push('/assessment')}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-primary capitalize mb-3">
                      {data.attachmentStyle.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {getFrameworkDescription(
                        'attachmentStyle',
                        data.attachmentStyle
                      )}
                    </p>
                  </Card>
                )}

                {/* Love Languages */}
                {data.loveLanguages && data.loveLanguages.length > 0 && (
                  <Card className="p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Love Languages</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href="https://5lovelanguages.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Learn More
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push('/assessment')}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
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
                  </Card>
                )}

                {/* Zodiac */}
                {data.zodiac && (
                  <Card className="p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Zodiac Sign</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://www.astrology.com/zodiac-signs/${data.zodiac.sun.toLowerCase()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Learn More
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push('/assessment')}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-primary capitalize mb-3">
                      {data.zodiac.sun}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {getFrameworkDescription('zodiacSign', data.zodiac.sun)}
                    </p>
                  </Card>
                )}

                {/* Chinese Zodiac */}
                {data.chineseZodiac && (
                  <Card className="p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Chinese Zodiac</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href="https://www.travelchinaguide.com/intro/social_customs/zodiac/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Learn More
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push('/assessment')}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-primary capitalize mb-3">
                      {data.chineseZodiac.animal}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {getFrameworkDescription(
                        'chineseZodiac',
                        data.chineseZodiac.animal
                      )}
                    </p>
                  </Card>
                )}

                {/* Human Design */}
                {data.humanDesign && (
                  <Card className="p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Human Design Type</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href="https://www.jovianarchive.com/Human_Design/Types"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Learn More
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push('/assessment')}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-primary capitalize mb-3">
                      {data.humanDesign.type.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {getFrameworkDescription(
                        'humanDesign',
                        data.humanDesign.type
                      )}
                    </p>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
