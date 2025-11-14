'use client';

import { ErrorDisplay } from '@/components/common/ErrorBoundary';
import { AssessmentSkeleton } from '@/components/common/LoadingSkeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useRetry } from '@/hooks/useRetry';
import {
  ReferencePersonalityData,
  toCurrentFormat,
  toReferenceFormat,
} from '@/lib/adapters/personalityDataAdapter';
import { useSession } from '@/lib/auth/authClient';
import { PersonalityData } from '@/types/personality';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Brain,
  Check,
  Heart,
  LayoutGrid,
  List,
  Smile,
  Sparkles,
  Star,
  Target,
  Users,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// Lazy load input components for better performance
const BigFiveInput = dynamic(
  () =>
    import('@/components/input').then((mod) => ({
      default: mod.BigFiveInput,
    })),
  { ssr: false }
);
const MBTIInput = dynamic(
  () =>
    import('@/components/input').then((mod) => ({ default: mod.MBTIInput })),
  { ssr: false }
);
const EnneagramInput = dynamic(
  () =>
    import('@/components/input').then((mod) => ({
      default: mod.EnneagramInput,
    })),
  { ssr: false }
);
const AttachmentStyleInput = dynamic(
  () =>
    import('@/components/input').then((mod) => ({
      default: mod.AttachmentStyleInput,
    })),
  { ssr: false }
);
const LoveLanguagesInput = dynamic(
  () =>
    import('@/components/input').then((mod) => ({
      default: mod.LoveLanguagesInput,
    })),
  { ssr: false }
);
const ZodiacInput = dynamic(
  () =>
    import('@/components/input').then((mod) => ({ default: mod.ZodiacInput })),
  { ssr: false }
);
const ChineseZodiacInput = dynamic(
  () =>
    import('@/components/input').then((mod) => ({
      default: mod.ChineseZodiacInput,
    })),
  { ssr: false }
);
const HumanDesignInput = dynamic(
  () =>
    import('@/components/input').then((mod) => ({
      default: mod.HumanDesignInput,
    })),
  { ssr: false }
);

export default function AssessmentPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [data, setData] = useState<ReferencePersonalityData>({});
  const [layout, setLayout] = useState<'single' | 'double'>('double');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // Check for guest mode immediately (not in useEffect to avoid race condition)
  const [isGuestMode, setIsGuestMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('guestMode') === 'true';
    }
    return false;
  });

  // Redirect to login if not authenticated and not in guest mode
  useEffect(() => {
    if (!isPending && !session && !isGuestMode) {
      router.push('/login');
    }
  }, [session, isPending, isGuestMode, router]);

  // Load data from database or localStorage on mount
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      if (isGuestMode) {
        // Load from localStorage for guest users
        const storedData = localStorage.getItem('guestPersonalityData');
        if (storedData) {
          const personalityData: PersonalityData = JSON.parse(storedData);
          setData(toReferenceFormat(personalityData));
        }
      } else if (session?.user?.id) {
        // Load from database for authenticated users
        const response = await fetch('/api/personality-data');
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.statusText}`);
        }
        const personalityData: PersonalityData = await response.json();
        setData(toReferenceFormat(personalityData));
      }
    } catch (error) {
      console.error('Failed to load personality data:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load your data';
      setLoadError(errorMessage);
      toast.error('Failed to load your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, isGuestMode]);

  // Retry hook for loading data
  const {
    execute: retryLoad,
    isRetrying,
    attemptCount,
  } = useRetry(loadData, {
    maxAttempts: 3,
    delay: 1000,
    onError: (error, attempt) => {
      console.error(`Load attempt ${attempt} failed:`, error);
      if (attempt < 3) {
        toast.error(`Retrying... (Attempt ${attempt + 1}/3)`);
      }
    },
    onSuccess: () => {
      toast.success('Data loaded successfully');
    },
  });

  useEffect(() => {
    if (session?.user?.id || isGuestMode) {
      loadData();
    }
  }, [session?.user?.id, isGuestMode, loadData]);

  // Save function with retry logic
  const saveData = useCallback(
    async (dataToSave: ReferencePersonalityData, retryCount = 0) => {
      setIsSaving(true);

      try {
        if (isGuestMode) {
          // Save to localStorage for guest users
          const guestData = toCurrentFormat(dataToSave, 'guest');
          localStorage.setItem(
            'guestPersonalityData',
            JSON.stringify(guestData)
          );
          setIsSaving(false);
        } else if (session?.user?.id) {
          // Save to database for authenticated users
          const currentData = toCurrentFormat(dataToSave, session.user.id);

          const response = await fetch('/api/personality-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentData),
          });

          if (!response.ok) {
            throw new Error(`Failed to save data: ${response.statusText}`);
          }

          // Success - reset retry count
          setIsSaving(false);
        }
      } catch (error) {
        console.error('Failed to save personality data:', error);

        // Retry logic with exponential backoff (only for database saves)
        if (!isGuestMode && retryCount < 2) {
          const delay = 1000 * Math.pow(2, retryCount);
          toast.error(`Save failed. Retrying in ${delay / 1000}s...`);

          setTimeout(() => {
            saveData(dataToSave, retryCount + 1);
          }, delay);
        } else {
          // Max retries reached
          setIsSaving(false);
          toast.error(
            'Failed to save your data after multiple attempts. Please check your connection.'
          );
        }
      }
    },
    [session?.user?.id, isGuestMode]
  );

  // Update data with debounced auto-save - memoized for performance
  const updateData = useCallback(
    (updates: Partial<ReferencePersonalityData>) => {
      setData((prevData) => {
        const newData = { ...prevData, ...updates };

        // Clear existing timeout
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }

        // Set new timeout for auto-save (500ms debounce)
        const timeout = setTimeout(() => {
          saveData(newData);
        }, 500);

        setSaveTimeout(timeout);

        return newData;
      });
    },
    [saveTimeout, saveData]
  );

  // Check if a framework is complete
  const isFrameworkComplete = useCallback(
    (id: string): boolean => {
      switch (id) {
        case 'big-five':
          return !!data.bigFive;
        case 'mbti':
          return !!data.mbti;
        case 'enneagram':
          return !!data.enneagram;
        case 'attachment':
          return !!data.attachmentStyle;
        case 'love-languages':
          return !!data.loveLanguages && data.loveLanguages.length === 5;
        case 'zodiac':
          return !!data.zodiacSign;
        case 'chinese-zodiac':
          return !!data.chineseZodiac;
        case 'human-design':
          return !!data.humanDesign;
        default:
          return false;
      }
    },
    [data]
  );

  // Handle view results button
  const handleViewResults = () => {
    const hasAnyData =
      data.bigFive ||
      data.mbti ||
      data.enneagram ||
      data.zodiacSign ||
      data.chineseZodiac ||
      data.humanDesign ||
      data.attachmentStyle ||
      (data.loveLanguages && data.loveLanguages.length > 0);

    if (!hasAnyData) {
      toast.error('Please complete at least one assessment');
      return;
    }

    router.push('/results');
  };

  // Handle accordion changes
  const handleAccordionChange = (values: string[]) => {
    setOpenItems(values);
  };

  // Framework definitions
  const frameworks = useMemo(
    () => [
      {
        id: 'big-five',
        title: 'Big Five Personality Traits',
        icon: Brain,
        color: 'hsl(210, 100%, 50%)',
        bgColor: 'hsl(210, 100%, 95%)',
        origin:
          'Developed by psychologists in the 1980s, the Big Five is the most scientifically validated personality model.',
        component: <BigFiveInput data={data} onUpdate={updateData} />,
      },
      {
        id: 'mbti',
        title: 'MBTI Type',
        icon: Users,
        color: 'hsl(280, 70%, 55%)',
        bgColor: 'hsl(280, 100%, 95%)',
        origin:
          "Created by Isabel Myers based on Carl Jung's psychological types, categorizing 16 personality types.",
        component: <MBTIInput data={data} onUpdate={updateData} />,
      },
      {
        id: 'enneagram',
        title: 'Enneagram Type',
        icon: Target,
        color: 'hsl(330, 70%, 55%)',
        bgColor: 'hsl(330, 100%, 95%)',
        origin:
          'Ancient personality system with roots in multiple spiritual traditions, describing nine interconnected types with unique motivations.',
        component: <EnneagramInput data={data} onUpdate={updateData} />,
      },
      {
        id: 'attachment',
        title: 'Attachment Style',
        icon: Heart,
        color: 'hsl(142, 71%, 45%)',
        bgColor: 'hsl(142, 100%, 95%)',
        origin:
          'Rooted in attachment theory by John Bowlby, describing how early relationships shape bonding patterns.',
        component: <AttachmentStyleInput data={data} onUpdate={updateData} />,
      },
      {
        id: 'love-languages',
        title: 'Love Languages',
        icon: Smile,
        color: 'hsl(350, 80%, 55%)',
        bgColor: 'hsl(350, 100%, 95%)',
        origin:
          'Introduced by Gary Chapman in 1992, describing five ways people express and experience love.',
        component: <LoveLanguagesInput data={data} onUpdate={updateData} />,
      },
      {
        id: 'zodiac',
        title: 'Zodiac Signs',
        icon: Star,
        color: 'hsl(45, 100%, 50%)',
        bgColor: 'hsl(45, 100%, 95%)',
        origin:
          'Western astrology dates back to ancient Babylon, using celestial positions at birth.',
        component: <ZodiacInput data={data} onUpdate={updateData} />,
      },
      {
        id: 'chinese-zodiac',
        title: 'Chinese Zodiac Sign',
        icon: Activity,
        color: 'hsl(25, 90%, 50%)',
        bgColor: 'hsl(25, 100%, 95%)',
        origin:
          'Based on a 12-year cycle in Chinese astrology, each year associated with an animal sign.',
        component: <ChineseZodiacInput data={data} onUpdate={updateData} />,
      },
      {
        id: 'human-design',
        title: 'Human Design Type',
        icon: Sparkles,
        color: 'hsl(170, 80%, 40%)',
        bgColor: 'hsl(170, 100%, 95%)',
        origin:
          'Created in 1987 by Ra Uru Hu, combining astrology, I Ching, Kabbalah, and chakras.',
        component: <HumanDesignInput data={data} onUpdate={updateData} />,
      },
    ],
    [data, updateData]
  );

  if (isPending || isLoading || isRetrying) {
    return <AssessmentSkeleton />;
  }

  // Allow rendering if either authenticated or in guest mode
  if (!session && !isGuestMode) {
    return null;
  }

  // Show error state with retry option
  if (loadError) {
    return (
      <div className="min-h-screen gradient-soft">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ErrorDisplay
            title="Failed to Load Data"
            message={loadError}
            onRetry={() => retryLoad()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-soft">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Guest Mode Banner */}
        {isGuestMode && (
          <div className="mb-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Guest Mode</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your data is stored locally and won&apos;t be saved
                  permanently. Sign in to save your progress across devices.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/login')}
                  className="mt-2"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Header with back button, title, and layout toggle */}
        <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="h-10 w-10 flex-shrink-0"
              aria-label="Go back to home page"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Personality Assessment
                </h1>
                {isSaving && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-primary" />
                    Saving...
                  </span>
                )}
              </div>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Complete frameworks you know for personalized insights
              </p>
            </div>
          </div>
          <ToggleGroup
            type="single"
            value={layout}
            onValueChange={(value) =>
              value && setLayout(value as 'single' | 'double')
            }
            className="flex-shrink-0"
          >
            <ToggleGroupItem value="single" aria-label="Single column">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="double" aria-label="Two columns">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Accordion of frameworks */}
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={handleAccordionChange}
          className={
            layout === 'double'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
              : 'space-y-4'
          }
        >
          {frameworks.map((f) => {
            const Icon = f.icon;
            const isComplete = isFrameworkComplete(f.id);

            return (
              <AccordionItem
                key={f.id}
                value={f.id}
                className="border rounded-xl shadow-card bg-card overflow-hidden"
              >
                <AccordionTrigger className="px-4 md:px-6 py-4 hover:no-underline hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: f.bgColor }}
                    >
                      <Icon
                        className="h-5 w-5 md:h-6 md:w-6"
                        style={{ color: f.color }}
                      />
                    </div>
                    <span className="font-semibold text-left text-sm md:text-base">
                      {f.title}
                    </span>
                    {isComplete && (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 ml-2">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-6">
                  <div className="pt-4 space-y-4 md:space-y-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.origin}
                    </p>
                    {f.component}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* View Results Button */}
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={handleViewResults}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12"
            aria-label="View my personality insights"
          >
            View My Insights
            <Sparkles className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
