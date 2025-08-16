import React from 'react';

import {
  detectIntroductionInquiry,
  detectResumeInquiry,
  detectSkillsInquiry,
  detectSummaryInquiry,
} from '@/lib/chat-utils';

export interface SpecialMessageTypesState {
  showIntroduction: boolean;
  showSkills: boolean;
  showResume: boolean;
  showSummary: boolean;
}

export interface SpecialMessageTypesActions {
  detectAndSetMessageTypes: (text: string) => SpecialMessageTypesState;
  resetMessageTypes: () => void;
  setShowIntroduction: (show: boolean) => void;
  setShowSkills: (show: boolean) => void;
  setShowResume: (show: boolean) => void;
  setShowSummary: (show: boolean) => void;
}

export function useSpecialMessageTypes(): SpecialMessageTypesState & SpecialMessageTypesActions {
  const [showIntroduction, setShowIntroduction] = React.useState(false);
  const [showSkills, setShowSkills] = React.useState(false);
  const [showResume, setShowResume] = React.useState(false);
  const [showSummary, setShowSummary] = React.useState(false);

  const detectAndSetMessageTypes = React.useCallback((text: string): SpecialMessageTypesState => {
    const isIntroduction = detectIntroductionInquiry(text);
    const isSkillInquiry = detectSkillsInquiry(text);
    const isResumeInquiry = detectResumeInquiry(text);
    const isSummaryInquiry = detectSummaryInquiry(text);

    if (isIntroduction) {
      setShowIntroduction(true);
    }
    if (isSkillInquiry) {
      setShowSkills(true);
    }
    if (isSummaryInquiry) {
      setShowSummary(true);
    }
    if (isResumeInquiry) {
      setShowResume(true);
    }

    return {
      showIntroduction: isIntroduction,
      showSkills: isSkillInquiry,
      showResume: isResumeInquiry,
      showSummary: isSummaryInquiry,
    };
  }, []);

  const resetMessageTypes = React.useCallback(() => {
    setShowIntroduction(false);
    setShowSkills(false);
    setShowResume(false);
    setShowSummary(false);
  }, []);

  return {
    showIntroduction,
    showSkills,
    showResume,
    showSummary,
    detectAndSetMessageTypes,
    resetMessageTypes,
    setShowIntroduction,
    setShowSkills,
    setShowResume,
    setShowSummary,
  };
}