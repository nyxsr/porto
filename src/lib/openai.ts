import OpenAI from 'openai';

// This should only be used on the server side
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
