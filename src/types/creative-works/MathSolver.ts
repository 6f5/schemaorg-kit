import { z } from "zod";
import { makeFactory } from "../../core/base";
import { CreativeWorkSchema } from "./CreativeWork";

/**
 * schema.org/SolveMathAction
 * Represents an action that solves a math problem.
 */
export const SolveMathActionSchema = z.object({
  "@type": z.literal("SolveMathAction").default("SolveMathAction"),
  eduQuestionType: z.string().optional(),        // e.g. "Algebra", "Calculus"
  mathExpression: z.string().optional(),
  target: z.object({
    "@type": z.literal("EntryPoint").default("EntryPoint"),
    urlTemplate: z.string().optional(),
    actionAccessibilityRequirement: z.object({
      "@type": z.literal("ActionAccessSpecification").default("ActionAccessSpecification"),
      requiresSubscription: z.boolean().optional(),
    }).optional(),
  }).optional(),
});

/**
 * schema.org/MathSolver
 * Used by Google's Math Solver rich result.
 * Google required: name, potentialAction (SolveMathAction)
 */
export const MathSolverSchema = CreativeWorkSchema.extend({
  "@type": z.literal("MathSolver").default("MathSolver"),
  name: z.string(),
  url: z.url().optional(),
  potentialAction: z.union([SolveMathActionSchema, z.array(SolveMathActionSchema)]).optional(),
  mathExpression: z.union([z.string(), z.array(z.string())]).optional(),
  educationalLevel: z.string().optional(),
  teaches: z.union([z.string(), z.array(z.string())]).optional(),
});

export type SolveMathAction = z.infer<typeof SolveMathActionSchema>;
export type MathSolver = z.infer<typeof MathSolverSchema>;

export const createMathSolver = makeFactory(MathSolverSchema);
