import { z } from "zod";
import { makeFactory } from "../../core/base";
import { CreativeWorkSchema } from "./CreativeWork";
import { PersonOrOrgRef } from "../shared/PersonOrOrgRef";

/**
 * schema.org/WebSite
 * Represents an entire website. Used for:
 *   - Knowledge panel signals (name, url, description, sameAs)
 *   - Sitelinks Searchbox (deprecated by Google Feb 2022, retained for completeness)
 *
 * Google recommended fields: name, url
 * Combine with Organization in @graph for a complete knowledge panel signal.
 */
export const WebSiteSchema = CreativeWorkSchema.extend({
  "@type": z.literal("WebSite").default("WebSite"),
  url: z.url().optional(),
  name: z.string().optional(),
  /**
   * Sitelinks Searchbox via SearchAction.
   * @deprecated Google removed the Sitelinks Searchbox feature in November 2024.
   * This field is still valid JSON-LD and harmless to include, but Google no
   * longer displays a search box in branded search results.
   * See: https://developers.google.com/search/blog/2024/11/retiring-sitelinks-searchbox
   */
  potentialAction: z
    .object({
      "@type": z.literal("SearchAction"),
      target: z.union([
        z.string(),
        z.object({
          "@type": z.literal("EntryPoint"),
          urlTemplate: z.string(),
        }),
      ]),
      "query-input": z.string().optional(),
    })
    .optional(),
  // Content language(s)
  inLanguage: z.union([z.string(), z.array(z.string())]).optional(),
  // Authorship / ownership
  publisher: PersonOrOrgRef.optional(),
  // Site-level metadata
  copyrightYear: z.number().int().optional(),
  // isPartOf — rarely used for WebSite itself but allowed (accept @id refs for @graph)
  isPartOf: z
    .union([
      z.object({ "@id": z.string() }),
      z.lazy(() => z.object({ "@type": z.string() }).catchall(z.unknown())),
    ])
    .optional(),
});

export type WebSite = z.infer<typeof WebSiteSchema>;

export const createWebSite = makeFactory(WebSiteSchema);
