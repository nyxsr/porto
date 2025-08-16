import React from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';

import { Self } from '@/assets';
import { SKILLS } from '@/constants/skills';
import { Button } from '@/components/ui/button';
import { useResumeDownloader } from '@/hooks/useResumeDownloader';

import SkillBadge from './skill-badge';

interface SpecialMessageRendererProps {
  showIntro?: boolean;
  showSkills?: boolean;
  showResume?: boolean;
  showSummary?: boolean;
}

export default function SpecialMessageRenderer({
  showIntro,
  showSkills,
  showResume,
  showSummary,
}: SpecialMessageRendererProps) {
  const { download } = useResumeDownloader();

  if (!showIntro && !showSkills && !showResume && !showSummary) {
    return null;
  }

  return (
    <div className="space-y-4">
      {showIntro && (
        <div className="flex items-center justify-start gap-4">
          <Image
            src={Self}
            alt="Sahrul Ramdan"
            width={150}
            height={150}
            className="rounded-lg"
          />
          <div className="flex flex-col">
            <div className="text-2xl font-medium text-white">Sahrul Ramdan</div>
            <div className="text-sm text-white/60">Fullstack Engineer</div>
            <small>But more like into Frontend Engineer</small>
          </div>
        </div>
      )}

      {showSkills && (
        <div className="rounded-lg bg-white/5 p-4">
          <div className="mb-2 text-lg font-semibold text-white">Skills & Expertise</div>
          <small className="text-white/80">
            Maybe that&apos;s quite a lot of skills, but trust me, it will be even more in the
            future.
          </small>
          <div className="mt-3 grid grid-cols-3 gap-4">
            {SKILLS.map((skill) => {
              const visibleSkill = skill.stacks.slice(0, 5);
              const hiddenSkill = skill.stacks.slice(5);
              return (
                <SkillBadge
                  key={skill.section}
                  skill={skill}
                  hiddenSkill={hiddenSkill}
                  visibleSkill={visibleSkill}
                />
              );
            })}
          </div>
        </div>
      )}

      {(showResume || showSummary) && (
        <div className="flex items-center justify-between gap-5 rounded-lg bg-white/5 p-4">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Sahrul&apos;s Ramdan Resume</p>
            <p className="text-muted-foreground text-sm">Full Stack Developer</p>
            <p className="flex items-center text-xs">
              <span>PDF</span>
              <span className="before:mx-2 before:content-['•']">Updated August 2025</span>
              <span className="before:mx-2 before:content-['•']">91 KB</span>
            </p>
          </div>
          <Button onClick={download} className="cursor-pointer rounded-full text-black">
            <Download />
          </Button>
        </div>
      )}
    </div>
  );
}