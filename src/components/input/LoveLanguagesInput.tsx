'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ReferencePersonalityData } from '@/lib/adapters/personalityDataAdapter';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ExternalLink, GripVertical } from 'lucide-react';

interface Props {
  data: ReferencePersonalityData;
  onUpdate: (data: Partial<ReferencePersonalityData>) => void;
}

const allLoveLanguages = [
  {
    value: 'words',
    label: 'Words of Affirmation',
    description: 'Verbal expressions of love and appreciation',
  },
  {
    value: 'quality',
    label: 'Quality Time',
    description: 'Undivided attention and meaningful activities',
  },
  {
    value: 'gifts',
    label: 'Receiving Gifts',
    description: 'Thoughtful presents and tokens of affection',
  },
  {
    value: 'service',
    label: 'Acts of Service',
    description: 'Helpful actions that make life easier',
  },
  {
    value: 'touch',
    label: 'Physical Touch',
    description: 'Physical expressions of affection',
  },
];

interface SortableItemProps {
  id: string;
  label: string;
  description: string;
  rank: number;
}

function SortableItem({ id, label, description, rank }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 rounded-lg border-2 border-muted bg-card hover:border-primary/50 transition-smooth"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">#{rank}</span>
          <span className="font-semibold">{label}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">{description}</div>
      </div>
    </div>
  );
}

export const LoveLanguagesInput = ({ data, onUpdate }: Props) => {
  const selected = data.loveLanguages || allLoveLanguages.map((l) => l.value);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = selected.indexOf(active.id as string);
      const newIndex = selected.indexOf(over.id as string);
      const newOrder = arrayMove(selected, oldIndex, newIndex);
      onUpdate({ loveLanguages: newOrder });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground flex-1">
          Love languages describe how you prefer to give and receive affection.
          Drag to rank them in order of importance (most important at the top).
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2 flex-shrink-0"
        >
          <a
            href="https://www.5lovelanguages.com/quizzes/love-language"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-3 w-3" />
            Take Quiz
          </a>
        </Button>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">
          Rank Your Love Languages
        </Label>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selected}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {selected.map((value, index) => {
                const language = allLoveLanguages.find(
                  (l) => l.value === value
                );
                if (!language) return null;
                return (
                  <SortableItem
                    key={value}
                    id={value}
                    label={language.label}
                    description={language.description}
                    rank={index + 1}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
