import { z } from "zod";
import { extendThing } from "../things/Thing";
import { makeFactory } from "../../core/base";

/**
 * schema.org/Language
 * Inherits all properties from Thing.
 */
export const LanguageSchema = extendThing("Language", {
  // No additional properties beyond Thing for Language
  // But you can attach any Thing props: name, alternateName, url, etc.
});

export type Language = z.infer<typeof LanguageSchema>;
export const createLanguage = makeFactory(LanguageSchema);

/**
 * schema.org/PronounceableText
 * Text that can be pronounced, with language and phonetics info.
 */
export const PronounceableTextSchema = z.object({
  "@type": z.literal("PronounceableText").default("PronounceableText"),

  textValue: z.string(),

  // Accepts either a BCP 47 string like "en-US" or a full Language object
  inLanguage: z.union([z.string(), LanguageSchema]).optional(),

  phoneticText: z.string().optional(),
  speechToTextMarkup: z.string().optional(),
});

export type PronounceableText = z.infer<typeof PronounceableTextSchema>;
export const createPronounceableText = makeFactory(PronounceableTextSchema);
