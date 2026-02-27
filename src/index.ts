// ============================================================
//   Core
// ============================================================
export { SchemaNode, makeFactory } from "./core/base";
export { schema, type SchemaType } from "./core/registry";
export { SchemaGraph, createGraph } from "./core/graph";

// ============================================================
//   Shared building blocks
//   (export schemas + types so users can compose with .toObject())
// ============================================================
export {
  PersonOrOrgRef,
  type PersonOrOrgRefType,
} from "./types/shared/PersonOrOrgRef";

export {
  PostalAddressSchema,
  type PostalAddress,
} from "./types/shared/PostalAddress";

export {
  GeoCoordinatesSchema,
  type GeoCoordinates,
} from "./types/shared/GeoCoordinates";

export {
  ImageObjectSchema,
  ImageOrUrl,
  type ImageObject,
  createImageObject,
} from "./types/shared/ImageObject";

export {
  ContactPointSchema,
  type ContactPoint,
} from "./types/shared/ContactPoint";

export {
  MonetaryAmountSchema,
  PriceSpecificationSchema,
  type MonetaryAmount,
  type PriceSpecification,
} from "./types/shared/MonetaryAmount";

export {
  RatingSchema,
  AggregateRatingSchema,
  ReviewSchema,
  EmployerAggregateRatingSchema,
  type Rating,
  type AggregateRating,
  type Review,
  type EmployerAggregateRating,
} from "./types/shared/Rating";

export {
  ItemAvailability,
  ItemCondition,
  OfferSchema,
  AggregateOfferSchema,
  MerchantReturnPolicySchema,
  UnitPriceSpecificationSchema,
  MerchantReturnPolicySeasonalOverrideSchema,
  type Offer,
  type AggregateOffer,
  type MerchantReturnPolicy,
  type UnitPriceSpecification,
  type MerchantReturnPolicySeasonalOverride,
  createOffer,
} from "./types/shared/Offer";

export {
  DefinedRegionSchema,
  ShippingDeliveryTimeSchema,
  OfferShippingDetailsSchema,
  type DefinedRegion,
  type ShippingDeliveryTime,
  type OfferShippingDetails,
} from "./types/shared/ShippingDetails";

export {
  DayOfWeek,
  OpeningHoursSpecificationSchema,
  type OpeningHoursSpecification,
} from "./types/shared/OpeningHoursSpecification";

export {
  HowToStepSchema,
  HowToSectionSchema,
  type HowToStep,
  type HowToSection,
} from "./types/shared/HowToStep";

export {
  ClipSchema,
  BroadcastEventSchema,
  SeekToActionSchema,
  VideoObjectSchema,
  type Clip,
  type BroadcastEvent,
  type SeekToAction,
  type VideoObject,
  createVideoObject,
} from "./types/shared/VideoObject";

export {
  InteractionCounterSchema,
  type InteractionCounter,
} from "./types/shared/InteractionCounter";

export {
  MemberProgramTierSchema,
  MemberProgramSchema,
  type MemberProgramTier,
  type MemberProgram,
} from "./types/shared/MemberProgram";

export {
  ServicePeriodSchema,
  ShippingConditionsSchema,
  ShippingServiceSchema,
  type ServicePeriod,
  type ShippingConditions,
  type ShippingService,
} from "./types/shared/ShippingService";

// ============================================================
//   Things
// ============================================================
export {
  ThingSchema,
  extendThing,
  type Thing,
} from "./types/things/Thing";

export {
  PersonSchema,
  type Person,
  createPerson,
} from "./types/things/Person";

export {
  OrganizationSchema,
  type Organization,
  createOrganization,
  createNGO,
  createCorporation,
  createOnlineStore,
  createOnlineBusiness,
} from "./types/things/Organization";

export {
  ProductSchema,
  ProductGroupSchema,
  CertificationSchema,
  ThreeDModelSchema,
  SizeSpecificationSchema,
  PeopleAudienceSchema,
  type Product,
  type ProductGroup,
  type Certification,
  type ThreeDModel,
  type SizeSpecification,
  type PeopleAudience,
  createProduct,
  createProductGroup,
} from "./types/things/Product";

export {
  EventSchema,
  EventStatusType,
  EventAttendanceMode,
  type Event,
  createEvent,
} from "./types/things/Event";

export {
  PlaceSchema,
  type Place,
  createPlace,
} from "./types/things/Place";

export {
  LocalBusinessSchema,
  type LocalBusiness,
  createLocalBusiness,
  createRestaurant,
  createHotel,
} from "./types/things/LocalBusiness";

export {
  MovieSchema,
  type Movie,
  createMovie,
} from "./types/things/Movie";

// ============================================================
//   Creative Works
// ============================================================
export {
  CreativeWorkSchema,
  type CreativeWork,
} from "./types/creative-works/CreativeWork";

export {
  BookSchema,
  BookEditionSchema,
  ReadActionSchema,
  BorrowActionSchema,
  BookFormatType,
  type Book,
  type BookEdition,
  type ReadAction,
  type BorrowAction,
  createBook,
} from "./types/creative-works/Book";

export {
  WebPageSchema,
  type WebPage,
  createWebPage,
} from "./types/creative-works/WebPage";

export {
  WebSiteSchema,
  type WebSite,
  createWebSite,
} from "./types/creative-works/WebSite";

export {
  ArticleSchema,
  NewsArticleSchema,
  BlogPostingSchema,
  type Article,
  type NewsArticle,
  type BlogPosting,
  createArticle,
  createNewsArticle,
  createBlogPosting,
} from "./types/creative-works/Article";

export {
  DatasetSchema,
  PropertyValueSchema,
  type Dataset,
  type PropertyValue,
  createDataset,
} from "./types/creative-works/Dataset";

export {
  RecipeSchema,
  NutritionInformationSchema,
  type Recipe,
  type NutritionInformation,
  createRecipe,
} from "./types/creative-works/Recipe";

export {
  CourseSchema,
  CourseInstanceSchema,
  type Course,
  type CourseInstance,
  createCourse,
} from "./types/creative-works/Course";

export {
  SoftwareApplicationSchema,
  ApplicationCategory,
  type SoftwareApplication,
  createSoftwareApplication,
  createMobileApplication,
  createWebApplication,
} from "./types/creative-works/SoftwareApplication";

export {
  MathSolverSchema,
  SolveMathActionSchema,
  type MathSolver,
  type SolveMathAction,
  createMathSolver,
} from "./types/creative-works/MathSolver";

export {
  ClaimSchema,
  ClaimReviewSchema,
  type Claim,
  type ClaimReview,
  createClaimReview,
} from "./types/creative-works/ClaimReview";

// ============================================================
//   Intangibles
// ============================================================
export {
  LanguageSchema,
  type Language,
  createLanguage,
} from "./types/intangibles/Language";

export {
  PronounceableTextSchema,
  type PronounceableText,
  createPronounceableText,
} from "./types/intangibles/Language";

export {
  ItemListSchema,
  ListItemSchema,
  type ItemList,
  type ListItem,
  createItemList,
} from "./types/intangibles/ItemList";

export {
  AlignmentObjectSchema,
  AnswerSchema,
  QuestionSchema,
  FAQPageSchema,
  QAPageSchema,
  QuizSchema,
  type AlignmentObject,
  type Answer,
  type Question,
  type FAQPage,
  type QAPage,
  type Quiz,
  createQAPage,
  createQuiz,
  createQuestion,
} from "./types/intangibles/QAPage";

export {
  DiscussionForumPostingSchema,
  type DiscussionForumPosting,
  createDiscussionForumPosting,
} from "./types/intangibles/DiscussionForum";

export {
  EmploymentType,
  JobPostingSchema,
  type JobPosting,
  createJobPosting,
} from "./types/intangibles/JobPosting";

export {
  ProfilePageSchema,
  type ProfilePage,
  createProfilePage,
} from "./types/intangibles/ProfilePage";

// ============================================================
//   Lodging
// ============================================================
export {
  VacationRentalSchema,
  AccommodationSchema,
  BedDetailsSchema,
  BedTypeEnum,
  type VacationRental,
  type Accommodation,
  type BedDetails,
  createVacationRental,
} from "./types/lodging/VacationRental";

// ============================================================
//   Helpers (ergonomic wrappers)
// ============================================================
export { createBreadcrumbList } from "./helpers/breadcrumb";
export { createFAQPage } from "./helpers/faq";
export { createCarousel } from "./helpers/itemlist";
export { createPaywalledArticle, createPaywalledWebPage } from "./helpers/paywalled";
