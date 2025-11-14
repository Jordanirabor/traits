import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Insight } from '@/types/insights';

// Support both direct props (reference app style) and insight object (current app style)
interface DirectProps {
  title: string;
  description: string;
  reasoning?: string;
  explanation?: string;
  type: 'improvement' | 'strength' | 'greenFlag' | 'redFlag';
  insight?: never;
  index?: never;
}

interface InsightObjectProps {
  insight: Insight;
  type: 'improvement' | 'strength' | 'green-flag' | 'red-flag';
  index?: number;
  title?: never;
  description?: never;
  reasoning?: never;
  explanation?: never;
}

type InsightCardProps = DirectProps | InsightObjectProps;

const typeStyles = {
  improvement: 'border-l-4 border-l-primary bg-primary/5',
  strength: 'border-l-4 border-l-accent bg-accent/5',
  greenFlag: 'border-l-4 border-l-success bg-success/5',
  'green-flag': 'border-l-4 border-l-success bg-success/5',
  redFlag: 'border-l-4 border-l-destructive bg-destructive/5',
  'red-flag': 'border-l-4 border-l-destructive bg-destructive/5',
};

export const InsightCard = (props: InsightCardProps) => {
  // Determine if we're using direct props or insight object
  const isDirectProps = 'title' in props;

  const title = isDirectProps ? props.title : props.insight.title;
  const description = isDirectProps
    ? props.description
    : props.insight.description;
  const type = props.type;

  // Support both 'reasoning' (reference app) and 'explanation' (current app)
  const reasoningText = isDirectProps
    ? props.reasoning || props.explanation || ''
    : props.insight.explanation;

  return (
    <Card
      className={cn(
        'p-5 md:p-6 shadow-card transition-smooth',
        typeStyles[type]
      )}
    >
      <h3 className="font-semibold text-base md:text-lg mb-2">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
        {description}
      </p>
      {reasoningText && (
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs md:text-sm text-muted-foreground/80 italic leading-relaxed">
            <span className="font-semibold not-italic">Why: </span>
            {reasoningText}
          </p>
        </div>
      )}
    </Card>
  );
};
