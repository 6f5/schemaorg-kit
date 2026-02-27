import { z } from "zod";

export const InteractionCounterSchema = z.object({
  "@type": z.literal("InteractionCounter").default("InteractionCounter"),
  interactionType: z.string(), // full URL, e.g. "https://schema.org/LikeAction"
  userInteractionCount: z.number().int().nonnegative(),
});

export type InteractionCounter = z.infer<typeof InteractionCounterSchema>;
