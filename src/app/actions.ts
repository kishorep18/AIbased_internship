"use server";

import { recommendInternships, type RecommendInternshipsInput, type RecommendInternshipsOutput } from "@/ai/flows/recommend-internships";
import { conductInterview, type ConductInterviewInput, type ConductInterviewOutput } from "@/ai/flows/mock-interview";
import pdf from "pdf-parse/lib/pdf-parse.js";

export async function getInternshipRecommendations(
  data: RecommendInternshipsInput
): Promise<RecommendInternshipsOutput> {
  try {
    const recommendations = await recommendInternships(data);
    if (!recommendations?.internshipRecommendations?.length) {
        return { internshipRecommendations: [] };
    }
    return recommendations;
  } catch (error) {
    console.error("Error getting internship recommendations:", error);
    // In a real app, you might want to throw a more user-friendly error
    throw new Error("Failed to get recommendations from AI service.");
  }
}

export async function getInterviewQuestions(
  data: ConductInterviewInput
): Promise<ConductInterviewOutput> {
  try {
    const questions = await conductInterview(data);
    if (!questions?.initialQuestions?.length) {
      return { initialQuestions: [] };
    }
    return questions;
  } catch (error) {
    console.error("Error getting interview questions:", error);
    throw new Error("Failed to get interview questions from AI service.");
  }
}

export async function getInterviewQuestionsFromResume(
  formData: FormData
): Promise<ConductInterviewOutput> {
    const file = formData.get('resume') as File;
    if (!file) {
        throw new Error("No resume file found");
    }

    try {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        let resumeText: string;

        if (file.type === 'application/pdf') {
            const data = await pdf(fileBuffer);
            resumeText = data.text;
        } else {
            resumeText = fileBuffer.toString('utf-8');
        }

        if (!resumeText) {
             return { initialQuestions: [] };
        }

        const questions = await conductInterview({ resumeText });
         if (!questions?.initialQuestions?.length) {
            return { initialQuestions: [] };
        }
        return questions;

    } catch (error) {
        console.error("Error processing resume:", error);
        throw new Error("Failed to process resume and get interview questions.");
    }
}
