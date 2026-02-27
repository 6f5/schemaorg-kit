import { z } from "zod";
import { makeFactory } from "../../core/base";
import { WebPageSchema } from "../creative-works/WebPage";
import { CreativeWorkSchema } from "../creative-works/CreativeWork";
import { PersonOrOrgRef } from "../shared/PersonOrOrgRef";

/**
 * schema.org/Answer
 * The answer in a Q&A or FAQ.
 * Google allows limited HTML in the `text` field: h1-h6, p, div, ol, ul, li, b, strong, i, em, br, a
 */
export const AnswerSchema = z.object({
  "@type": z.literal("Answer").default("Answer"),
  text: z.string(),
  dateCreated: z.string().optional(),            // ISO 8601
  upvoteCount: z.number().int().nonnegative().optional(),
  url: z.url().optional(),
  author: PersonOrOrgRef.optional(),
});

/**
 * schema.org/Question
 * A question with optional accepted/suggested answers.
 */
export const QuestionSchema = z.object({
  "@type": z.literal("Question").default("Question"),
  name: z.string(),                              // The question text (also used as headline)
  text: z.string().optional(),                   // Extended question text
  acceptedAnswer: z.union([AnswerSchema, z.array(AnswerSchema)]).optional(),
  suggestedAnswer: z.union([AnswerSchema, z.array(AnswerSchema)]).optional(),
  answerCount: z.number().int().nonnegative().optional(),
  upvoteCount: z.number().int().nonnegative().optional(),
  author: PersonOrOrgRef.optional(),
  dateCreated: z.string().optional(),
  datePublished: z.string().optional(),
  url: z.url().optional(),
});

/**
 * schema.org/FAQPage
 * Google required: mainEntity (array of Question with acceptedAnswer)
 * Eligible only for authoritative government/health sites as of 2024.
 */
export const FAQPageSchema = WebPageSchema.extend({
  "@type": z.literal("FAQPage").default("FAQPage"),
  mainEntity: z.array(QuestionSchema),
});

/**
 * schema.org/QAPage
 * Community Q&A page. mainEntity is a single Question.
 */
export const QAPageSchema = WebPageSchema.extend({
  "@type": z.literal("QAPage").default("QAPage"),
  mainEntity: QuestionSchema,
});

/**
 * schema.org/Quiz
 * For Education Q&A. Helps students discover flashcards on Google Search.
 */
export const QuizSchema = CreativeWorkSchema.extend({
  "@type": z.literal("Quiz").default("Quiz"),
  name: z.string().optional(),
  educationalLevel: z.string().optional(),
  about: z.lazy(() =>
    z.object({ "@type": z.string() }).catchall(z.unknown())
  ).optional(),
  hasPart: z.array(QuestionSchema).optional(),
  educationalAlignment: z.object({
    "@type": z.literal("AlignmentObject").default("AlignmentObject"),
    alignmentType: z.string().optional(),
    targetName: z.string().optional(),
    targetUrl: z.url().optional(),
  }).optional(),
});

export type Answer = z.infer<typeof AnswerSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type FAQPage = z.infer<typeof FAQPageSchema>;
export type QAPage = z.infer<typeof QAPageSchema>;
export type Quiz = z.infer<typeof QuizSchema>;

export const createFAQPage = makeFactory(FAQPageSchema);
export const createQAPage = makeFactory(QAPageSchema);
export const createQuiz = makeFactory(QuizSchema);
export const createQuestion = makeFactory(QuestionSchema);
