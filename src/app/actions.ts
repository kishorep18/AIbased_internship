"use server";

import { recommendInternships, type RecommendInternshipsInput, type RecommendInternshipsOutput } from "@/ai/flows/recommend-internships";
import { conductInterview, type ConductInterviewInput, type ConductInterviewOutput } from "@/ai/flows/mock-interview";
import { textToSpeech, type TextToSpeechInput, type TextToSpeechOutput } from "@/ai/flows/text-to-speech";
import { analyzeVideoFeedback, type AnalyzeVideoFeedbackInput, type AnalyzeVideoFeedbackOutput } from "@/ai/flows/analyze-video-feedback";

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
        const fileBuffer = await file.arrayBuffer();
        
        const resumeDataUri = `data:${file.type};base64,${Buffer.from(fileBuffer).toString('base64')}`;

        const questions = await conductInterview({ resumeDataUri });
         if (!questions?.initialQuestions?.length) {
            return { initialQuestions: [] };
        }
        return questions;

    } catch (error) {
        console.error("Error processing resume:", error);
        throw new Error("Failed to process resume and get interview questions.");
    }
}


export async function getAudioForText(
  text: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  try {
    return await textToSpeech(text);
  } catch (error) {
    console.error("Error getting audio for text:", error);
    throw new Error("Failed to get audio from AI service.");
  }
}


export async function getVideoFeedback(
  data: AnalyzeVideoFeedbackInput
): Promise<AnalyzeVideoFeedbackOutput> {
  try {
    return await analyzeVideoFeedback(data);
  } catch (error) {
    console.error("Error getting video feedback:", error);
    throw new Error("Failed to get video feedback from AI service.");
  }
}
