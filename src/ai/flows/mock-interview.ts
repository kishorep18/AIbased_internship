
'use server';

/**
 * @fileOverview Conducts a mock interview based on a resume and suggests jobs.
 *
 * - conductInterview - A function that analyzes a resume, generates interview questions, and suggests jobs.
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
  jobMatches: z.array(
    z.object({
        jobTitle: z.string().describe("A suitable job title for the candidate."),
        company: z.string().describe("A plausible company that would hire for this role."),
        reason: z.string().describe("A brief reason why the candidate is a good fit for this role based on their resume.")
    })
  ).describe("A list of 3-5 job recommendations based on the user's skills.")
});
export type ConductInterviewOutput = z.infer<typeof ConductInterviewOutputSchema>;

export async function conductInterview(input: ConductInterviewInput): Promise<ConductInterviewOutput> {
  return conductInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'conductInterviewPrompt',
  input: {schema: ConductInterviewInputSchema},
  output: {schema: ConductInterviewOutputSchema},
  prompt: `You are an expert technical recruiter and career advisor. Your task is to analyze a candidate's resume.

  Candidate's Resume Text:
  ---
  {{{resumeText}}}
  ---

  Based on the resume, perform two tasks:

  1.  **Job Matching**: Analyze the skills, experience, and projects. Recommend 3-5 specific job roles that are a strong fit. For each role, suggest a plausible company that hires for that position and provide a brief, one-sentence reason why the candidate is a good match.

  2.  **Question Generation**: Generate 5 initial interview questions. The questions should be a mix of:
      - Questions directly related to the projects and experiences listed.
      - Technical questions based on the skills mentioned.
      - General industry-based questions.
      - Behavioral questions.

  Please provide both the job matches and the interview questions in your response.
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
