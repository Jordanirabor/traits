import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  reasoning: string;
  type: "improvement" | "strength" | "greenFlag" | "redFlag";
}

const typeStyles = {
  improvement: "border-l-4 border-l-primary bg-primary/5",
  strength: "border-l-4 border-l-accent bg-accent/5",
  greenFlag: "border-l-4 border-l-success bg-success/5",
  redFlag: "border-l-4 border-l-destructive bg-destructive/5",
};

export const InsightCard = ({ title, description, reasoning, type }: Props) => {
  return (
    <Card className={cn("p-5 md:p-6 shadow-card transition-smooth", typeStyles[type])}>
      <h3 className="font-semibold text-base md:text-lg mb-2">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">{description}</p>
      <div className="pt-3 border-t border-border/50">
        <p className="text-xs md:text-sm text-muted-foreground/80 italic leading-relaxed">
          <span className="font-semibold not-italic">Why: </span>
          {reasoning}
        </p>
      </div>
    </Card>
  );
};
