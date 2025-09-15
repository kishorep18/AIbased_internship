'use server';

/**
 * @fileOverview Recommends internships based on user profile information and a specific website.
 *
 * - recommendInternships - A function that takes user profile information and a website URL, and returns a list of recommended internships.
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
  websiteUrl: z.string().url().describe("The URL of the company's career page to search for internships."),
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
      applyUrl: z.string().url().describe('A URL to apply for the internship. This should be a direct link to the job posting if available.'),
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
  prompt: `You are an AI assistant that finds and recommends 3-5 internships to a candidate based on their profile and a specific company website.

  Candidate Profile:
  - Name: {{{name}}}
  - Age: {{{age}}}
  - Date of Birth: {{{dob}}}
  - Education: {{{education}}}
  - Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Sector Interests: {{#each sectorInterests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Location: {{{location}}}

  Website to search for internships: {{{websiteUrl}}}

  Your task is to:
  1. Act as a career advisor and browse the provided website URL.
  2. Find relevant internship opportunities listed on that site.
  3. Analyze the candidate's profile and compare it with the internships you found.
  4. Provide 3-5 internship recommendations that are the most relevant.

  For each recommendation, provide the title, company, description, location, a relevanceScore (from 0 to 1), and a direct applyUrl to the internship listing on the provided website. If the company name is not obvious from the website, infer it from the URL.
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
