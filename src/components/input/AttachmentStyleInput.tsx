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

const attachmentStyles = [
  {
    value: 'secure',
    label: 'Secure',
    description: 'Comfortable with intimacy and independence',
  },
  {
    value: 'anxious',
    label: 'Anxious',
    description: 'Seeks closeness, worries about relationships',
  },
  {
    value: 'avoidant',
    label: 'Avoidant',
    description: 'Values independence, uncomfortable with closeness',
  },
  {
    value: 'fearful',
    label: 'Fearful-Avoidant',
    description: 'Wants closeness but fears getting hurt',
  },
];

export const AttachmentStyleInput = ({ data, onUpdate }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground flex-1">
          Attachment style describes how you form and maintain relationships.
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2 flex-shrink-0"
        >
          <a
            href="https://www.attachmentproject.com/attachment-style-quiz/"
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
          Select Your Attachment Style
        </Label>
        <RadioGroup
          value={data.attachmentStyle || ''}
          onValueChange={(value) => onUpdate({ attachmentStyle: value })}
          className="space-y-3"
        >
          {attachmentStyles.map((style) => (
            <div key={style.value} className="flex items-start space-x-3">
              <RadioGroupItem
                value={style.value}
                id={style.value}
                className="mt-1"
              />
              <Label
                htmlFor={style.value}
                className="flex-1 cursor-pointer p-4 rounded-lg border-2 border-muted hover:border-primary/50 transition-smooth"
              >
                <div className="font-semibold">{style.label}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {style.description}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
