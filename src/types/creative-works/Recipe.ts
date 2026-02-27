import { z } from "zod";
import { makeFactory } from "../../core/base";
import { CreativeWorkSchema } from "./CreativeWork";
import { PersonOrOrgRef } from "../shared/PersonOrOrgRef";
import { AggregateRatingSchema, ReviewSchema } from "../shared/Rating";
import { ImageOrUrl } from "../shared/ImageObject";
import { VideoObjectSchema } from "../shared/VideoObject";
import { HowToStepSchema, HowToSectionSchema } from "../shared/HowToStep";

/**
 * schema.org/NutritionInformation
 * Per-serving nutrition data for Recipe.
 */
export const NutritionInformationSchema = z.object({
  "@type": z.literal("NutritionInformation").default("NutritionInformation"),
  calories: z.string().optional(),               // e.g. "270 calories"
  carbohydrateContent: z.string().optional(),    // e.g. "20 grams"
  cholesterolContent: z.string().optional(),
  fatContent: z.string().optional(),
  fiberContent: z.string().optional(),
  proteinContent: z.string().optional(),
  saturatedFatContent: z.string().optional(),
  servingSize: z.string().optional(),
  sodiumContent: z.string().optional(),
  sugarContent: z.string().optional(),
  transFatContent: z.string().optional(),
  unsaturatedFatContent: z.string().optional(),
});

/**
 * schema.org/Recipe
 * Google required: name, image
 * Google recommended: author, datePublished, description, prepTime, cookTime,
 *   totalTime, recipeYield, recipeIngredient, recipeInstructions, aggregateRating
 */
export const RecipeSchema = CreativeWorkSchema.extend({
  "@type": z.literal("Recipe").default("Recipe"),
  // Required by Google:
  name: z.string(),
  image: z.union([ImageOrUrl, z.array(ImageOrUrl)]),
  // Recommended by Google:
  author: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
  datePublished: z.string().optional(),          // ISO 8601 date
  description: z.string().optional(),
  prepTime: z.string().optional(),               // ISO 8601 duration, e.g. "PT15M"
  cookTime: z.string().optional(),               // ISO 8601 duration
  totalTime: z.string().optional(),              // ISO 8601 duration
  recipeYield: z.union([z.string(), z.number(), z.array(z.string())]).optional(),
  recipeCategory: z.string().optional(),         // e.g. "Dessert", "Dinner"
  recipeCuisine: z.string().optional(),          // e.g. "Italian", "French"
  recipeIngredient: z.array(z.string()).optional(),
  recipeInstructions: z.array(
    z.union([z.string(), HowToStepSchema, HowToSectionSchema])
  ).optional(),
  nutrition: NutritionInformationSchema.optional(),
  video: z.union([VideoObjectSchema, z.array(VideoObjectSchema)]).optional(),
  aggregateRating: AggregateRatingSchema.optional(),
  review: z.union([ReviewSchema, z.array(ReviewSchema)]).optional(),
  keywords: z.union([z.string(), z.array(z.string())]).optional(),
  cookingMethod: z.string().optional(),
  suitableForDiet: z.union([z.string(), z.array(z.string())]).optional(), // schema.org enum URL
  estimatedCost: z.string().optional(),
});

export type NutritionInformation = z.infer<typeof NutritionInformationSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;

export const createRecipe = makeFactory(RecipeSchema);
