import { PersonalityData } from "@/lib/storage";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Props {
  data: PersonalityData;
  onUpdate: (data: Partial<PersonalityData>) => void;
}

const enneagramTypes = [
  { value: "1", label: "Type 1: The Reformer", description: "Principled, purposeful, self-controlled, perfectionistic" },
  { value: "2", label: "Type 2: The Helper", description: "Generous, demonstrative, people-pleasing, possessive" },
  { value: "3", label: "Type 3: The Achiever", description: "Adaptable, excelling, driven, image-conscious" },
  { value: "4", label: "Type 4: The Individualist", description: "Expressive, dramatic, self-absorbed, temperamental" },
  { value: "5", label: "Type 5: The Investigator", description: "Perceptive, innovative, isolated, detached" },
  { value: "6", label: "Type 6: The Loyalist", description: "Engaging, responsible, anxious, suspicious" },
  { value: "7", label: "Type 7: The Enthusiast", description: "Spontaneous, versatile, scattered, acquisitive" },
  { value: "8", label: "Type 8: The Challenger", description: "Self-confident, decisive, willful, confrontational" },
  { value: "9", label: "Type 9: The Peacemaker", description: "Receptive, reassuring, complacent, resigned" },
];

export const EnneagramInput = ({ data, onUpdate }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground flex-1">
          The Enneagram describes nine personality types, each with distinct motivations, fears, and behaviors.
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2 flex-shrink-0"
        >
          <a
            href="https://www.enneagraminstitute.com/type-descriptions"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3 w-3" />
            Take Test
          </a>
        </Button>
      </div>

      <div>
        <Label htmlFor="enneagram" className="text-base font-semibold mb-3 block">
          Enneagram Type
        </Label>
        <Select value={data.enneagram || ""} onValueChange={(value) => onUpdate({ enneagram: value })}>
          <SelectTrigger id="enneagram" className="w-full">
            <SelectValue placeholder="Select your Enneagram type" />
          </SelectTrigger>
          <SelectContent>
            {enneagramTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{type.label}</span>
                  <span className="text-xs text-muted-foreground">{type.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {data.enneagram && (
        <div>
          <Label className="text-base font-semibold mb-3 block">Your Enneagram Type</Label>
          <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
            <p className="text-lg font-bold">
              {enneagramTypes.find(t => t.value === data.enneagram)?.label}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {enneagramTypes.find(t => t.value === data.enneagram)?.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
