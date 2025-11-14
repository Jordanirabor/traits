'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Activity,
  Brain,
  Heart,
  Smile,
  Sparkles,
  Star,
  Target,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen gradient-soft">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 mb-6">
            <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Personality Finder
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            A free tool for exploring and comparing different personality
            systems to encourage self-discovery and growth.
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/assessment')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto"
            aria-label="Start your personality assessment journey"
          >
            Start Your Journey
            <Sparkles
              className="ml-2 h-4 w-4 md:h-5 md:w-5"
              aria-hidden="true"
            />
          </Button>
        </div>

        <Card className="p-6 md:p-8 shadow-card bg-card/50 backdrop-blur-sm border border-border/50">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
            Frameworks We Analyze
          </h2>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            role="list"
            aria-label="Personality frameworks"
          >
            <div
              className="flex flex-col items-center text-center gap-3"
              role="listitem"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[hsl(210,100%,95%)] flex items-center justify-center"
                aria-hidden="true"
              >
                <Brain className="h-6 w-6 md:h-7 md:w-7 text-[hsl(210,100%,50%)]" />
              </div>
              <div>
                <p className="font-semibold text-sm md:text-base">Big Five</p>
                <p className="text-xs text-muted-foreground hidden md:block">
                  Core traits
                </p>
              </div>
            </div>
            <div
              className="flex flex-col items-center text-center gap-3"
              role="listitem"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[hsl(280,100%,95%)] flex items-center justify-center"
                aria-hidden="true"
              >
                <Users className="h-6 w-6 md:h-7 md:w-7 text-[hsl(280,70%,55%)]" />
              </div>
              <div>
                <p className="font-semibold text-sm md:text-base">MBTI</p>
                <p className="text-xs text-muted-foreground hidden md:block">
                  16 types
                </p>
              </div>
            </div>
            <div
              className="flex flex-col items-center text-center gap-3"
              role="listitem"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[hsl(142,100%,95%)] flex items-center justify-center"
                aria-hidden="true"
              >
                <Heart className="h-6 w-6 md:h-7 md:w-7 text-[hsl(142,71%,45%)]" />
              </div>
              <div>
                <p className="font-semibold text-sm md:text-base">Attachment</p>
                <p className="text-xs text-muted-foreground hidden md:block">
                  Bonding style
                </p>
              </div>
            </div>
            <div
              className="flex flex-col items-center text-center gap-3"
              role="listitem"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[hsl(350,100%,95%)] flex items-center justify-center"
                aria-hidden="true"
              >
                <Smile className="h-6 w-6 md:h-7 md:w-7 text-[hsl(350,80%,55%)]" />
              </div>
              <div>
                <p className="font-semibold text-sm md:text-base">Love Lang.</p>
                <p className="text-xs text-muted-foreground hidden md:block">
                  Expression
                </p>
              </div>
            </div>
            <div
              className="flex flex-col items-center text-center gap-3"
              role="listitem"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[hsl(45,100%,95%)] flex items-center justify-center"
                aria-hidden="true"
              >
                <Star className="h-6 w-6 md:h-7 md:w-7 text-[hsl(45,100%,50%)]" />
              </div>
              <div>
                <p className="font-semibold text-sm md:text-base">Zodiac</p>
                <p className="text-xs text-muted-foreground hidden md:block">
                  Astrology
                </p>
              </div>
            </div>
            <div
              className="flex flex-col items-center text-center gap-3"
              role="listitem"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[hsl(25,100%,95%)] flex items-center justify-center"
                aria-hidden="true"
              >
                <Activity className="h-6 w-6 md:h-7 md:w-7 text-[hsl(25,90%,50%)]" />
              </div>
              <div>
                <p className="font-semibold text-sm md:text-base">Chinese</p>
                <p className="text-xs text-muted-foreground hidden md:block">
                  Zodiac
                </p>
              </div>
            </div>
            <div
              className="flex flex-col items-center text-center gap-3"
              role="listitem"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[hsl(170,100%,95%)] flex items-center justify-center"
                aria-hidden="true"
              >
                <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-[hsl(170,80%,40%)]" />
              </div>
              <div>
                <p className="font-semibold text-sm md:text-base">
                  Human Design
                </p>
                <p className="text-xs text-muted-foreground hidden md:block">
                  Energy type
                </p>
              </div>
            </div>
            <div
              className="flex flex-col items-center text-center gap-3"
              role="listitem"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[hsl(260,100%,95%)] flex items-center justify-center"
                aria-hidden="true"
              >
                <Target className="h-6 w-6 md:h-7 md:w-7 text-[hsl(260,70%,55%)]" />
              </div>
              <div>
                <p className="font-semibold text-sm md:text-base">Enneagram</p>
                <p className="text-xs text-muted-foreground hidden md:block">
                  9 types
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8 md:mt-12 text-center">
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            🔒 Your privacy matters. All data is stored locally on your device.
            We collect no personally identifiable information. These insights
            are for self-reflection, not clinical diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
}
