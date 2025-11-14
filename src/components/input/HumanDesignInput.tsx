'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReferencePersonalityData } from '@/lib/adapters/personalityDataAdapter';
import { ExternalLink } from 'lucide-react';

interface Props {
  data: ReferencePersonalityData;
  onUpdate: (data: Partial<ReferencePersonalityData>) => void;
}

const humanDesignTypes = [
  {
    value: 'manifestor',
    label: 'Manifestor',
    description: 'Independent initiators who impact others',
  },
  {
    value: 'generator',
    label: 'Generator',
    description: 'Sustainable life force energy builders',
  },
  {
    value: 'manifesting-generator',
    label: 'Manifesting Generator',
    description: 'Multi-passionate efficient doers',
  },
  {
    value: 'projector',
    label: 'Projector',
    description: 'Natural guides who see systems clearly',
  },
  {
    value: 'reflector',
    label: 'Reflector',
    description: 'Mirrors of community health and wisdom',
  },
];

export const HumanDesignInput = ({ data, onUpdate }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground flex-1">
          Human Design combines astrology, I Ching, Kabbalah, and the chakra
          system.
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2 flex-shrink-0"
        >
          <a
            href="https://www.jovianarchive.com/Get_Your_Chart"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3 w-3" />
            Get Chart
          </a>
        </Button>
      </div>

      <div>
        <Label
          htmlFor="human-design"
          className="text-base font-semibold mb-3 block"
        >
          Your Human Design Type
        </Label>
        <Select
          value={data.humanDesign || ''}
          onValueChange={(value) => onUpdate({ humanDesign: value })}
        >
          <SelectTrigger id="human-design" className="w-full">
            <SelectValue placeholder="Select your type" />
          </SelectTrigger>
          <SelectContent>
            {humanDesignTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {type.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
