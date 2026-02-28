import { z } from "zod";
import { makeFactory } from "../../core/base";
import { CreativeWorkSchema } from "./CreativeWork";
import { PersonOrOrgRef } from "../shared/PersonOrOrgRef";
import { OfferSchema } from "../shared/Offer";
import { PostalAddressSchema } from "../shared/PostalAddress";
import { AggregateRatingSchema } from "../shared/Rating";
import { ImageOrUrl } from "../shared/ImageObject";

/**
 * schema.org/CourseInstance
 * A specific run/session of a Course.
 */
export const CourseInstanceSchema = z.object({
  "@type": z.literal("CourseInstance").default("CourseInstance"),
  courseMode: z.union([z.string(), z.array(z.string())]),  // "online", "onsite", "blended"
  instructor: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
  startDate: z.string().optional(),              // ISO 8601
  endDate: z.string().optional(),               // ISO 8601
  location: z.union([z.string(), PostalAddressSchema]).optional(),
  offers: z.union([OfferSchema, z.array(OfferSchema)]).optional(),
  courseWorkload: z.string().optional(),         // ISO 8601 duration, e.g. "PT10H"
  courseSchedule: z.object({
    "@type": z.literal("Schedule").default("Schedule"),
    repeatFrequency: z.string().optional(),     // e.g. "P1W"
    repeatCount: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }).optional(),
});

/**
 * schema.org/Course
 * Google required: name, description
 * Google recommended: provider, hasCourseInstance
 */
export const CourseSchema = CreativeWorkSchema.extend({
  "@type": z.literal("Course").default("Course"),
  // Required by Google:
  name: z.string(),
  description: z.string(),
  // Recommended by Google:
  provider: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
  hasCourseInstance: z.union([CourseInstanceSchema, z.array(CourseInstanceSchema)]).optional(),
  // Optional:
  coursePrerequisites: z.union([z.string(), z.array(z.string())]).optional(),
  educationalCredentialAwarded: z.union([
    z.string(),
    z.object({
      "@type": z.literal("EducationalOccupationalCredential").default("EducationalOccupationalCredential"),
      name: z.string(),
      url: z.string().url().optional(),
    }),
  ]).optional(),
  occupationalCredentialAwarded: z.union([z.string(), z.array(z.string())]).optional(),
  numberOfCredits: z.union([
    z.number(),
    z.object({
      "@type": z.literal("StructuredValue").default("StructuredValue"),
      value: z.number(),
    }),
  ]).optional(),
  financialAidEligible: z.union([z.string(), z.boolean()]).optional(),
  aggregateRating: AggregateRatingSchema.optional(),
  image: z.union([ImageOrUrl, z.array(ImageOrUrl)]).optional(),
  offers: z.union([OfferSchema, z.array(OfferSchema)]).optional(),
  inLanguage: z.union([z.string(), z.array(z.string())]).optional(),
  syllabusSections: z.array(z.object({
    "@type": z.literal("Syllabus").default("Syllabus"),
    name: z.string(),
    description: z.string().optional(),
  })).optional(),
});

export type CourseInstance = z.infer<typeof CourseInstanceSchema>;
export type Course = z.infer<typeof CourseSchema>;

export const createCourse = makeFactory(CourseSchema);
