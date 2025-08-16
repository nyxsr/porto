import React from 'react';

import { cn } from '@/lib/utils';
import { Skill, Stack } from '@/constants/skills';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Visual indicators for different skill levels
const getLevelStyles = (level: number) => {
  // Base styles for all levels
  const baseStyles =
    'flex cursor-pointer items-center gap-2 rounded-xl border px-2 transition-all duration-200';

  switch (level) {
    case 5: // Expert - Bold, glowing effect
      return cn(
        baseStyles,
        'border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20',
        'shadow-[0_0_10px_rgba(16,185,129,0.2)] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        'font-semibold',
      );
    case 4: // Advanced - Strong presence
      return cn(
        baseStyles,
        'border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20',
        'shadow-sm hover:shadow-md',
        'font-medium',
      );
    case 3: // Intermediate - Solid
      return cn(
        baseStyles,
        'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/15',
        'hover:shadow-sm',
      );
    case 2: // Basic - Simple
      return cn(baseStyles, 'border-gray-500/25 bg-gray-500/5 hover:bg-gray-500/10', 'opacity-90');
    case 1: // Beginner - Subtle
      return cn(baseStyles, 'border-gray-600/20 bg-transparent hover:bg-gray-500/5', 'opacity-75');
    default:
      return baseStyles;
  }
};

// Visual indicator dots for skill level
const SkillLevelIndicator = ({ level }: { level: number }) => {
  return (
    <div className='ml-1 flex gap-0.5'>
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={cn(
            'h-1 w-1 rounded-full transition-all duration-200',
            dot <= level
              ? level === 5
                ? 'bg-emerald-400 shadow-[0_0_3px_rgba(52,211,153,0.5)]'
                : level === 4
                  ? 'bg-blue-400'
                  : level === 3
                    ? 'bg-purple-400'
                    : 'bg-gray-400'
              : 'bg-gray-700',
          )}
        />
      ))}
    </div>
  );
};

export default function SkillBadge({
  skill,
  visibleSkill,
  hiddenSkill,
}: {
  skill: Skill;
  visibleSkill: Stack[];
  hiddenSkill: Stack[];
}) {
  const goToLink = (url: string) => {
    window.open(url, '_blank');
  };

  // Sort skills by level (highest first) for visual hierarchy
  const sortedVisibleSkills = [...visibleSkill].sort((a, b) => b.level - a.level);
  const sortedHiddenSkills = [...hiddenSkill].sort((a, b) => b.level - a.level);

  return (
    <div
      key={skill.section}
      className='flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm'
    >
      <div className='flex items-center gap-3 text-lg font-semibold text-white'>
        <span className='text-white/60'>{skill.icon}</span>
        {skill.section}
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        {sortedVisibleSkills.map((stack) => (
          <Tooltip key={stack.name}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => goToLink(stack.url || '#')}
                variant='ghost'
                className={getLevelStyles(stack.level)}
              >
                {stack.icon && <span className='text-sm'>{stack.icon}</span>}
                <span
                  className={cn(
                    'text-xs',
                    stack.level >= 4 && 'text-white',
                    stack.level === 3 && 'text-white/90',
                    stack.level <= 2 && 'text-white/80',
                  )}
                >
                  {stack.name}
                </span>
                <SkillLevelIndicator level={stack.level} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='border-white/10 bg-black/90 text-white'>
              <div className='space-y-1'>
                <div className='text-xs font-medium'>{stack.name}</div>
                <div className='text-xs text-white/60'>
                  {stack.level === 5 && 'Expert'}
                  {stack.level === 4 && 'Advanced'}
                  {stack.level === 3 && 'Intermediate'}
                  {stack.level === 2 && 'Basic'}
                  {stack.level === 1 && 'Learning'}
                </div>
                {stack.url && (
                  <div className='text-xs text-blue-400 hover:underline'>{stack.url}</div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
        {sortedHiddenSkills.length > 0 && (
          <HoverCard>
            <HoverCardTrigger className='flex cursor-pointer items-center gap-1 rounded-xl border border-white/20 bg-white/5 px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/10'>
              <span className='font-medium'>+{sortedHiddenSkills.length}</span>
              <span>more</span>
            </HoverCardTrigger>
            <HoverCardContent className='flex flex-wrap items-center gap-2 rounded-lg border-white/10 bg-black/95 p-4 shadow-xl backdrop-blur-md'>
              {sortedHiddenSkills.map((stack) => (
                <Tooltip key={stack.name}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => goToLink(stack.url || '#')}
                      variant='ghost'
                      className={getLevelStyles(stack.level)}
                    >
                      {stack.icon && <span className='text-sm'>{stack.icon}</span>}
                      <span
                        className={cn(
                          'text-xs',
                          stack.level >= 4 && 'text-white',
                          stack.level === 3 && 'text-white/90',
                          stack.level <= 2 && 'text-white/80',
                        )}
                      >
                        {stack.name}
                      </span>
                      <SkillLevelIndicator level={stack.level} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className='border-white/10 bg-black/90 text-white'>
                    <div className='space-y-1'>
                      <div className='text-xs font-medium'>{stack.name}</div>
                      <div className='text-xs text-white/60'>
                        {stack.level === 5 && 'Expert'}
                        {stack.level === 4 && 'Advanced'}
                        {stack.level === 3 && 'Intermediate'}
                        {stack.level === 2 && 'Basic'}
                        {stack.level === 1 && 'Learning'}
                      </div>
                      {stack.url && (
                        <div className='text-xs text-blue-400 hover:underline'>{stack.url}</div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    </div>
  );
}
