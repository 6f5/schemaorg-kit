import { z } from "zod";
import { makeFactory } from "../../core/base";
import { CreativeWorkSchema } from "./CreativeWork";
import { PersonOrOrgRef } from "../shared/PersonOrOrgRef";

// Re-export CreativeWorkSchema for backward compatibility and convenience
export { CreativeWorkSchema } from "./CreativeWork";
export type { CreativeWork } from "./CreativeWork";

// Re-export Article types for backward compatibility
export {
  ArticleSchema,
  NewsArticleSchema,
  BlogPostingSchema,
  createArticle,
  createNewsArticle,
  createBlogPosting,
} from "./Article";
export type { Article, NewsArticle, BlogPosting } from "./Article";

/**
 * schema.org/WebPage
 * General web page type.
 */
export const WebPageSchema = CreativeWorkSchema.extend({
  "@type": z.literal("WebPage").default("WebPage"),
  breadcrumb: z
    .union([
      z.object({ "@id": z.string() }),
      z.lazy(() =>
        z.object({ "@type": z.literal("BreadcrumbList") }).catchall(z.unknown()),
      ),
    ])
    .optional(),
  lastReviewed: z.string().optional(),
  reviewedBy: PersonOrOrgRef.optional(),
  speakable: z
    .object({
      "@type": z
        .literal("SpeakableSpecification")
        .default("SpeakableSpecification"),
      cssSelector: z.union([z.string(), z.array(z.string())]).optional(),
      xpath: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .optional(),
  significantLink: z.union([z.url(), z.array(z.url())]).optional(),
  mainContentOfPage: z
    .union([
      z.object({ "@id": z.string() }),
      z.object({ "@type": z.string() }).catchall(z.unknown()),
    ])
    .optional(),
  primaryImageOfPage: z
    .union([
      z.object({ "@id": z.string() }),
      z.object({ "@type": z.string() }).catchall(z.unknown()),
    ])
    .optional(),
  relatedLink: z.union([z.url(), z.array(z.url())]).optional(),
});

export type WebPage = z.infer<typeof WebPageSchema>;

export const createWebPage = makeFactory(WebPageSchema);
