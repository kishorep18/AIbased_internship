'use server';

/**
 * @fileOverview Recommends internships based on user profile information.
 *
 * - recommendInternships - A function that takes user profile information and returns a list of recommended internships.
 * - RecommendInternshipsInput - The input type for the recommendInternships function.
 * - RecommendInternshipsOutput - The return type for the recommendInternships function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendInternshipsInputSchema = z.object({
  education: z.string().describe("The candidate's highest level of education."),
  skills: z.array(z.string()).describe("A list of the candidate's skills."),
  sectorInterests: z.array(z.string()).describe("A list of the candidate's sector interests."),
  location: z.string().describe("The candidate's preferred location."),
});
export type RecommendInternshipsInput = z.infer<typeof RecommendInternshipsInputSchema>;

const RecommendInternshipsOutputSchema = z.object({
  internshipRecommendations: z.array(
    z.object({
      title: z.string().describe('The title of the internship.'),
      company: z.string().describe('The company offering the internship.'),
      description: z.string().describe('A brief description of the internship.'),
      location: z.string().describe('The location of the internship.'),
      relevanceScore: z.number().describe('A score indicating the relevance of the internship to the candidate.'),
      applyUrl: z.string().url().describe('A URL to apply for the internship. This should be a placeholder link to a job board or company website.'),
    })
  ).describe('A list of recommended internships.'),
});
export type RecommendInternshipsOutput = z.infer<typeof RecommendInternshipsOutputSchema>;

export async function recommendInternships(input: RecommendInternshipsInput): Promise<RecommendInternshipsOutput> {
  return recommendInternshipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendInternshipsPrompt',
  input: {schema: RecommendInternshipsInputSchema},
  output: {schema: RecommendInternshipsOutputSchema},
  prompt: `You are an AI assistant that recommends 3-5 internships to candidates based on their profile information.

  Candidate Profile:
  - Education: {{{education}}}
  - Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Sector Interests: {{#each sectorInterests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Location: {{{location}}}

  Please provide 3-5 internship recommendations that are most relevant to the candidate's profile.
  Format the output as a JSON object with an array of internship recommendations, each including the title, company, description, location, relevanceScore, and applyUrl. The relevanceScore should be from 0 to 1. The applyUrl should be a placeholder link to a relevant job board, like LinkedIn, Indeed, or a company's career page. For example, for a "Software Engineer Intern" at "Google", a good link would be "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer%20Intern%20Google".
  `,
});

const recommendInternshipsFlow = ai.defineFlow(
  {
    name: 'recommendInternshipsFlow',
    inputSchema: RecommendInternshipsInputSchema,
    outputSchema: RecommendInternshipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
