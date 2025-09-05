
import type { AnalyzeVideoFeedbackOutput } from "@/ai/flows/analyze-video-feedback";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MessageSquareQuote, Eye, Smile, PersonStanding } from "lucide-react";

type FeedbackCardProps = {
  feedback: AnalyzeVideoFeedbackOutput & { question: string };
  index: number;
};

export function FeedbackCard({ feedback, index }: FeedbackCardProps) {
  const { question, feedback: analysis } = feedback;
  const { overallImpression, eyeContact, clarityAndConfidence, bodyLanguage } = analysis;

  return (
    <Card className="shadow-lg border-2 border-primary/10">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-headline flex items-start gap-4">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold mt-1">
                {index + 1}
            </div>
            <span>{question}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Overall Impression
                </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pl-2 pt-2">
              {overallImpression}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Eye Contact & Engagement
                </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pl-2 pt-2">
              {eyeContact}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                    <MessageSquareQuote className="h-5 w-5 text-purple-600" />
                    Clarity & Confidence
                </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pl-2 pt-2">
              {clarityAndConfidence}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                 <div className="flex items-center gap-2">
                    <PersonStanding className="h-5 w-5 text-orange-600" />
                    Body Language
                </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pl-2 pt-2">
              {bodyLanguage}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

    