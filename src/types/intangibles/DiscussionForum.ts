import { z } from "zod";
import { makeFactory } from "../../core/base";
import { CreativeWorkSchema } from "../creative-works/CreativeWork";
import { PersonOrOrgRef } from "../shared/PersonOrOrgRef";
import { ImageOrUrl } from "../shared/ImageObject";

/**
 * schema.org/DiscussionForumPosting
 * User-generated content (short-form discussion posts).
 * Google required: headline, author
 * Google recommended: datePublished, url, comment
 */
export const DiscussionForumPostingSchema = CreativeWorkSchema.extend({
  "@type": z.literal("DiscussionForumPosting").default("DiscussionForumPosting"),
  // Required by Google:
  headline: z.string(),
  author: PersonOrOrgRef,
  // Recommended:
  text: z.string().optional(),
  datePublished: z.string().optional(),          // ISO 8601
  url: z.url().optional(),
  comment: z.array(z.object({
    "@type": z.literal("Comment").default("Comment"),
    text: z.string(),
    author: PersonOrOrgRef.optional(),
    datePublished: z.string().optional(),
    upvoteCount: z.number().int().nonnegative().optional(),
    downvoteCount: z.number().int().nonnegative().optional(),
    url: z.url().optional(),
  })).optional(),
  commentCount: z.number().int().nonnegative().optional(),
  upvoteCount: z.number().int().nonnegative().optional(),
  downvoteCount: z.number().int().nonnegative().optional(),
  image: ImageOrUrl.optional(),
  // For reposts:
  sharedContent: z.lazy(() =>
    z.object({ "@type": z.string() }).catchall(z.unknown())
  ).optional(),
  interactionStatistic: z.array(z.object({
    "@type": z.literal("InteractionCounter").default("InteractionCounter"),
    interactionType: z.string(),
    userInteractionCount: z.number().int().nonnegative(),
  })).optional(),
});

export type DiscussionForumPosting = z.infer<typeof DiscussionForumPostingSchema>;

export const createDiscussionForumPosting = makeFactory(DiscussionForumPostingSchema);
