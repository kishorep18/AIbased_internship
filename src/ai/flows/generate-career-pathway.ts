
'use server';

/**
 * @fileOverview Generates a personalized career pathway for a learner.
 *
 * This file defines the AI flow for creating a detailed career plan based on a learner's profile,
 * aspirations, and skills, mapping them to the NSQF framework and current labor market demands.
 *
 * - generateCareerPathway - The main function that triggers the AI flow.
 * - GenerateCareerPathwayInput - The Zod schema for the learner's input data.
 * - GenerateCareerPathwayOutput - The Zod schema for the AI-generated pathway output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// 1. Inputs to the Engine
const GenerateCareerPathwayInputSchema = z.object({
  personalProfile: z.object({
    name: z.string().describe("Learner's full name."),
    age: z.string().describe("Learner's age."),
    location: z.string().describe("Learner's current location (city/state)."),
  }),
  educationAndSkills: z.object({
    highestQualification: z.string().describe('Learner\'s highest academic qualification (e.g., "12th Pass", "B.Tech in Computer Science").'),
    currentSkills: z.array(z.string()).describe('List of skills the learner currently possesses (technical or soft).'),
  }),
  careerAspirations: z.object({
    desiredRole: z.string().describe('The job role the learner wants to achieve (e.g., "EV Maintenance Technician", "Full Stack Developer").'),
    industry: z.string().describe('The industry the learner is interested in (e.g., "Automotive", "IT").'),
  }),
});
export type GenerateCareerPathwayInput = z.infer<typeof GenerateCareerPathwayInputSchema>;


// 3. Outputs for Users
const GenerateCareerPathwayOutputSchema = z.object({
  pathways: z.array(
    z.object({
      pathwayType: z.string().describe('The type of pathway, e.g., "Fast-Track", "Budget-Friendly", "Step-by-Step".'),
      estimatedTimeToGoal: z.string().describe('Estimated time to achieve the career goal through this pathway (e.g., "6 months", "1-2 years").'),
      careerDashboard: z.array(
        z.object({
          step: z.number().describe('The step number in the career path.'),
          title: z.string().describe('A concise title for the step.'),
          description: z.string().describe('A detailed description of the action to take.'),
          nsqfLevel: z.string().optional().describe('The corresponding NSQF level for this step, if applicable (e.g., "Level 3", "Level 4").'),
          type: z.string().describe('The type of action, e.g., "Course", "Certification", "Apprenticeship", "Job".'),
          applyLink: z.string().url().optional().describe('A URL to apply or learn more about this step.'),
        })
      ).describe('A detailed, step-by-step career path for the learner.'),
    })
  ).describe('A list of different recommended pathway options.'),
});
export type GenerateCareerPathwayOutput = z.infer<typeof GenerateCareerPathwayOutputSchema>;


export async function generateCareerPathway(input: GenerateCareerPathwayInput): Promise<GenerateCareerPathwayOutput> {
  return generateCareerPathwayFlow(input);
}


// 2. Core Processing (AI/ML Models)
const prompt = ai.definePrompt({
  name: 'generateCareerPathwayPrompt',
  input: { schema: GenerateCareerPathwayInputSchema },
  output: { schema: GenerateCareerPathwayOutputSchema },
  prompt: `You are an expert AI Career Navigator for the Indian landscape, specializing in mapping careers to the NSQF framework and real-time labor market data.

  Your task is to create a personalized career recommendation engine. Analyze the learner's profile and generate three distinct, actionable pathways for them: a "Fast-Track" option, a "Budget-Friendly" option, and a "Step-by-Step" (balanced) option.

  **Learner Profile:**
  - **Personal:** Name: {{{personalProfile.name}}}, Age {{{personalProfile.age}}}, Location: {{{personalProfile.location}}}
  - **Education & Skills:**
    - Highest Qualification: {{{educationAndSkills.highestQualification}}}
    - Current Skills: {{#each educationAndSkills.currentSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - **Career Aspirations:**
    - Desired Role: {{{careerAspirations.desiredRole}}}
    - Industry: {{{careerAspirations.industry}}}

  **Your Instructions:**

  1.  **Analyze Skill Gaps:** Based on the learner's current skills and desired role, identify the key skills they need to acquire.
  2.  **Map to NSQF:** For each skill or learning step, suggest a relevant NSQF Qualification Pack (QP) or course and mention its NSQF level (e.g., "Level 4"). Assume you have access to the NCVET/NSQF framework.
  3.  **Integrate Labor Market Data:** Your recommendations should reflect current job demands. Prioritize skills and roles that are emerging or in high demand. For example, if the user wants to be in the automotive industry, consider suggesting "EV maintenance" as a module.
  4.  **Generate 3 Pathways:** Create a "Fast-Track" pathway (intensive, possibly higher cost), a "Budget-Friendly" pathway (leveraging free resources or government schemes), and a "Step-by-Step" pathway (a balanced approach).
  5.  **Define a Step-by-Step Dashboard:** For each pathway, create a clear, sequential career dashboard. Each step should include a title, description, the type of action (Course, Certification, Apprenticeship, Job), and where applicable, the NSQF level.
  6.  **Provide Actionable Links:** For each step in the dashboard, provide a plausible 'applyLink' URL. This link should direct to a relevant course, certification, or job platform (e.g., Coursera, Udemy, LinkedIn, government portals). For the "Fast-Track" pathway specifically, ensure you include links for each step, such as for bootcamps, certifications (Google, Meta), and specialized internships.
  7.  **Estimate Timelines:** Provide a realistic estimated time to complete each pathway.

  Your final output must be a comprehensive plan that guides the learner from their current state to their desired job role.
  `,
});

const generateCareerPathwayFlow = ai.defineFlow(
  {
    name: 'generateCareerPathwayFlow',
    inputSchema: GenerateCareerPathwayInputSchema,
    outputSchema: GenerateCareerPathwayOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
