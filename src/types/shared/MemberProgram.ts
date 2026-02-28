import { z } from "zod";

export const MemberProgramTierSchema = z.object({
  "@type": z.literal("MemberProgramTier").default("MemberProgramTier"),
  name: z.string(),
  hasTierBenefit: z.union([z.string(), z.array(z.string())]),
  hasTierRequirement: z
    .union([z.string(), z.object({}).catchall(z.unknown())])
    .optional(),
  membershipPointsEarned: z
    .object({
      "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
      value: z.number().optional(),
      unitText: z.string().optional(),
    })
    .optional(),
  url: z.url().optional(),
});

export type MemberProgramTier = z.infer<typeof MemberProgramTierSchema>;

export const MemberProgramSchema = z.object({
  "@type": z.literal("MemberProgram").default("MemberProgram"),
  name: z.string(),
  description: z.string().optional(),
  hasTiers: z
    .union([MemberProgramTierSchema, z.array(MemberProgramTierSchema)])
    .optional(),
  url: z.url().optional(),
});

export type MemberProgram = z.infer<typeof MemberProgramSchema>;
