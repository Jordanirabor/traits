'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ReferencePersonalityData } from '@/lib/adapters/personalityDataAdapter';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Props {
  data: ReferencePersonalityData;
  onUpdate: (data: Partial<ReferencePersonalityData>) => void;
}

const zodiacSigns = [
  { sign: 'Aries', start: '03-21', end: '04-19', symbol: '♈', emoji: '🐏' },
  { sign: 'Taurus', start: '04-20', end: '05-20', symbol: '♉', emoji: '🐂' },
  { sign: 'Gemini', start: '05-21', end: '06-20', symbol: '♊', emoji: '👯' },
  { sign: 'Cancer', start: '06-21', end: '07-22', symbol: '♋', emoji: '🦀' },
  { sign: 'Leo', start: '07-23', end: '08-22', symbol: '♌', emoji: '🦁' },
  { sign: 'Virgo', start: '08-23', end: '09-22', symbol: '♍', emoji: '👧' },
  { sign: 'Libra', start: '09-23', end: '10-22', symbol: '♎', emoji: '⚖️' },
  { sign: 'Scorpio', start: '10-23', end: '11-21', symbol: '♏', emoji: '🦂' },
  {
    sign: 'Sagittarius',
    start: '11-22',
    end: '12-21',
    symbol: '♐',
    emoji: '🏹',
  },
  {
    sign: 'Capricorn',
    start: '12-22',
    end: '01-19',
    symbol: '♑',
    emoji: '🐐',
  },
  { sign: 'Aquarius', start: '01-20', end: '02-18', symbol: '♒', emoji: '🏺' },
  { sign: 'Pisces', start: '02-19', end: '03-20', symbol: '♓', emoji: '🐟' },
];

const calculateZodiac = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  for (const { sign, start, end } of zodiacSigns) {
    const [startMonth, startDay] = start.split('-');
    const [endMonth, endDay] = end.split('-');

    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) return sign;
    } else {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      )
        return sign;
    }
  }
  return '';
};

const calculateChineseZodiac = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const chineseZodiacSigns = [
    'rat',
    'ox',
    'tiger',
    'rabbit',
    'dragon',
    'snake',
    'horse',
    'goat',
    'monkey',
    'rooster',
    'dog',
    'pig',
  ];
  const zodiacIndex = (year - 1924) % 12;
  return chineseZodiacSigns[zodiacIndex];
};

export const ZodiacInput = ({ data, onUpdate }: Props) => {
  const [inputMethod, setInputMethod] = useState<'birthdate' | 'direct'>(
    'birthdate'
  );

  const handleDateChange = (dateStr: string) => {
    if (dateStr) {
      const zodiac = calculateZodiac(dateStr);
      const chineseZodiac = calculateChineseZodiac(dateStr);
      onUpdate({ dateOfBirth: dateStr, zodiacSign: zodiac, chineseZodiac });
    }
  };

  const handleDirectSelect = (zodiac: string) => {
    onUpdate({ zodiacSign: zodiac });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground flex-1">
          Western astrology dates back to ancient Babylon.
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2 flex-shrink-0"
        >
          <a
            href="https://www.astro.com/cgi/atxgen.cgi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3 w-3" />
            Get Chart
          </a>
        </Button>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">
          Input Method
        </Label>
        <RadioGroup
          value={inputMethod}
          onValueChange={(value: 'birthdate' | 'direct') =>
            setInputMethod(value)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="birthdate" id="birthdate" />
            <Label htmlFor="birthdate" className="font-normal cursor-pointer">
              Calculate from birthdate
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="direct" id="direct" />
            <Label htmlFor="direct" className="font-normal cursor-pointer">
              Select directly
            </Label>
          </div>
        </RadioGroup>
      </div>

      {inputMethod === 'birthdate' ? (
        <div>
          <Label htmlFor="dob" className="text-base font-semibold mb-3 block">
            Date of Birth
          </Label>
          <Input
            id="dob"
            type="date"
            value={data.dateOfBirth || ''}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full"
          />
        </div>
      ) : (
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Select Your Zodiac Sign
          </Label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {zodiacSigns.map(({ sign, symbol }) => (
              <button
                key={sign}
                type="button"
                onClick={() => handleDirectSelect(sign)}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center gap-1 ${
                  data.zodiacSign === sign
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 bg-card'
                }`}
              >
                <span className="text-2xl">{symbol}</span>
                <span className="text-xs font-medium">{sign}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {data.zodiacSign && (
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Your Zodiac Sign
          </Label>
          <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
            <p className="text-lg font-bold">{data.zodiacSign}</p>
          </div>
        </div>
      )}
    </div>
  );
};
