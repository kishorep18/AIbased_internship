"use server";

import { recommendInternships, type RecommendInternshipsInput, type RecommendInternshipsOutput } from "@/ai/flows/recommend-internships";
import { conductInterview, type ConductInterviewInput, type ConductInterviewOutput } from "@/ai/flows/mock-interview";

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
