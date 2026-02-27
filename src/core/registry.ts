import { z } from "zod";
import { SchemaNode } from "./base";

// Things
import { PersonSchema } from "../types/things/Person";
import { OrganizationSchema } from "../types/things/Organization";
import { ProductSchema, ProductGroupSchema } from "../types/things/Product";
import { EventSchema } from "../types/things/Event";
import { PlaceSchema } from "../types/things/Place";
import { LocalBusinessSchema } from "../types/things/LocalBusiness";
import { MovieSchema } from "../types/things/Movie";

// Creative Works
import { BookSchema } from "../types/creative-works/Book";
import { ArticleSchema, NewsArticleSchema, BlogPostingSchema } from "../types/creative-works/Article";
import { WebPageSchema } from "../types/creative-works/WebPage";
import { WebSiteSchema } from "../types/creative-works/WebSite";
import { DatasetSchema } from "../types/creative-works/Dataset";
import { RecipeSchema } from "../types/creative-works/Recipe";
import { CourseSchema } from "../types/creative-works/Course";
import { SoftwareApplicationSchema } from "../types/creative-works/SoftwareApplication";
import { MathSolverSchema } from "../types/creative-works/MathSolver";
import { ClaimReviewSchema } from "../types/creative-works/ClaimReview";

// Intangibles
import { LanguageSchema, PronounceableTextSchema } from "../types/intangibles/Language";
import { JobPostingSchema } from "../types/intangibles/JobPosting";
import { FAQPageSchema, QAPageSchema, QuizSchema, QuestionSchema } from "../types/intangibles/QAPage";
import { DiscussionForumPostingSchema } from "../types/intangibles/DiscussionForum";
import { ItemListSchema } from "../types/intangibles/ItemList";
import { ProfilePageSchema } from "../types/intangibles/ProfilePage";

// Lodging
import { VacationRentalSchema } from "../types/lodging/VacationRental";

// Shared (useful standalone)
import { ImageObjectSchema } from "../types/shared/ImageObject";
import { OfferSchema } from "../types/shared/Offer";
import { ReviewSchema } from "../types/shared/Rating";
import { VideoObjectSchema } from "../types/shared/VideoObject";

const REGISTRY = {
  // Things
  Person: PersonSchema,
  Organization: OrganizationSchema,
  Product: ProductSchema,
  ProductGroup: ProductGroupSchema,
  Event: EventSchema,
  Place: PlaceSchema,
  LocalBusiness: LocalBusinessSchema,
  Movie: MovieSchema,

  // Creative Works
  Book: BookSchema,
  Article: ArticleSchema,
  NewsArticle: NewsArticleSchema,
  BlogPosting: BlogPostingSchema,
  WebPage: WebPageSchema,
  WebSite: WebSiteSchema,
  Dataset: DatasetSchema,
  Recipe: RecipeSchema,
  Course: CourseSchema,
  SoftwareApplication: SoftwareApplicationSchema,
  MathSolver: MathSolverSchema,
  ClaimReview: ClaimReviewSchema,

  // Intangibles
  Language: LanguageSchema,
  PronounceableText: PronounceableTextSchema,
  JobPosting: JobPostingSchema,
  FAQPage: FAQPageSchema,
  QAPage: QAPageSchema,
  Quiz: QuizSchema,
  Question: QuestionSchema,
  DiscussionForumPosting: DiscussionForumPostingSchema,
  ItemList: ItemListSchema,
  ProfilePage: ProfilePageSchema,

  // Lodging
  VacationRental: VacationRentalSchema,

  // Shared types (useful in unified factory)
  ImageObject: ImageObjectSchema,
  Offer: OfferSchema,
  Review: ReviewSchema,
  VideoObject: VideoObjectSchema,
} as const;

export type SchemaType = keyof typeof REGISTRY;

/**
 * Unified factory for any schema.org type.
 * Provides a single entry point for all supported types.
 *
 * @example
 * const product = schema("Product", { name: "Shoes", offers: { ... } })
 * const event = schema("Event", { name: "Concert", startDate: "2025-06-01" })
 */
export function schema<T extends SchemaType>(
  type: T,
  data: Omit<z.infer<(typeof REGISTRY)[T]>, "@type">
): SchemaNode<(typeof REGISTRY)[T]["shape"]> {
  const zodSchema = REGISTRY[type] as z.ZodObject<(typeof REGISTRY)[T]["shape"]>;
  const parsed = zodSchema.parse(data);
  return new SchemaNode(zodSchema, parsed);
}
