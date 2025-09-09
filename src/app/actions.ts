
"use server";

import { recommendInternships, type RecommendInternshipsInput, type RecommendInternshipsOutput } from "@/ai/flows/recommend-internships";
import { conductInterview, type ConductInterviewInput, type ConductInterviewOutput } from "@/ai/flows/mock-interview";
import { textToSpeech, type TextToSpeechInput, type TextToSpeechOutput } from "@/ai/flows/text-to-speech";
import { analyzeVideoFeedback, type AnalyzeVideoFeedbackInput, type AnalyzeVideoFeedbackOutput } from "@/ai/flows/analyze-video-feedback";
import { generateAptitudeQuiz, type GenerateAptitudeQuizInput, type GenerateAptitudeQuizOutput } from "@/ai/flows/generate-aptitude-quiz";
import { generateRoadmap, type GenerateRoadmapInput, type GenerateRoadmapOutput } from "@/ai/flows/generate-roadmap";


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
        let resumeText = '';

        if (file.type === 'application/pdf') {
          const pdf = (await import('pdf-parse')).default;
          const data = await pdf(fileBuffer);
          resumeText = data.text;
        } else if (file.type === 'text/plain' || file.type === 'text/markdown') {
          resumeText = fileBuffer.toString('utf8');
        } else {
            throw new Error(`Unsupported file type: ${file.type}. Please upload a PDF, TXT, or MD file.`);
        }
        
        if (!resumeText.trim()) {
            throw new Error("Could not extract text from the resume.");
        }
        
        const questions = await conductInterview({ resumeText });
         if (!questions?.initialQuestions?.length) {
            return { initialQuestions: [] };
        }
        return questions;

    } catch (error: any) {
        console.error("Error processing resume:", error);
        // Pass the specific error message to the client
        throw new Error(error.message || "Failed to process resume and get interview questions.");
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

export async function getAptitudeQuiz(
    data: GenerateAptitudeQuizInput
): Promise<GenerateAptitudeQuizOutput> {
    try {
        const quiz = await generateAptitudeQuiz(data);
        if (!quiz?.quiz?.questions?.length) {
            return { quiz: { companyName: data.companyName, questions: [] } };
        }
        return quiz;
    } catch (error) {
        console.error("Error getting aptitude quiz:", error);
        throw new Error("Failed to get aptitude quiz from AI service.");
    }
}

export async function getRoadmap(
    data: GenerateRoadmapInput
): Promise<GenerateRoadmapOutput> {
    try {
        const roadmap = await generateRoadmap(data);
        if (!roadmap?.roadmap?.length) {
            return { roadmap: [] };
        }
        return roadmap;
    } catch (error) {
        console.error("Error getting roadmap:", error);
        throw new Error("Failed to get roadmap from AI service.");
    }
}
