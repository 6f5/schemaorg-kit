/**
 * course.ts — Course and CourseInstance structured data
 *
 * Demonstrates: course with provider, course instances (in-person + online),
 * course carousel, and a full @graph for a course landing page.
 */

import {
  createCourse,
  createOrganization,
  createGraph,
  createCarousel,
  AggregateRatingSchema,
} from "../src/index";

const provider = createOrganization({
  name: "Acme Online Academy",
  url: "https://academy.acme.com",
  logo: "https://academy.acme.com/logo.png",
  sameAs: [
    "https://www.coursera.org/acme-academy",
    "https://www.linkedin.com/school/acme-academy",
  ],
});

// ─── Single course with instances ─────────────────────────────────────────
// Google Course rich result shows in search for course name queries.

const pythonCourse = createCourse({
  name: "Python for Data Science: Zero to Hero",
  description:
    "Master Python programming for data analysis, visualization, and machine learning. " +
    "Covers NumPy, Pandas, Matplotlib, Scikit-learn, and hands-on projects with real datasets.",
  provider: provider.toObject(),
  url: "https://academy.acme.com/courses/python-data-science",
  image: "https://academy.acme.com/courses/python-data-science/hero.jpg",
  inLanguage: "en-US",
  educationalLevel: "Beginner",
  teaches: [
    "Python fundamentals",
    "NumPy and Pandas",
    "Data visualization with Matplotlib and Seaborn",
    "Machine learning with Scikit-learn",
    "Real-world data projects",
  ],
  skillLevel: "Beginner",
  hasCourseInstance: [
    // Self-paced online instance (always available)
    {
      "@type": "CourseInstance",
      courseMode: "online",
      courseSchedule: {
        "@type": "Schedule",
        repeatFrequency: "P1W",
        repeatCount: 12,
        duration: "PT3H",
      },
      offers: {
        "@type": "Offer",
        price: 49,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: "https://academy.acme.com/courses/python-data-science/enroll",
      },
      instructor: {
        "@type": "Person",
        name: "Dr. Priya Sharma",
        url: "https://academy.acme.com/instructors/sharma",
      },
    },
    // Live cohort
    {
      "@type": "CourseInstance",
      courseMode: "blended",
      startDate: "2025-04-07",
      endDate: "2025-06-27",
      location: {
        "@type": "VirtualLocation",
        url: "https://academy.acme.com/live/python-data-science-spring-2025",
      },
      offers: {
        "@type": "Offer",
        price: 299,
        priceCurrency: "USD",
        availability: "https://schema.org/LimitedAvailability",
        validThrough: "2025-03-31",
        url: "https://academy.acme.com/courses/python-data-science/live-cohort",
      },
      instructor: {
        "@type": "Person",
        name: "Dr. Priya Sharma",
        url: "https://academy.acme.com/instructors/sharma",
      },
    },
  ],
  aggregateRating: AggregateRatingSchema.parse({
    ratingValue: 4.8,
    ratingCount: 12400,
    bestRating: 5,
    worstRating: 1,
  }),
  numberOfCredits: 3,
  occupationalCredentialAwarded: "Certificate of Completion",
});

console.log("=== Python Data Science Course ===");
console.log(pythonCourse.toScript());

// ─── In-person / university-style course ──────────────────────────────────

const universityCourse = createCourse({
  name: "Introduction to Machine Learning",
  description:
    "Foundational concepts in supervised and unsupervised machine learning. " +
    "Topics include linear regression, decision trees, neural networks, and model evaluation.",
  provider: {
    "@type": "EducationalOrganization",
    name: "State University",
    url: "https://stateuniversity.example.edu",
  },
  url: "https://stateuniversity.example.edu/catalog/cs-4820",
  inLanguage: "en-US",
  educationalLevel: "undergraduate",
  courseCode: "CS 4820",
  about: [
    { "@type": "DefinedTerm", name: "Machine Learning" },
    { "@type": "DefinedTerm", name: "Neural Networks" },
    { "@type": "DefinedTerm", name: "Data Science" },
  ],
  hasCourseInstance: [
    {
      "@type": "CourseInstance",
      courseMode: "onsite",
      startDate: "2025-09-02",
      endDate: "2025-12-12",
      location: {
        "@type": "Place",
        name: "Engineering Hall, Room 204",
        address: {
          "@type": "PostalAddress",
          streetAddress: "100 University Dr",
          addressLocality: "Springfield",
          addressRegion: "IL",
          postalCode: "62701",
          addressCountry: "US",
        },
      },
      offers: {
        "@type": "Offer",
        price: 0,
        priceCurrency: "USD",
        description: "Included in tuition",
      },
      instructor: {
        "@type": "Person",
        name: "Prof. James Liu",
        url: "https://stateuniversity.example.edu/faculty/liu",
      },
    },
  ],
  numberOfCredits: 4,
  timeRequired: "PT16H",
  educationalCredentialAwarded: "3 credit hours toward B.S. Computer Science",
});

console.log("\n=== University Course (in-person) ===");
console.log(universityCourse.toJsonLd());

// ─── Course Carousel (multiple courses) ───────────────────────────────────
// Google can show a carousel of courses from your site.

const webDevCourse = createCourse({
  name: "Full-Stack Web Development Bootcamp",
  description:
    "Build modern web applications with React, Node.js, and PostgreSQL. " +
    "Portfolio-ready projects included.",
  provider: provider.toObject(),
  url: "https://academy.acme.com/courses/fullstack-bootcamp",
  image: "https://academy.acme.com/courses/fullstack-bootcamp/hero.jpg",
  hasCourseInstance: [{
    "@type": "CourseInstance",
    courseMode: "online",
    offers: { "@type": "Offer", price: 79, priceCurrency: "USD" },
  }],
  aggregateRating: AggregateRatingSchema.parse({
    ratingValue: 4.7,
    ratingCount: 8900,
    bestRating: 5,
  }),
});

const cloudCourse = createCourse({
  name: "AWS Cloud Practitioner Certification Prep",
  description:
    "Everything you need to pass the AWS Certified Cloud Practitioner exam. " +
    "Includes practice exams, flashcards, and hands-on labs.",
  provider: provider.toObject(),
  url: "https://academy.acme.com/courses/aws-cloud-practitioner",
  image: "https://academy.acme.com/courses/aws-cloud-practitioner/hero.jpg",
  hasCourseInstance: [{
    "@type": "CourseInstance",
    courseMode: "online",
    offers: { "@type": "Offer", price: 39, priceCurrency: "USD" },
  }],
  aggregateRating: AggregateRatingSchema.parse({
    ratingValue: 4.9,
    ratingCount: 5200,
    bestRating: 5,
  }),
});

const carousel = createCarousel([pythonCourse, webDevCourse, cloudCourse]);

console.log("\n=== Course Carousel ===");
console.log(carousel.toScript());

// ─── @graph for a course landing page ─────────────────────────────────────

const graph = createGraph([provider, pythonCourse]);

console.log("\n=== Course landing page @graph ===");
console.log(graph.toScript());
