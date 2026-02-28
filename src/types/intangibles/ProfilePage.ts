import { z } from "zod";
import { makeFactory } from "../../core/base";
import { WebPageSchema } from "../creative-works/WebPage";

/**
 * schema.org/ProfilePage
 * A page focused on information about a person or organization.
 * Used by Google's profile page rich result.
 * Google recommended: mainEntity (Person or Organization), hasPart (published content)
 */
export const ProfilePageSchema = WebPageSchema.extend({
  "@type": z.literal("ProfilePage").default("ProfilePage"),
  // mainEntity: the person or org this profile is about (accept @id refs for @graph)
  mainEntity: z.union([
    z.object({ "@id": z.string() }),
    z.lazy(() => z.object({ "@type": z.string() }).catchall(z.unknown())),
  ]).optional(),
  // hasPart: content published by/about this profile subject
  hasPart: z.array(
    z.union([
      z.object({ "@id": z.string() }),
      z.lazy(() => z.object({ "@type": z.string() }).catchall(z.unknown())),
    ])
  ).optional(),
  dateCreated: z.string().optional(),
  dateModified: z.string().optional(),
});

export type ProfilePage = z.infer<typeof ProfilePageSchema>;

export const createProfilePage = makeFactory(ProfilePageSchema);
