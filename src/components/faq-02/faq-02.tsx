import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

const FAQ02 = () => {
  const t = useTranslations("FAQ");
  const faq = [
    {
      question: t("firstQuestion"),
      answer: t("firstQuestionAnswer"),
    },
    {
      question: t("secondQuestion"),
      answer: t("secondQuestionAnswer"),
    },
    {
      question: t("thirdQuestion"),
      answer: t("thirdQuestionAnswer"),
    },
    {
      question: t("fourthQuestion"),
      answer: t("fourthQuestionAnswer"),
    },
    {
      question: t("fifthQuestion"),
      answer: t("fifthQuestionAnswer"),
    },
  ];
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="flex flex-col md:flex-row items-start gap-x-12 gap-y-6">
        <h2 className="text-4xl lg:text-5xl leading-[1.15]! font-semibold tracking-tighter">
          {t("title")}
        </h2>

        <Accordion type="single" defaultValue="question-0" className="max-w-xl">
          {faq.map(({ question, answer }, index) => (
            <AccordionItem key={question} value={`question-${index}`}>
              <AccordionTrigger className="text-left text-lg">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ02;
