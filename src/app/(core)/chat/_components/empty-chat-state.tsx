import React from 'react';

export default function EmptyChatState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl">💬</div>
        <h3 className="text-lg font-medium text-white">Start a Conversation</h3>
        <p className="mt-2 text-sm text-white/60">
          Ask me anything about my work, skills, or experience
        </p>
      </div>
    </div>
  );
}