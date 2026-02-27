import { describe, it, expect } from "vitest";
import {
  createArticle,
  createNewsArticle,
  createBlogPosting,
  createWebPage,
  createWebSite,
  createDataset,
  createRecipe,
  createCourse,
  createSoftwareApplication,
  createMobileApplication,
  createWebApplication,
  createMathSolver,
  createVideoObject,
  createBook,
  createPerson,
  createOrganization,
  ClipSchema,
  BroadcastEventSchema,
  HowToStepSchema,
  NutritionInformationSchema,
  AggregateRatingSchema,
  ReadActionSchema,
  BorrowActionSchema,
  BookEditionSchema,
  BookFormatType,
} from "../../src/index";

// ─── Article ─────────────────────────────────────────────────────────────────

describe("createArticle", () => {
  it("sets @type = Article", () => {
    expect(createArticle({ headline: "Hello" }).toObject()["@type"]).toBe("Article");
  });

  it("accepts author as Person reference", () => {
    const article = createArticle({
      headline: "Hello",
      author: { "@type": "Person", name: "Alice" },
    });
    expect((article.toObject().author as any)?.name).toBe("Alice");
  });

  it("accepts image as array", () => {
    const article = createArticle({
      headline: "Hello",
      image: ["https://example.com/1.jpg", "https://example.com/2.jpg"],
    });
    expect(Array.isArray(article.toObject().image)).toBe(true);
  });

  it("accepts datePublished and dateModified", () => {
    const article = createArticle({
      headline: "Hello",
      datePublished: "2025-01-01",
      dateModified: "2025-01-15",
    });
    expect(article.toObject().datePublished).toBe("2025-01-01");
  });
});

describe("createNewsArticle", () => {
  it("sets @type = NewsArticle", () => {
    expect(createNewsArticle({ headline: "News" }).toObject()["@type"]).toBe("NewsArticle");
  });
});

describe("createBlogPosting", () => {
  it("sets @type = BlogPosting", () => {
    expect(createBlogPosting({ headline: "Post" }).toObject()["@type"]).toBe("BlogPosting");
  });
});

// ─── WebPage ─────────────────────────────────────────────────────────────────

describe("createWebPage", () => {
  it("sets @type = WebPage", () => {
    expect(createWebPage({ name: "About" }).toObject()["@type"]).toBe("WebPage");
  });

  it("accepts url and name", () => {
    const page = createWebPage({ name: "About", url: "https://example.com/about" });
    expect(page.toObject().url).toBe("https://example.com/about");
  });

  it("accepts @id for @graph cross-referencing", () => {
    const page = createWebPage({
      "@id": "https://example.com/about#webpage",
      name: "About",
      url: "https://example.com/about",
    });
    expect(page.toObject()["@id"]).toBe("https://example.com/about#webpage");
  });
});

// ─── WebSite ─────────────────────────────────────────────────────────────────

describe("createWebSite", () => {
  it("sets @type = WebSite", () => {
    expect(createWebSite({ name: "Acme" }).toObject()["@type"]).toBe("WebSite");
  });

  it("accepts url, name, inLanguage", () => {
    const site = createWebSite({
      name: "Acme",
      url: "https://acme.com",
      inLanguage: "en-US",
    });
    expect(site.toObject().url).toBe("https://acme.com");
    expect(site.toObject().inLanguage).toBe("en-US");
  });

  it("accepts potentialAction SearchAction", () => {
    const site = createWebSite({
      name: "Acme",
      url: "https://acme.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://acme.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    });
    expect((site.toObject().potentialAction as any)?.["@type"]).toBe("SearchAction");
  });

  it("appears in toJsonLd() with @context", () => {
    const ld = createWebSite({ name: "Site" }).toJsonLd();
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("WebSite");
  });
});

// ─── Dataset ─────────────────────────────────────────────────────────────────

describe("createDataset", () => {
  it("sets @type = Dataset", () => {
    expect(createDataset({ name: "Data", description: "Desc" }).toObject()["@type"]).toBe("Dataset");
  });

  it("accepts license URL", () => {
    const ds = createDataset({
      name: "Data",
      description: "Desc",
      license: "https://creativecommons.org/licenses/by/4.0/",
    });
    expect(ds.toObject().license).toBe("https://creativecommons.org/licenses/by/4.0/");
  });

  it("accepts distribution array", () => {
    const ds = createDataset({
      name: "Data",
      description: "Desc",
      distribution: [
        { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: "https://example.com/data.csv" },
      ],
    });
    expect(Array.isArray(ds.toObject().distribution)).toBe(true);
  });
});

// ─── Recipe ──────────────────────────────────────────────────────────────────

// Recipe requires name + image (Google's mandatory fields)
const RECIPE_IMAGE = "https://example.com/pasta.jpg";

describe("createRecipe", () => {
  it("sets @type = Recipe", () => {
    expect(createRecipe({ name: "Pasta", image: RECIPE_IMAGE }).toObject()["@type"]).toBe("Recipe");
  });

  it("accepts recipeIngredient and recipeInstructions", () => {
    const recipe = createRecipe({
      name: "Pasta",
      image: RECIPE_IMAGE,
      recipeIngredient: ["200g pasta", "tomato sauce"],
      recipeInstructions: [
        HowToStepSchema.parse({ text: "Boil water" }),
        HowToStepSchema.parse({ text: "Add pasta" }),
      ],
    });
    expect(Array.isArray(recipe.toObject().recipeIngredient)).toBe(true);
    expect(Array.isArray(recipe.toObject().recipeInstructions)).toBe(true);
  });

  it("accepts nutrition information", () => {
    const recipe = createRecipe({
      name: "Pasta",
      image: RECIPE_IMAGE,
      nutrition: NutritionInformationSchema.parse({ calories: "350 calories" }),
    });
    expect((recipe.toObject().nutrition as any)?.calories).toBe("350 calories");
  });

  it("accepts aggregateRating", () => {
    const recipe = createRecipe({
      name: "Pasta",
      image: RECIPE_IMAGE,
      aggregateRating: AggregateRatingSchema.parse({ ratingValue: 4.7, ratingCount: 300, bestRating: 5 }),
    });
    expect((recipe.toObject().aggregateRating as any)?.ratingValue).toBe(4.7);
  });

  it("accepts image as array", () => {
    const recipe = createRecipe({
      name: "Pasta",
      image: ["https://example.com/1.jpg", "https://example.com/2.jpg"],
    });
    expect(Array.isArray(recipe.toObject().image)).toBe(true);
  });
});

// ─── Course ──────────────────────────────────────────────────────────────────

describe("createCourse", () => {
  it("sets @type = Course", () => {
    expect(createCourse({ name: "Python 101", description: "Intro to Python" }).toObject()["@type"]).toBe("Course");
  });

  it("accepts provider", () => {
    const course = createCourse({
      name: "Python 101",
      description: "Intro",
      provider: createOrganization({ name: "Academy" }).toObject(),
    });
    expect((course.toObject().provider as any)?.name).toBe("Academy");
  });

  it("accepts hasCourseInstance array", () => {
    const course = createCourse({
      name: "Python 101",
      description: "Intro",
      hasCourseInstance: [{
        "@type": "CourseInstance",
        courseMode: "online",
        offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
      }],
    });
    expect(Array.isArray(course.toObject().hasCourseInstance)).toBe(true);
  });
});

// ─── SoftwareApplication ─────────────────────────────────────────────────────

describe("createSoftwareApplication", () => {
  it("sets @type = SoftwareApplication", () => {
    const app = createSoftwareApplication({ name: "MyApp" });
    expect(app.toObject()["@type"]).toBe("SoftwareApplication");
  });

  it("createMobileApplication sets @type = MobileApplication", () => {
    const app = createMobileApplication({ name: "MyApp" });
    expect(app.toObject()["@type"]).toBe("MobileApplication");
  });

  it("createWebApplication sets @type = WebApplication", () => {
    const app = createWebApplication({ name: "MyApp" });
    expect(app.toObject()["@type"]).toBe("WebApplication");
  });

  it("accepts operatingSystem as array", () => {
    const app = createMobileApplication({
      name: "MyApp",
      operatingSystem: ["Android 8+", "iOS 14+"],
    });
    expect(Array.isArray(app.toObject().operatingSystem)).toBe(true);
  });

  it("accepts aggregateRating", () => {
    const app = createSoftwareApplication({
      name: "MyApp",
      aggregateRating: AggregateRatingSchema.parse({ ratingValue: 4.2, ratingCount: 500, bestRating: 5 }),
    });
    expect((app.toObject().aggregateRating as any)?.ratingValue).toBe(4.2);
  });
});

// ─── MathSolver ──────────────────────────────────────────────────────────────

describe("createMathSolver", () => {
  it("sets @type = MathSolver", () => {
    // eduQuestionType and mathExpression are string fields on SolveMathAction
    const solver = createMathSolver({
      name: "Algebra Solver",
      potentialAction: {
        "@type": "SolveMathAction",
        eduQuestionType: "Algebra",
        mathExpression: "x^2 + 2x + 1 = 0",
      },
    });
    expect(solver.toObject()["@type"]).toBe("MathSolver");
  });

  it("accepts potentialAction as array of SolveMathActions", () => {
    const solver = createMathSolver({
      name: "Multi Solver",
      potentialAction: [
        { "@type": "SolveMathAction", eduQuestionType: "Algebra" },
        { "@type": "SolveMathAction", eduQuestionType: "Calculus" },
      ],
    });
    expect(Array.isArray(solver.toObject().potentialAction)).toBe(true);
  });
});

// ─── VideoObject ─────────────────────────────────────────────────────────────

describe("createVideoObject", () => {
  it("sets @type = VideoObject", () => {
    const video = createVideoObject({
      name: "My Video",
      description: "A video",
      thumbnailUrl: ["https://example.com/thumb.jpg"],
      uploadDate: "2025-01-01",
    });
    expect(video.toObject()["@type"]).toBe("VideoObject");
  });

  it("accepts hasPart as Clip array (key moments)", () => {
    const video = createVideoObject({
      name: "Tutorial",
      description: "A tutorial",
      thumbnailUrl: ["https://example.com/thumb.jpg"],
      uploadDate: "2025-01-01",
      hasPart: [
        ClipSchema.parse({ name: "Intro", startOffset: 0, endOffset: 60, url: "https://example.com/v.mp4#t=0" }),
      ],
    });
    expect(Array.isArray(video.toObject().hasPart)).toBe(true);
  });

  it("accepts livestream publication", () => {
    const video = createVideoObject({
      name: "Live Event",
      description: "A live event",
      thumbnailUrl: ["https://example.com/thumb.jpg"],
      uploadDate: "2025-06-01",
      isLiveBroadcast: true,
      publication: BroadcastEventSchema.parse({
        isLiveBroadcast: true,
        startDate: "2025-06-01T10:00:00Z",
        endDate: "2025-06-01T12:00:00Z",
      }),
    });
    expect(video.toObject().isLiveBroadcast).toBe(true);
  });
});

// ─── Book ─────────────────────────────────────────────────────────────────────

describe("createBook", () => {
  it("sets @type = Book", () => {
    const book = createBook({
      name: "The Pragmatic Programmer",
      author: { "@type": "Person", name: "David Thomas" },
    });
    expect(book.toObject()["@type"]).toBe("Book");
  });

  it("accepts author as array", () => {
    const book = createBook({
      name: "The Pragmatic Programmer",
      author: [
        { "@type": "Person", name: "David Thomas" },
        { "@type": "Person", name: "Andrew Hunt" },
      ],
    });
    expect(Array.isArray(book.toObject().author)).toBe(true);
  });

  it("accepts isbn and description", () => {
    const book = createBook({
      name: "Clean Code",
      author: { "@type": "Person", name: "Robert C. Martin" },
      isbn: "9780132350884",
      description: "A handbook of agile software craftsmanship.",
    });
    expect(book.toObject().isbn).toBe("9780132350884");
    expect(book.toObject().description).toBeDefined();
  });

  it("accepts workExample with ReadAction", () => {
    const edition = BookEditionSchema.parse({
      name: "Clean Code (eBook)",
      bookFormat: "EBook",
      inLanguage: "en",
      isbn: "9780132350884",
      potentialAction: ReadActionSchema.parse({
        target: "https://read.example.com/clean-code",
        expectsAcceptanceOf: { "@type": "Offer", price: 9.99, priceCurrency: "USD" },
      }),
    });
    const book = createBook({
      name: "Clean Code",
      author: { "@type": "Person", name: "Robert C. Martin" },
      workExample: edition,
    });
    const workExample = book.toObject().workExample as any;
    expect(workExample["@type"]).toBe("Book");
    expect(workExample.potentialAction?.["@type"]).toBe("ReadAction");
  });

  it("accepts workExample with BorrowAction", () => {
    const edition = BookEditionSchema.parse({
      bookFormat: "Hardcover",
      inLanguage: "en",
      potentialAction: BorrowActionSchema.parse({
        lender: { "@type": "LibrarySystem", name: "City Public Library" },
        target: "https://catalog.library.example/borrow/12345",
      }),
    });
    const book = createBook({
      name: "The Great Gatsby",
      author: { "@type": "Person", name: "F. Scott Fitzgerald" },
      workExample: edition,
    });
    const workExample = book.toObject().workExample as any;
    expect(workExample.potentialAction?.["@type"]).toBe("BorrowAction");
    expect(workExample.potentialAction?.lender?.name).toBe("City Public Library");
  });

  it("BookFormatType accepts valid values", () => {
    expect(() => BookFormatType.parse("EBook")).not.toThrow();
    expect(() => BookFormatType.parse("Hardcover")).not.toThrow();
    expect(() => BookFormatType.parse("AudioBook")).not.toThrow();
  });
});
