import React from 'react';

import { LoadingDots } from '../../_components/loading-dots';

interface ProcessingIndicatorProps {
  isProcessing: boolean;
  processLabel: string;
}

export default function ProcessingIndicator({
  isProcessing,
  processLabel,
}: ProcessingIndicatorProps) {
  if (!isProcessing) {
    return null;
  }

  return (
    <span className='mx-4 flex items-center justify-start gap-4 italic md:mx-0'>
      {processLabel} <LoadingDots />
    </span>
  );
}
