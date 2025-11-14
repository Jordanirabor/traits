'use client';

import { Insight } from '@/types/insights';
import React from 'react';
import { InsightCard } from './InsightCard';

interface InsightSectionProps {
  title: string;
  description: string;
  insights: Insight[];
  type: 'improvement' | 'strength' | 'green-flag' | 'red-flag';
  icon: React.ReactNode;
}

export const InsightSection: React.FC<InsightSectionProps> = ({
  title,
  description,
  insights,
  type,
  icon,
}) => {
  const sectionColors = {
    improvement: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      header: 'text-blue-900',
    },
    strength: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'text-purple-600',
      header: 'text-purple-900',
    },
    'green-flag': {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      header: 'text-green-900',
    },
    'red-flag': {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      header: 'text-red-900',
    },
  };

  const colors = sectionColors[type];

  return (
    <section
      className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4 sm:p-6 transition-all hover:shadow-md`}
      aria-labelledby={`section-${type}-title`}
    >
      {/* Section Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`${colors.icon} mt-1 flex-shrink-0`} aria-hidden="true">
          {icon}
        </div>
        <div className="flex-1">
          <h2
            id={`section-${type}-title`}
            className={`text-lg sm:text-xl font-bold ${colors.header} mb-1`}
          >
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">{description}</p>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 ? (
        <div className="space-y-3" role="list" aria-label={`${title} insights`}>
          {insights.map((insight, index) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              type={type}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500" role="status">
          <p className="text-sm">
            No insights available. Complete more assessments for better results.
          </p>
        </div>
      )}
    </section>
  );
};
