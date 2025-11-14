'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ReferencePersonalityData } from '@/lib/adapters/personalityDataAdapter';
import { ExternalLink } from 'lucide-react';

interface Props {
  data: ReferencePersonalityData;
  onUpdate: (data: Partial<ReferencePersonalityData>) => void;
}

const mbtiTypes = [
  'INTJ',
  'INTP',
  'ENTJ',
  'ENTP',
  'INFJ',
  'INFP',
  'ENFJ',
  'ENFP',
  'ISTJ',
  'ISFJ',
  'ESTJ',
  'ESFJ',
  'ISTP',
  'ISFP',
  'ESTP',
  'ESFP',
];

export const MBTIInput = ({ data, onUpdate }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground flex-1">
          Select your MBTI type from the 16 personality categories.
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2 flex-shrink-0"
        >
          <a
            href="https://www.16personalities.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3 w-3" />
            Take Test
          </a>
        </Button>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">
          Select Your MBTI Type
        </Label>
        <RadioGroup
          value={data.mbti || ''}
          onValueChange={(value) => onUpdate({ mbti: value })}
          className="grid grid-cols-4 gap-3"
        >
          {mbtiTypes.map((type) => (
            <div key={type} className="flex items-center">
              <RadioGroupItem value={type} id={type} className="peer sr-only" />
              <Label
                htmlFor={type}
                className="flex items-center justify-center rounded-lg border-2 border-muted bg-card px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-smooth w-full text-center font-medium"
              >
                {type}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
