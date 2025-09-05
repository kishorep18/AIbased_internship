'use server';

/**
 * @fileOverview Analyzes a user's video response to an interview question and provides feedback.
 *
 * - analyzeVideoFeedback - A function that takes a video and a question and returns communication feedback.
 * - AnalyzeVideoFeedbackInput - The input type for the analyzeVideoFeedback function.
 * - AnalyzeVideoFeedbackOutput - The return type for the analyzeVideoFeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeVideoFeedbackInputSchema = z.object({
  videoDataUri: z.string().describe("A data URI of the user's video response. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  question: z.string().describe('The interview question the user was answering.'),
});
export type AnalyzeVideoFeedbackInput = z.infer<typeof AnalyzeVideoFeedbackInputSchema>;

const AnalyzeVideoFeedbackOutputSchema = z.object({
  feedback: z.object({
    overallImpression: z.string().describe("A summary of the user's performance for this question."),
    eyeContact: z.string().describe("Feedback on the user's eye contact and engagement."),
    clarityAndConfidence: z.string().describe("Feedback on the user's clarity of speech and perceived confidence."),
    bodyLanguage: z.string().describe("Feedback on the user's body language and posture."),
  }),
});
export type AnalyzeVideoFeedbackOutput = z.infer<typeof AnalyzeVideoFeedbackOutputSchema>;


export async function analyzeVideoFeedback(input: AnalyzeVideoFeedbackInput): Promise<AnalyzeVideoFeedbackOutput> {
  return analyzeVideoFeedbackFlow(input);
}


const prompt = ai.definePrompt({
  name: 'analyzeVideoFeedbackPrompt',
  input: { schema: AnalyzeVideoFeedbackInputSchema },
  output: { schema: AnalyzeVideoFeedbackOutputSchema },
  prompt: `You are an expert interview coach. Your task is to analyze a video of a candidate answering an interview question and provide constructive feedback.

  The candidate was asked the following question:
  "{{{question}}}"

  Analyze the following video of their response. Pay attention to their eye contact, clarity of speech, confidence, and body language.
  ---
  {{media url=videoDataUri}}
  ---

  Provide concise, actionable feedback for each of the following categories:
  - Overall Impression: Give a brief summary of their performance on this question.
  - Eye Contact: Did they maintain good eye contact with the camera? Were they engaged?
  - Clarity and Confidence: How was their pace and clarity? Did they appear confident?
  - Body Language: Comment on their posture and any notable gestures.

  Your feedback should be encouraging and aim to help the candidate improve.
  `,
});

const analyzeVideoFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeVideoFeedbackFlow',
    inputSchema: AnalyzeVideoFeedbackInputSchema,
    outputSchema: AnalyzeVideoFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
