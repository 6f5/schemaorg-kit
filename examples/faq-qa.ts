/**
 * faq-qa.ts — FAQ, Q&A, and Education Q&A structured data
 *
 * Demonstrates: ergonomic createFAQPage helper, raw FAQPage factory,
 * QAPage for community threads, and Quiz for education.
 */

import {
  createFAQPage,
  createQAPage,
  createQuiz,
  createGraph,
  createWebPage,
  QuestionSchema,
  AnswerSchema,
  FAQPageSchema,
} from "../src/index";

// ─── Ergonomic FAQ helper ─────────────────────────────────────────────────────
// Simplest way — just pass question/answer pairs.

const faq = createFAQPage([
  {
    question: "What is your return policy?",
    answer: "We offer free 30-day returns on all orders. Items must be unused and in original packaging.",
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3–5 business days. Expedited shipping (1–2 days) is available at checkout.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes! We ship to over 50 countries. International orders typically arrive within 7–14 business days.",
  },
  {
    question: "Can I change or cancel my order?",
    answer: "Orders can be modified or cancelled within 1 hour of placement. Contact support@example.com immediately.",
  },
]);

console.log("=== FAQ (ergonomic helper) ===");
console.log(faq.toScript());

// ─── FAQ with rich HTML answers (via raw schema) ──────────────────────────────
// The `text` field in Answer allows limited HTML (p, ul, li, a, etc.)

const richFaq = FAQPageSchema.parse({
  name: "Product FAQ",
  url: "https://example.com/faq",
  mainEntity: [
    QuestionSchema.parse({
      name: "What sizes are available?",
      acceptedAnswer: AnswerSchema.parse({
        text: `<p>We carry sizes XS through 3XL.</p>
<ul>
  <li>XS: chest 32–34"</li>
  <li>S: chest 35–37"</li>
  <li>M: chest 38–40"</li>
  <li>L: chest 41–43"</li>
  <li>XL: chest 44–46"</li>
  <li>2XL: chest 47–49"</li>
  <li>3XL: chest 50–52"</li>
</ul>
<p>See our <a href="https://example.com/size-guide">full size guide</a> for measurements.</p>`,
      }),
    }),
    QuestionSchema.parse({
      name: "Are your products sustainably made?",
      acceptedAnswer: AnswerSchema.parse({
        text: `<p>Yes. All products are made from <strong>100% organic cotton</strong> and manufactured in certified Fair Trade facilities.</p>`,
      }),
    }),
  ],
});

console.log("\n=== FAQ with rich HTML answers ===");
console.log(JSON.stringify({ "@context": "https://schema.org", ...richFaq }, null, 2));

// ─── QAPage (community thread) ────────────────────────────────────────────────
// Used for forum-style pages where a question has multiple user answers.

const qaPage = createQAPage({
  name: "How do I reset my password? — Community Forum",
  url: "https://forum.example.com/q/how-reset-password",
  mainEntity: {
    "@type": "Question",
    name: "How do I reset my password?",
    text: "I forgot my password and the reset email isn't arriving. What should I try?",
    answerCount: 3,
    upvoteCount: 24,
    datePublished: "2025-01-10",
    author: { "@type": "Person", name: "frustrated_user_99" },
    acceptedAnswer: {
      "@type": "Answer",
      text: "Check your spam folder first. If not there, go to Account > Security > Reset Password and try an alternate email address. If the issue persists, contact support@example.com.",
      upvoteCount: 47,
      datePublished: "2025-01-10",
      author: { "@type": "Person", name: "support_team" },
    },
    suggestedAnswer: [
      {
        "@type": "Answer",
        text: "Make sure you're checking the right email inbox — sometimes it goes to a business address.",
        upvoteCount: 12,
        datePublished: "2025-01-11",
        author: { "@type": "Person", name: "helpfulMember" },
      },
    ],
  },
});

console.log("\n=== QAPage ===");
console.log(qaPage.toScript());

// ─── Education Q&A (Quiz/flashcards) ─────────────────────────────────────────
// Used by Google to surface study flashcards in search results.

const quiz = createQuiz({
  name: "American History — Civil War Quiz",
  educationalLevel: "high school",
  about: { "@type": "Thing", name: "American Civil War" },
  hasPart: [
    {
      "@type": "Question",
      name: "In what year did the American Civil War begin?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The American Civil War began in 1861.",
      },
      educationalLevel: "high school",
    } as any,
    {
      "@type": "Question",
      name: "Who was the President of the United States during the Civil War?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Abraham Lincoln was President of the United States during the Civil War.",
      },
    } as any,
    {
      "@type": "Question",
      name: "What issue was central to the American Civil War?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Slavery was the central issue of the American Civil War, along with states' rights and secession.",
      },
    } as any,
  ],
  inLanguage: "en-US",
});

console.log("\n=== Education Quiz ===");
console.log(quiz.toScript());

// ─── @graph for a support FAQ page ───────────────────────────────────────────

const graph = createGraph([faq]);

console.log("\n=== FAQ page @graph ===");
console.log(graph.toScript());
