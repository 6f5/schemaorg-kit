import { FAQPageSchema } from "../types/intangibles/QAPage";
import { SchemaNode } from "../core/base";

type FAQInput = {
  question: string;
  answer: string;
};

/**
 * Ergonomic helper for FAQPage structured data.
 * Automatically wraps each item in the required Question/Answer structure.
 *
 * @example
 * createFAQPage([
 *   { question: "What is your return policy?", answer: "We offer 30-day returns." },
 *   { question: "Do you ship internationally?", answer: "Yes, we ship worldwide." },
 * ])
 */
export function createFAQPage(
  items: FAQInput[]
): SchemaNode<typeof FAQPageSchema.shape> {
  const data = FAQPageSchema.parse({
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  });
  return new SchemaNode(FAQPageSchema, data);
}
