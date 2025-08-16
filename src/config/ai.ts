export const STRICT_MIN = Number(process.env.STRICT_MIN ?? 0.82);
export const MERGE_MIN = Number(process.env.MERGE_MIN ?? 0.7);

export const MODEL = 'gpt-5-nano';

export type Mode = 'grounded' | 'merge' | 'general' | 'oob';
