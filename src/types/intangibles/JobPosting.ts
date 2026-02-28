import { z } from "zod";
import { makeFactory } from "../../core/base";
import { PostalAddressSchema } from "../shared/PostalAddress";
import { MonetaryAmountSchema } from "../shared/MonetaryAmount";
import { ImageOrUrl } from "../shared/ImageObject";

/**
 * Employment type enum for JobPosting.
 */
export const EmploymentType = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACTOR",
  "TEMPORARY",
  "INTERN",
  "VOLUNTEER",
  "PER_DIEM",
  "OTHER",
]);

const HiringOrgRef = z.object({
  "@type": z
    .union([z.literal("Organization"), z.literal("LocalBusiness")])
    .default("Organization"),
  name: z.string(),
  sameAs: z.url().optional(),
  logo: ImageOrUrl.optional(),
  url: z.url().optional(),
});

const JobLocationRef = z.object({
  "@type": z.literal("Place").default("Place"),
  address: z.union([z.string(), PostalAddressSchema]),
});

/**
 * schema.org/JobPosting
 * Google required: title, description, hiringOrganization, jobLocation, datePosted
 * Google recommended: validThrough, employmentType, baseSalary, directApply
 */
export const JobPostingSchema = z.object({
  "@type": z.literal("JobPosting").default("JobPosting"),
  // Required by Google:
  title: z.string(),
  description: z.string(),
  hiringOrganization: z.union([z.object({ "@id": z.string() }), HiringOrgRef]),
  jobLocation: z.union([JobLocationRef, z.array(JobLocationRef)]).optional(),
  datePosted: z.string(), // ISO 8601 date
  // Recommended by Google:
  validThrough: z.string().optional(), // ISO 8601 datetime
  employmentType: z.union([EmploymentType, z.array(EmploymentType)]).optional(),
  baseSalary: MonetaryAmountSchema.optional(),
  jobLocationType: z.string().optional(), // "TELECOMMUTE" for remote
  applicantLocationRequirements: z
    .union([
      z.object({ "@type": z.string(), name: z.string() }),
      z.array(z.object({ "@type": z.string(), name: z.string() })),
    ])
    .optional(),
  directApply: z.boolean().optional(),
  // Optional:
  identifier: z
    .object({
      "@type": z.literal("PropertyValue").default("PropertyValue"),
      name: z.string().optional(),
      value: z.union([z.string(), z.number()]),
    })
    .optional(),
  experienceRequirements: z
    .union([
      z.string(),
      z.object({
        "@type": z
          .literal("OccupationalExperienceRequirements")
          .default("OccupationalExperienceRequirements"),
        monthsOfExperience: z.number(),
      }),
    ])
    .optional(),
  educationRequirements: z
    .union([
      z.string(),
      z.object({
        "@type": z
          .literal("EducationalOccupationalCredential")
          .default("EducationalOccupationalCredential"),
        credentialCategory: z.string(), // e.g. "bachelor degree", "high school"
      }),
    ])
    .optional(),
  experienceInPlaceOfEducation: z.boolean().optional(),
  qualifications: z.string().optional(),
  responsibilities: z.string().optional(),
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  industry: z.string().optional(),
  occupationalCategory: z.string().optional(), // O*NET-SOC codes
  workHours: z.string().optional(),
  url: z.url().optional(),
  sameAs: z.url().optional(),
});

export type JobPosting = z.infer<typeof JobPostingSchema>;

export const createJobPosting = makeFactory(JobPostingSchema);
