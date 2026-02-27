import { describe, it, expect } from "vitest";
import {
  createBreadcrumbList,
  createFAQPage,
  createCarousel,
  createPaywalledArticle,
  createPaywalledWebPage,
  createArticle,
  createProduct,
  createRecipe,
} from "../src/index";

// ─── createBreadcrumbList ─────────────────────────────────────────────────────

describe("createBreadcrumbList", () => {
  it("sets @type = BreadcrumbList", () => {
    const bc = createBreadcrumbList([
      { name: "Home", url: "https://example.com" },
      { name: "About" },
    ]);
    expect(bc.toObject()["@type"]).toBe("BreadcrumbList");
  });

  it("assigns sequential positions starting at 1", () => {
    const bc = createBreadcrumbList([
      { name: "Home", url: "https://example.com" },
      { name: "Blog", url: "https://example.com/blog" },
      { name: "Post" },
    ]);
    const items = bc.toObject().itemListElement as any[];
    expect(items[0]?.position).toBe(1);
    expect(items[1]?.position).toBe(2);
    expect(items[2]?.position).toBe(3);
  });

  it("last item has no url (current page)", () => {
    const bc = createBreadcrumbList([
      { name: "Home", url: "https://example.com" },
      { name: "About" },
    ]);
    const items = bc.toObject().itemListElement as any[];
    expect(items[1]?.item).toBeUndefined();
  });

  it("sets ListItem @type on all items", () => {
    const bc = createBreadcrumbList([{ name: "Home", url: "https://example.com" }]);
    const items = bc.toObject().itemListElement as any[];
    expect(items[0]?.["@type"]).toBe("ListItem");
  });

  it("toScript() is valid JSON-LD", () => {
    const bc = createBreadcrumbList([{ name: "Home", url: "https://example.com" }]);
    const script = bc.toScript();
    const body = script.replace(/<script[^>]*>/, "").replace(/<\/script>/, "").trim();
    expect(() => JSON.parse(body)).not.toThrow();
  });
});

// ─── createFAQPage ────────────────────────────────────────────────────────────

describe("createFAQPage (helper)", () => {
  it("sets @type = FAQPage", () => {
    const faq = createFAQPage([
      { question: "What is your return policy?", answer: "30 days." },
    ]);
    expect(faq.toObject()["@type"]).toBe("FAQPage");
  });

  it("wraps items as Question/Answer entities", () => {
    const faq = createFAQPage([
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "A2." },
    ]);
    const entities = faq.toObject().mainEntity as any[];
    expect(entities).toHaveLength(2);
    expect(entities[0]?.["@type"]).toBe("Question");
    expect(entities[0]?.name).toBe("Q1?");
    expect(entities[0]?.acceptedAnswer?.["@type"]).toBe("Answer");
    expect(entities[0]?.acceptedAnswer?.text).toBe("A1.");
  });

  it("accepts HTML in answer text", () => {
    const faq = createFAQPage([
      { question: "How?", answer: "<p>Step 1. <b>Do this.</b></p>" },
    ]);
    const entities = faq.toObject().mainEntity as any[];
    expect(entities[0]?.acceptedAnswer?.text).toContain("<p>");
  });
});

// ─── createCarousel ───────────────────────────────────────────────────────────

describe("createCarousel", () => {
  it("sets @type = ItemList", () => {
    const carousel = createCarousel([
      createProduct({ name: "Product A" }),
      createProduct({ name: "Product B" }),
    ]);
    expect(carousel.toObject()["@type"]).toBe("ItemList");
  });

  it("assigns sequential positions starting at 1", () => {
    const img = "https://example.com/recipe.jpg";
    const carousel = createCarousel([
      createRecipe({ name: "Recipe A", image: img }),
      createRecipe({ name: "Recipe B", image: img }),
      createRecipe({ name: "Recipe C", image: img }),
    ]);
    const items = carousel.toObject().itemListElement as any[];
    expect(items[0]?.position).toBe(1);
    expect(items[1]?.position).toBe(2);
    expect(items[2]?.position).toBe(3);
  });

  it("each item has @type = ListItem", () => {
    const carousel = createCarousel([createProduct({ name: "Shoes" })]);
    const items = carousel.toObject().itemListElement as any[];
    expect(items[0]?.["@type"]).toBe("ListItem");
  });

  it("item.item contains the nested schema object", () => {
    const carousel = createCarousel([createProduct({ name: "Shoes" })]);
    const items = carousel.toObject().itemListElement as any[];
    expect(items[0]?.item?.["@type"]).toBe("Product");
    expect(items[0]?.item?.name).toBe("Shoes");
  });
});

// ─── createPaywalledArticle ───────────────────────────────────────────────────

describe("createPaywalledArticle", () => {
  it("sets isAccessibleForFree = false", () => {
    const article = createPaywalledArticle(
      { headline: "Premium Content", author: { "@type": "Person", name: "Alice" } },
      { cssSelector: ".paywall" }
    );
    expect(article.toObject().isAccessibleForFree).toBe(false);
  });

  it("adds hasPart with cssSelector", () => {
    const article = createPaywalledArticle(
      { headline: "Premium Content" },
      { cssSelector: ".article-body" }
    );
    const parts = article.toObject().hasPart as any[];
    expect(Array.isArray(parts)).toBe(true);
    expect(parts[0]?.cssSelector).toBe(".article-body");
    expect(parts[0]?.isAccessibleForFree).toBe(false);
  });

  it("sets @type = Article", () => {
    const article = createPaywalledArticle(
      { headline: "Premium" },
      { cssSelector: ".body" }
    );
    expect(article.toObject()["@type"]).toBe("Article");
  });
});

describe("createPaywalledWebPage", () => {
  it("sets isAccessibleForFree = false", () => {
    const page = createPaywalledWebPage(
      { name: "Members Only" },
      { cssSelector: ".content" }
    );
    expect(page.toObject().isAccessibleForFree).toBe(false);
  });

  it("sets @type = WebPage", () => {
    const page = createPaywalledWebPage(
      { name: "Members Only" },
      { cssSelector: ".content" }
    );
    expect(page.toObject()["@type"]).toBe("WebPage");
  });
});
