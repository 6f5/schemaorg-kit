import { z } from "zod";
import { makeFactory } from "../../core/base";
import { CreativeWorkSchema } from "./CreativeWork";
import { ImageOrUrl } from "../shared/ImageObject";
import { VideoObjectSchema } from "../shared/VideoObject";

/**
 * schema.org/Article
 * Google recommended: author, datePublished, dateModified, headline, image
 */
export const ArticleSchema = CreativeWorkSchema.extend({
  "@type": z.literal("Article").default("Article"),
  articleBody: z.string().optional(),
  articleSection: z.string().optional(),
  wordCount: z.number().int().nonnegative().optional(),
  // Google Article requires image to be at least 1200px wide
  image: z.union([ImageOrUrl, z.array(ImageOrUrl)]).optional(),
  video: z.union([VideoObjectSchema, z.array(VideoObjectSchema)]).optional(),
  // Speakable for Article (Google Assistant)
  speakable: z.object({
    "@type": z.literal("SpeakableSpecification").default("SpeakableSpecification"),
    cssSelector: z.union([z.string(), z.array(z.string())]).optional(),
    xpath: z.union([z.string(), z.array(z.string())]).optional(),
  }).optional(),
});

/**
 * schema.org/NewsArticle
 * For news content. Eligible for Top Stories carousel and AMP articles.
 */
export const NewsArticleSchema = ArticleSchema.extend({
  "@type": z.literal("NewsArticle").default("NewsArticle"),
  dateline: z.string().optional(),
  printColumn: z.string().optional(),
  printEdition: z.string().optional(),
  printPage: z.string().optional(),
  printSection: z.string().optional(),
});

/**
 * schema.org/BlogPosting
 * For blog content.
 */
export const BlogPostingSchema = ArticleSchema.extend({
  "@type": z.literal("BlogPosting").default("BlogPosting"),
  sharedContent: z.union([
    z.object({ "@id": z.string() }),
    z.lazy(() => z.object({ "@type": z.string() }).catchall(z.unknown())),
  ]).optional(),
});

export type Article = z.infer<typeof ArticleSchema>;
export type NewsArticle = z.infer<typeof NewsArticleSchema>;
export type BlogPosting = z.infer<typeof BlogPostingSchema>;

export const createArticle = makeFactory(ArticleSchema);
export const createNewsArticle = makeFactory(NewsArticleSchema);
export const createBlogPosting = makeFactory(BlogPostingSchema);
