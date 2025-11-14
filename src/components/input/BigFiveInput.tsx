'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ReferencePersonalityData } from '@/lib/adapters/personalityDataAdapter';
import { ExternalLink } from 'lucide-react';

interface Props {
  data: ReferencePersonalityData;
  onUpdate: (data: Partial<ReferencePersonalityData>) => void;
}

const traits = [
  {
    key: 'openness' as const,
    label: 'Openness to Experience',
    description: 'Imagination, curiosity, creativity',
    low: 'Practical & Traditional',
    high: 'Creative & Curious',
  },
  {
    key: 'conscientiousness' as const,
    label: 'Conscientiousness',
    description: 'Organization, responsibility, discipline',
    low: 'Flexible & Spontaneous',
    high: 'Organized & Disciplined',
  },
  {
    key: 'extraversion' as const,
    label: 'Extraversion',
    description: 'Sociability, assertiveness, energy',
    low: 'Introverted & Reserved',
    high: 'Outgoing & Energetic',
  },
  {
    key: 'agreeableness' as const,
    label: 'Agreeableness',
    description: 'Compassion, cooperation, trust',
    low: 'Competitive & Skeptical',
    high: 'Compassionate & Trusting',
  },
  {
    key: 'neuroticism' as const,
    label: 'Emotional Sensitivity',
    description: 'Emotional responsiveness, stress reactions',
    low: 'Emotionally Stable',
    high: 'Emotionally Sensitive',
  },
];

export const BigFiveInput = ({ data, onUpdate }: Props) => {
  const bigFive = data.bigFive || {
    openness: 50,
    conscientiousness: 50,
    extraversion: 50,
    agreeableness: 50,
    neuroticism: 50,
  };

  const handleChange = (key: keyof typeof bigFive, value: number[]) => {
    onUpdate({
      bigFive: {
        ...bigFive,
        [key]: value[0],
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground flex-1">
          The Big Five measures core personality dimensions. Rate yourself on
          each trait below.
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2 flex-shrink-0"
        >
          <a
            href="https://www.truity.com/test/big-five-personality-test"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3 w-3" />
            Take Test
          </a>
        </Button>
      </div>

      {traits.map((trait) => (
        <div key={trait.key} className="space-y-3">
          <div>
            <Label className="text-base font-semibold">{trait.label}</Label>
            <p className="text-sm text-muted-foreground">{trait.description}</p>
          </div>

          <div className="space-y-2">
            <Slider
              value={[bigFive[trait.key]]}
              onValueChange={(value) => handleChange(trait.key, value)}
              max={100}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{trait.low}</span>
              <span className="font-medium text-foreground">
                {bigFive[trait.key]}%
              </span>
              <span>{trait.high}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
