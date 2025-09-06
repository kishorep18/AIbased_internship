'use server';

/**
 * @fileOverview Conducts a mock interview based on a resume.
 *
 * - conductInterview - A function that analyzes a resume and generates interview questions.
 * - ConductInterviewInput - The input type for the conductInterview function.
 * - ConductInterviewOutput - The return type for the conductInterview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConductInterviewInputSchema = z.object({
  resumeText: z.string().describe("The text content of the candidate's resume."),
});
export type ConductInterviewInput = z.infer<typeof ConductInterviewInputSchema>;

const ConductInterviewOutputSchema = z.object({
  initialQuestions: z.array(
    z.object({
      question: z.string().describe('The interview question.'),
      category: z.string().describe('The category of the question (e.g., "Technical", "Behavioral", "Resume-specific").'),
    })
  ).describe('A list of initial interview questions.'),
});
export type ConductInterviewOutput = z.infer<typeof ConductInterviewOutputSchema>;

export async function conductInterview(input: ConductInterviewInput): Promise<ConductInterviewOutput> {
  return conductInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'conductInterviewPrompt',
  input: {schema: ConductInterviewInputSchema},
  output: {schema: ConductInterviewOutputSchema},
  prompt: `You are an expert technical recruiter and interviewer. Your task is to conduct a mock interview with a candidate based on their resume.

  Analyze the following resume text and generate 5 initial interview questions. The questions should be a mix of:
  1.  Questions directly related to the projects and experiences listed in the resume.
  2.  Technical questions based on the skills mentioned (e.g., programming languages, frameworks).
  3.  General industry-based questions relevant to the roles the candidate seems to be targeting.
  4.  Behavioral questions.

  Candidate's Resume Text:
  ---
  {{{resumeText}}}
  ---

  Please provide 5 diverse and insightful questions to start the interview. Categorize each question.
  `,
});

const conductInterviewFlow = ai.defineFlow(
  {
    name: 'conductInterviewFlow',
    inputSchema: ConductInterviewInputSchema,
    outputSchema: ConductInterviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
