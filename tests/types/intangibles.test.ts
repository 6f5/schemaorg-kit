import { describe, it, expect } from "vitest";
import {
  createJobPosting,
  createDiscussionForumPosting,
  createItemList,
  createQAPage,
  createQuiz,
  createQuestion,
  createProfilePage,
  createPerson,
  createOrganization,
  createLanguage,
  createPronounceableText,
  FAQPageSchema,
  AnswerSchema,
  AlignmentObjectSchema,
  MonetaryAmountSchema,
  PostalAddressSchema,
  InteractionCounterSchema,
} from "../../src/index";

// ─── Language ─────────────────────────────────────────────────────────────────

describe("createLanguage", () => {
  it("sets @type = Language", () => {
    expect(createLanguage({ name: "English" }).toObject()["@type"]).toBe("Language");
  });
});

describe("createPronounceableText", () => {
  it("sets @type = PronounceableText", () => {
    const pt = createPronounceableText({ textValue: "Hello World", inLanguage: "en-US" });
    expect(pt.toObject()["@type"]).toBe("PronounceableText");
  });
});

// ─── ItemList ─────────────────────────────────────────────────────────────────

describe("createItemList", () => {
  it("sets @type = ItemList", () => {
    const list = createItemList({
      itemListElement: [
        { "@type": "ListItem", position: 1, url: "https://example.com/a" },
        { "@type": "ListItem", position: 2, url: "https://example.com/b" },
      ],
    });
    expect(list.toObject()["@type"]).toBe("ItemList");
  });

  it("stores itemListElement correctly", () => {
    const list = createItemList({
      itemListElement: [{ "@type": "ListItem", position: 1, name: "Item A" }],
    });
    expect(Array.isArray(list.toObject().itemListElement)).toBe(true);
  });
});

// ─── FAQPage ─────────────────────────────────────────────────────────────────

describe("FAQPageSchema (raw)", () => {
  it("parses a valid FAQ page", () => {
    const faq = FAQPageSchema.parse({
      name: "FAQ",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is your return policy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "30-day returns on all items.",
          },
        },
      ],
    });
    expect(faq["@type"]).toBe("FAQPage");
    expect(Array.isArray(faq.mainEntity)).toBe(true);
  });
});

// ─── QAPage ──────────────────────────────────────────────────────────────────

describe("createQAPage", () => {
  it("sets @type = QAPage", () => {
    // QAPage requires mainEntity (a single Question)
    const page = createQAPage({
      name: "Q&A Page",
      mainEntity: {
        "@type": "Question",
        name: "What is the answer?",
        acceptedAnswer: { "@type": "Answer", text: "42." },
      },
    });
    expect(page.toObject()["@type"]).toBe("QAPage");
  });
});

// ─── Quiz ────────────────────────────────────────────────────────────────────

describe("createQuiz", () => {
  it("sets @type = Quiz", () => {
    const quiz = createQuiz({ name: "History Quiz" });
    expect(quiz.toObject()["@type"]).toBe("Quiz");
  });

  it("accepts educationalAlignment", () => {
    const quiz = createQuiz({
      name: "Math Quiz",
      educationalAlignment: {
        "@type": "AlignmentObject",
        alignmentType: "educationalSubject",
        targetName: "Mathematics",
      },
    });
    expect((quiz.toObject().educationalAlignment as any)?.targetName).toBe("Mathematics");
  });
});

describe("createQuestion", () => {
  it("sets @type = Question", () => {
    const q = createQuestion({
      name: "What is 2 + 2?",
      acceptedAnswer: AnswerSchema.parse({ text: "4" }),
    });
    expect(q.toObject()["@type"]).toBe("Question");
    expect((q.toObject().acceptedAnswer as any)?.text).toBe("4");
  });
});

// ─── JobPosting ──────────────────────────────────────────────────────────────

describe("createJobPosting", () => {
  it("sets @type = JobPosting", () => {
    const job = createJobPosting({
      title: "Software Engineer",
      description: "Build great software.",
      hiringOrganization: { "@type": "Organization", name: "Acme" },
      jobLocation: {
        "@type": "Place",
        address: PostalAddressSchema.parse({ addressLocality: "SF", addressCountry: "US" }),
      },
      datePosted: "2025-03-01",
    });
    expect(job.toObject()["@type"]).toBe("JobPosting");
  });

  it("accepts remote work location", () => {
    const job = createJobPosting({
      title: "Remote Engineer",
      description: "Work from anywhere.",
      hiringOrganization: { "@type": "Organization", name: "Acme" },
      jobLocationType: "TELECOMMUTE",
      datePosted: "2025-03-01",
    });
    expect(job.toObject().jobLocationType).toBe("TELECOMMUTE");
  });

  it("accepts baseSalary as MonetaryAmount", () => {
    const job = createJobPosting({
      title: "Engineer",
      description: "Build things.",
      hiringOrganization: { "@type": "Organization", name: "Acme" },
      datePosted: "2025-03-01",
      baseSalary: MonetaryAmountSchema.parse({
        currency: "USD",
        value: { "@type": "QuantitativeValue", value: 120000, unitText: "YEAR" },
      }),
    });
    expect((job.toObject().baseSalary as any)?.currency).toBe("USD");
  });

  it("accepts employmentType array", () => {
    const job = createJobPosting({
      title: "Part-time Engineer",
      description: "Part-time role.",
      hiringOrganization: { "@type": "Organization", name: "Acme" },
      datePosted: "2025-03-01",
      employmentType: ["PART_TIME", "CONTRACTOR"],
    });
    expect(Array.isArray(job.toObject().employmentType)).toBe(true);
  });
});

// ─── DiscussionForumPosting ───────────────────────────────────────────────────

describe("createDiscussionForumPosting", () => {
  it("sets @type = DiscussionForumPosting", () => {
    // headline and author are required by Google
    const post = createDiscussionForumPosting({
      headline: "How do I handle async errors?",
      text: "I have a question about...",
      url: "https://forum.example.com/t/1",
      datePublished: "2025-01-01",
      author: { "@type": "Person", name: "Alice" },
    });
    expect(post.toObject()["@type"]).toBe("DiscussionForumPosting");
  });

  it("accepts interactionStatistic array", () => {
    const post = createDiscussionForumPosting({
      headline: "Topic Title",
      text: "Body",
      url: "https://forum.example.com/t/2",
      datePublished: "2025-01-01",
      author: { "@type": "Person", name: "Bob" },
      interactionStatistic: [
        { "@type": "InteractionCounter", interactionType: "https://schema.org/LikeAction", userInteractionCount: 10 },
      ],
    });
    expect(Array.isArray(post.toObject().interactionStatistic)).toBe(true);
  });
});

// ─── ProfilePage ─────────────────────────────────────────────────────────────

describe("createProfilePage", () => {
  it("sets @type = ProfilePage", () => {
    const page = createProfilePage({
      name: "Alice's Profile",
      url: "https://example.com/alice",
    });
    expect(page.toObject()["@type"]).toBe("ProfilePage");
  });

  it("accepts mainEntity as Person", () => {
    const page = createProfilePage({
      name: "Alice's Profile",
      url: "https://example.com/alice",
      mainEntity: createPerson({ name: "Alice" }).toObject(),
    });
    expect((page.toObject().mainEntity as any)?.["@type"]).toBe("Person");
    expect((page.toObject().mainEntity as any)?.name).toBe("Alice");
  });

  it("accepts mainEntity as Organization", () => {
    const page = createProfilePage({
      name: "Acme's Profile",
      url: "https://example.com/acme",
      mainEntity: createOrganization({ name: "Acme" }).toObject(),
    });
    expect((page.toObject().mainEntity as any)?.["@type"]).toBe("Organization");
  });
});

// ─── Quiz (Education Q&A) ─────────────────────────────────────────────────────

describe("createQuiz (Education Q&A)", () => {
  it("accepts eduQuestionType on Question", () => {
    const quiz = createQuiz({
      name: "Biology Quiz",
      hasPart: [
        {
          "@type": "Question",
          name: "What is photosynthesis?",
          eduQuestionType: "Flashcard",
          acceptedAnswer: { "@type": "Answer", text: "The process by which plants make food." },
        },
      ],
    });
    const parts = quiz.toObject().hasPart as any[];
    expect(parts[0].eduQuestionType).toBe("Flashcard");
  });

  it("accepts educationalAlignment as AlignmentObject", () => {
    const quiz = createQuiz({
      name: "Math Quiz",
      educationalAlignment: AlignmentObjectSchema.parse({
        alignmentType: "educationalSubject",
        targetName: "Algebra",
        educationalFramework: "Common Core",
      }),
    });
    expect((quiz.toObject().educationalAlignment as any)?.["@type"]).toBe("AlignmentObject");
  });

  it("accepts educationalAlignment as array", () => {
    const quiz = createQuiz({
      name: "Science Quiz",
      educationalAlignment: [
        AlignmentObjectSchema.parse({ alignmentType: "educationalSubject", targetName: "Physics" }),
        AlignmentObjectSchema.parse({ alignmentType: "educationalLevel", targetName: "High School" }),
      ],
    });
    expect(Array.isArray(quiz.toObject().educationalAlignment)).toBe(true);
  });
});

// ─── DiscussionForumPosting (new fields) ──────────────────────────────────────

describe("createDiscussionForumPosting (new fields)", () => {
  it("accepts creativeWorkStatus", () => {
    const post = createDiscussionForumPosting({
      headline: "My Post",
      author: "Jane",
      creativeWorkStatus: "published",
    });
    expect(post.toObject().creativeWorkStatus).toBe("published");
  });

  it("accepts dateModified and mainEntityOfPage", () => {
    const post = createDiscussionForumPosting({
      headline: "My Post",
      author: "Jane",
      dateModified: "2025-06-15",
      mainEntityOfPage: "https://example.com/forum/post/1",
    });
    expect(post.toObject().dateModified).toBe("2025-06-15");
  });

  it("uses shared InteractionCounterSchema", () => {
    const post = createDiscussionForumPosting({
      headline: "Popular Post",
      author: "Jane",
      interactionStatistic: InteractionCounterSchema.parse({
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: 99,
      }),
    });
    expect((post.toObject().interactionStatistic as any)?.["@type"]).toBe("InteractionCounter");
  });
});
