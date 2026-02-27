import { z, ZodRawShape } from "zod";
import { ArticleSchema, createArticle } from "../types/creative-works/Article";
import { WebPageSchema, createWebPage } from "../types/creative-works/WebPage";
import { SchemaNode } from "../core/base";

type PaywallOptions = {
  /** CSS selector for the paywalled content, e.g. ".article-body" */
  cssSelector: string;
};

type ArticleInput = Omit<z.infer<typeof ArticleSchema>, "@type" | "isAccessibleForFree" | "hasPart">;
type WebPageInput = Omit<z.infer<typeof WebPageSchema>, "@type" | "isAccessibleForFree" | "hasPart">;

/**
 * Helper for subscription / paywalled Article content.
 * Automatically sets `isAccessibleForFree: false` and adds a
 * `hasPart` WebPageElement to indicate which section is paywalled.
 *
 * This helps Google differentiate paywalled content from cloaking.
 *
 * @example
 * createPaywalledArticle(
 *   { headline: "Premium Analysis", author: "Jane Doe" },
 *   { cssSelector: ".article-body" }
 * )
 */
export function createPaywalledArticle(
  data: ArticleInput,
  options: PaywallOptions
): SchemaNode<typeof ArticleSchema.shape> {
  return createArticle({
    ...data,
    isAccessibleForFree: false,
    hasPart: [{
      "@type": "WebPageElement",
      isAccessibleForFree: false,
      cssSelector: options.cssSelector,
    }],
  } as any);
}

/**
 * Helper for subscription / paywalled WebPage content.
 *
 * @example
 * createPaywalledWebPage(
 *   { name: "Premium Content Page" },
 *   { cssSelector: ".premium-content" }
 * )
 */
export function createPaywalledWebPage(
  data: WebPageInput,
  options: PaywallOptions
): SchemaNode<typeof WebPageSchema.shape> {
  return createWebPage({
    ...data,
    isAccessibleForFree: false,
    hasPart: [{
      "@type": "WebPageElement",
      isAccessibleForFree: false,
      cssSelector: options.cssSelector,
    }],
  } as any);
}
