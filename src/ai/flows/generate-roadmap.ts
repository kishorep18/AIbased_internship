'use server';

/**
 * @fileOverview Generates a roadmap for achieving an internship.
 *
 * - generateRoadmap - A function that takes internship details and returns a step-by-step roadmap.
 * - GenerateRoadmapInput - The input type for the generateRoadmap function.
 * - GenerateRoadmapOutput - The return type for the generateRoadmap function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateRoadmapInputSchema = z.object({
  skillTitle: z.string().describe('The title of the skill.'),
  companyName: z.string().describe('The name of the company.'),
});
export type GenerateRoadmapInput = z.infer<typeof GenerateRoadmapInputSchema>;

const GenerateRoadmapOutputSchema = z.object({
  roadmap: z.array(
    z.object({
      step: z.number().describe('The step number in the roadmap.'),
      title: z.string().describe('A concise title for the step.'),
      description: z.string().describe('A detailed description of the action to take for this step.'),
    })
  ).describe('A list of steps to follow to secure the internship.'),
});
export type GenerateRoadmapOutput = z.infer<typeof GenerateRoadmapOutputSchema>;

export async function generateRoadmap(input: GenerateRoadmapInput): Promise<GenerateRoadmapOutput> {
  return generateRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoadmapPrompt',
  input: { schema: GenerateRoadmapInputSchema },
  output: { schema: GenerateRoadmapOutputSchema },
  prompt: `You are an expert career coach. Your task is to generate a step-by-step roadmap for a student trying to get an internship for a specific skill.

  Skill Target:
  - Title: {{{skillTitle}}}
  - Company: {{{companyName}}}

  Generate a 5-7 step roadmap that is actionable and easy to follow. Each step should have a clear title and a detailed description.

  Example steps could include:
  - In-depth company research.
  - Tailoring the resume and cover letter.
  - Networking with employees on LinkedIn.
  - Preparing for specific types of interview questions (technical, behavioral).
  - Following up after the interview.

  Provide a clear, encouraging, and strategic guide for the user.
  `,
});

const generateRoadmapFlow = ai.defineFlow(
  {
    name: 'generateRoadmapFlow',
    inputSchema: GenerateRoadmapInputSchema,
    outputSchema: GenerateRoadmapOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
