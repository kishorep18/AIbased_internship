'use server';

/**
 * @fileOverview Generates an aptitude quiz based on a company name.
 *
 * - generateAptitudeQuiz - A function that takes a company name and returns a set of aptitude questions.
 * - GenerateAptitudeQuizInput - The input type for the generateAptitudeQuiz function.
 * - GenerateAptitudeQuizOutput - The return type for the generateAptitudeQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAptitudeQuizInputSchema = z.object({
  companyName: z.string().describe('The name of the company to base the quiz on.'),
});
export type GenerateAptitudeQuizInput = z.infer<typeof GenerateAptitudeQuizInputSchema>;

const GenerateAptitudeQuizOutputSchema = z.object({
  quiz: z.object({
    companyName: z.string(),
    questions: z.array(
      z.object({
        question: z.string().describe('The question text.'),
        options: z.array(z.string()).describe('A list of 4 multiple-choice options.'),
        correctAnswer: z.string().describe('The correct option.'),
        category: z.string().describe('The category of the question (e.g., "Logical Reasoning", "Quantitative Ability", "Verbal Ability").'),
        explanation: z.string().describe('A brief explanation for the correct answer.'),
      })
    ).describe('A list of 10 aptitude questions.'),
  })
});
export type GenerateAptitudeQuizOutput = z.infer<typeof GenerateAptitudeQuizOutputSchema>;

export async function generateAptitudeQuiz(input: GenerateAptitudeQuizInput): Promise<GenerateAptitudeQuizOutput> {
  return generateAptitudeQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAptitudeQuizPrompt',
  input: {schema: GenerateAptitudeQuizInputSchema},
  output: {schema: GenerateAptitudeQuizOutputSchema},
  prompt: `You are an expert quiz creator for job applicants. Your task is to generate a 10-question aptitude quiz based on a specific company. The quiz should be relevant to the industry and the typical skills required for roles at that company.

  Company: {{{companyName}}}

  Please generate 10 multiple-choice questions covering the following categories:
  - Logical Reasoning
  - Quantitative Ability
  - Verbal Ability

  For each question, provide:
  - The question text.
  - 4 distinct options.
  - The correct answer (must be one of the options).
  - The category of the question.
  - A brief explanation of the correct answer.

  Tailor the difficulty and context of the questions to what a candidate applying to "{{{companyName}}}" might expect.
  `,
});

const generateAptitudeQuizFlow = ai.defineFlow(
  {
    name: 'generateAptitudeQuizFlow',
    inputSchema: GenerateAptitudeQuizInputSchema,
    outputSchema: GenerateAptitudeQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
