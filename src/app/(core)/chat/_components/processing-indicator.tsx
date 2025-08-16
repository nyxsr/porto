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
    <span className="flex items-center justify-start gap-4 italic">
      {processLabel} <LoadingDots />
    </span>
  );
}