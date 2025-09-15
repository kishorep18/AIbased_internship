
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
  name: z.string().describe("The candidate's name."),
  age: z.string().describe("The candidate's age."),
  dob: z.string().describe("The candidate's date of birth."),
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
      company: z.string().describe('The company or ministry offering the internship.'),
      description: z.string().describe('A brief description of the internship.'),
      location: z.string().describe('The location of the internship.'),
      relevanceScore: z.number().describe('A score from 0 to 1 indicating the relevance of the internship to the candidate.'),
      applyUrl: z.string().url().describe('A URL to apply for the internship. This should be a direct link to the internship on the pminternship.mca.gov.in portal.'),
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
  prompt: `You are an AI career advisor. Your ONLY task is to find and recommend 3-5 internships for a candidate based on their profile, sourced exclusively from the PM Internship Portal.

  The portal's URL is: https://pminternship.mca.gov.in/

  Candidate Profile:
  - Name: {{{name}}}
  - Age: {{{age}}}
  - Date of Birth: {{{dob}}}
  - Education: {{{education}}}
  - Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Sector Interests: {{#each sectorInterests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Location: {{{location}}}

  Your instructions are:
  1. Analyze the candidate's profile.
  2. Search ONLY the PM Internship Portal (https://pminternship.mca.gov.in/) for relevant internship opportunities. Do NOT use any other sources.
  3. Provide 3-5 diverse internship recommendations that are the most relevant from that specific portal.

  For each recommendation, you MUST provide the title, a plausible company/ministry, a realistic description based on opportunities on the portal, the location, a relevanceScore (from 0 to 1), and a valid applyUrl. The applyUrl MUST be a plausible link to an internship listing on the pminternship.mca.gov.in domain.
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


