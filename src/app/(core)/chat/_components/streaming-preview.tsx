import React from 'react';

import BubbleChat from './bubble-chat';
import SpecialMessageRenderer from './special-message-renderer';

interface StreamingPreviewProps {
  streamingDraft: string;
  showIntroduction?: boolean;
  showSkills?: boolean;
  showResume?: boolean;
  showSummary?: boolean;
}

export default function StreamingPreview({
  streamingDraft,
  showIntroduction,
  showSkills,
  showResume,
  showSummary,
}: StreamingPreviewProps) {
  if (!streamingDraft) {
    return null;
  }

  return (
    <div className='space-y-4'>
      <SpecialMessageRenderer
        showIntro={showIntroduction}
        showSkills={showSkills}
        showResume={showResume}
        showSummary={showSummary}
      />
      <BubbleChat key='__streaming_draft' message={streamingDraft} role='assistant' />
    </div>
  );
}
