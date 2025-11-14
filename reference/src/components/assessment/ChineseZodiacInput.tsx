import { useState } from "react";
import { PersonalityData } from "@/lib/storage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Props {
  data: PersonalityData;
  onUpdate: (data: Partial<PersonalityData>) => void;
}

const chineseZodiacSigns = [
  { value: "rat", label: "Rat", years: "1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020" },
  { value: "ox", label: "Ox", years: "1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021" },
  { value: "tiger", label: "Tiger", years: "1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022" },
  { value: "rabbit", label: "Rabbit", years: "1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023" },
  { value: "dragon", label: "Dragon", years: "1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024" },
  { value: "snake", label: "Snake", years: "1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025" },
  { value: "horse", label: "Horse", years: "1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014" },
  { value: "goat", label: "Goat", years: "1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015" },
  { value: "monkey", label: "Monkey", years: "1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016" },
  { value: "rooster", label: "Rooster", years: "1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017" },
  { value: "dog", label: "Dog", years: "1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018" },
  { value: "pig", label: "Pig", years: "1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019" },
];

const calculateChineseZodiac = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const zodiacIndex = (year - 1924) % 12;
  return chineseZodiacSigns[zodiacIndex].value;
};

export const ChineseZodiacInput = ({ data, onUpdate }: Props) => {
  const [inputMethod, setInputMethod] = useState<"birthdate" | "direct">("birthdate");

  const handleDateChange = (dateStr: string) => {
    if (dateStr) {
      const zodiac = calculateChineseZodiac(dateStr);
      onUpdate({ dateOfBirth: dateStr, chineseZodiac: zodiac });
    }
  };

  const handleDirectSelect = (zodiac: string) => {
    onUpdate({ chineseZodiac: zodiac });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground flex-1">
          Based on a 12-year cycle in Chinese astrology.
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2 flex-shrink-0"
        >
          <a
            href="https://www.chinahighlights.com/travelguide/chinese-zodiac/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3 w-3" />
            Learn More
          </a>
        </Button>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Input Method</Label>
        <RadioGroup value={inputMethod} onValueChange={(value: "birthdate" | "direct") => setInputMethod(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="birthdate" id="cz-birthdate" />
            <Label htmlFor="cz-birthdate" className="font-normal cursor-pointer">Calculate from birthdate</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="direct" id="cz-direct" />
            <Label htmlFor="cz-direct" className="font-normal cursor-pointer">Select directly</Label>
          </div>
        </RadioGroup>
      </div>

      {inputMethod === "birthdate" ? (
        <div>
          <Label htmlFor="dob-chinese" className="text-base font-semibold mb-3 block">
            Date of Birth
          </Label>
          <Input
            id="dob-chinese"
            type="date"
            value={data.dateOfBirth || ""}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full"
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="chinese-zodiac-select" className="text-base font-semibold mb-3 block">
            Chinese Zodiac Sign
          </Label>
          <Select value={data.chineseZodiac || ""} onValueChange={handleDirectSelect}>
            <SelectTrigger id="chinese-zodiac-select" className="w-full">
              <SelectValue placeholder="Select your Chinese zodiac sign" />
            </SelectTrigger>
            <SelectContent>
              {chineseZodiacSigns.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {data.chineseZodiac && (
        <div>
          <Label className="text-base font-semibold mb-3 block">Your Chinese Zodiac</Label>
          <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
            <p className="text-lg font-bold capitalize">{data.chineseZodiac}</p>
          </div>
        </div>
      )}
    </div>
  );
};
