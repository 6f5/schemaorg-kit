/**
 * discussion-forum.ts — DiscussionForumPosting structured data
 *
 * Demonstrates: a forum thread, question thread (with answer),
 * and a forum @graph with organization.
 */

import {
  createDiscussionForumPosting,
  createPerson,
  createOrganization,
  createGraph,
  createWebPage,
} from "../src/index";

// ─── Basic Forum Post ─────────────────────────────────────────────────────
// Google can show Discussion Forum threads in search results.

const forumPost = createDiscussionForumPosting({
  name: "How to handle async/await errors properly in TypeScript?",
  text:
    "I've been working on a Node.js API and I'm struggling with the best pattern for " +
    "handling async/await errors consistently. I know about try/catch, but I've seen " +
    "patterns with Result types and error-first callbacks. What's the community " +
    "recommendation for large-scale TypeScript projects?\n\n" +
    "Currently doing this:\n```\ntry {\n  const data = await fetchData();\n} catch (e) {\n  console.error(e);\n}\n```\n\n" +
    "Is there a better way?",
  url: "https://devforum.example.com/t/how-to-handle-async-await-errors-typescript/42891",
  datePublished: "2025-03-10T14:23:00Z",
  dateModified: "2025-03-10T17:45:00Z",
  author: createPerson({
    name: "coderJake",
    url: "https://devforum.example.com/u/coderJake",
  }).toObject(),
  interactionStatistic: [
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/LikeAction",
      userInteractionCount: 42,
    },
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/CommentAction",
      userInteractionCount: 18,
    },
  ],
  inLanguage: "en-US",
});

console.log("=== Forum Post ===");
console.log(forumPost.toScript());

// ─── Question thread with accepted answer ─────────────────────────────────

const questionPost = createDiscussionForumPosting({
  name: "Best practices for database indexing on a 10M+ row table?",
  text:
    "Our PostgreSQL table has grown to over 10 million rows and queries are getting slow. " +
    "We have a composite query that filters on `status`, `created_at`, and `user_id`. " +
    "What indexes should I create? Should I use a partial index? B-tree vs GIN?",
  url: "https://devforum.example.com/t/database-indexing-10m-rows/51204",
  datePublished: "2025-04-02T09:11:00Z",
  dateModified: "2025-04-03T16:30:00Z",
  author: createPerson({
    name: "db_newbie_2025",
    url: "https://devforum.example.com/u/db_newbie_2025",
  }).toObject(),
  // The accepted answer — surfaced by Google as an Answer entity
  sharedContent: {
    "@type": "Comment",
    text:
      "For your use case, a composite B-tree index on (status, user_id, created_at) " +
      "will likely be most effective since you're filtering on all three. Use a partial " +
      "index if 'status' has a high-cardinality value you filter on most often (e.g., " +
      "`WHERE status = 'active'`). Run EXPLAIN ANALYZE to confirm the planner uses it. " +
      "GIN is for full-text search or JSONB — not what you need here.",
    author: createPerson({
      name: "postgres_expert",
      url: "https://devforum.example.com/u/postgres_expert",
    }).toObject(),
    datePublished: "2025-04-02T10:45:00Z",
    upvoteCount: 87,
  },
  interactionStatistic: [
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/LikeAction",
      userInteractionCount: 112,
    },
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/CommentAction",
      userInteractionCount: 34,
    },
  ],
  isPartOf: {
    "@type": "DiscussionForumPosting",
    name: "Database Optimization",
    url: "https://devforum.example.com/c/databases",
  },
  inLanguage: "en-US",
});

console.log("\n=== Question Thread with Answer ===");
console.log(questionPost.toJsonLd());

// ─── Forum announcement post ──────────────────────────────────────────────

const announcement = createDiscussionForumPosting({
  name: "DevForum 3.0 is here — new features and redesign",
  text:
    "After 6 months of development, we're thrilled to launch DevForum 3.0! " +
    "Key changes include: improved code syntax highlighting, threaded replies, " +
    "dark mode, faster search, and a new reputation system. " +
    "Read the full changelog at the link below.",
  url: "https://devforum.example.com/t/devforum-3-launch/60001",
  datePublished: "2025-05-01T08:00:00Z",
  author: createOrganization({
    name: "DevForum Team",
    url: "https://devforum.example.com/about",
  }).toObject(),
  interactionStatistic: [
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/LikeAction",
      userInteractionCount: 543,
    },
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/CommentAction",
      userInteractionCount: 201,
    },
  ],
  inLanguage: "en-US",
  keywords: ["announcement", "changelog", "platform update"],
});

console.log("\n=== Announcement Post ===");
console.log(announcement.toJsonLd());

// ─── @graph for forum thread page ─────────────────────────────────────────

const forumOrg = createOrganization({
  "@id": "https://devforum.example.com/#organization",
  name: "DevForum",
  url: "https://devforum.example.com",
  logo: "https://devforum.example.com/logo.png",
  description: "A community forum for software developers. Ask questions, share knowledge.",
});

const threadPage = createWebPage({
  "@id": "https://devforum.example.com/t/how-to-handle-async-await-errors-typescript/42891#webpage",
  name: "How to handle async/await errors in TypeScript? — DevForum",
  url: "https://devforum.example.com/t/how-to-handle-async-await-errors-typescript/42891",
  description: "Community discussion on best patterns for async/await error handling in TypeScript.",
  datePublished: "2025-03-10",
  dateModified: "2025-03-10",
  inLanguage: "en-US",
  isPartOf: { "@id": "https://devforum.example.com/#website" },
});

const graph = createGraph([forumOrg, threadPage, forumPost]);

console.log("\n=== Forum thread @graph ===");
console.log(graph.toScript());
