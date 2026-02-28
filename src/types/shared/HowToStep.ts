import { z } from "zod";
import { ImageOrUrl } from "./ImageObject";

/**
 * schema.org/HowToStep
 * An individual step in a Recipe or HowTo.
 */
export const HowToStepSchema = z.object({
  "@type": z.literal("HowToStep").default("HowToStep"),
  name: z.string().optional(), // Step title (avoid "Step 1" format per Google)
  text: z.string(), // Step description
  url: z.url().optional(), // Anchor link to step
  image: ImageOrUrl.optional(),
});

/**
 * schema.org/HowToSection
 * A group of related HowToSteps.
 */
export const HowToSectionSchema = z.object({
  "@type": z.literal("HowToSection").default("HowToSection"),
  name: z.string(),
  itemListElement: z.array(HowToStepSchema),
  description: z.string().optional(),
});

export type HowToStep = z.infer<typeof HowToStepSchema>;
export type HowToSection = z.infer<typeof HowToSectionSchema>;
