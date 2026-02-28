---
title: Guides
nav_order: 3
has_children: true
---

# Guides

Step-by-step guides for generating Google-eligible rich results with `schemaorg-kit`. Each guide covers the required and recommended fields, common mistakes, and a complete working example you can copy into your project.

## Rich Result Types

| Guide | Google Rich Result | Eligible Content |
|-------|--------------------|-----------------|
| [Article](article) | Article snippet with author, date | Blog posts, news, editorial |
| [Product](product) | Price, availability, reviews | E-commerce product pages |
| [Local Business](local-business) | Business info, hours, map | Restaurants, shops, services |
| [Event](event) | Date, location, ticket link | Concerts, workshops, webinars |
| [Recipe](recipe) | Cook time, rating, nutrition | Food & cooking content |
| [FAQ](faq) | Expandable Q&A pairs | Support pages, product pages |
| [Job Posting](job-posting) | Salary, location, apply button | Careers / jobs pages |
| [Organization](organization) | Knowledge panel signals | Brand / company pages |
| [Video](video) | Video thumbnail, duration | Video pages |
| [Software App](software-app) | Rating, price, platform | App landing pages |
| [Dataset](dataset) | Dataset discovery card | Open data, research |
| [Course](course) | Provider, duration | E-learning pages |
| [Vacation Rental](vacation-rental) | Amenities, rating | Property listings |
| [Book Actions](book) | Read / Borrow buttons *(invite-only)* | Book & publishing pages |
| [Website & Sitelinks](website) | Sitelinks search box | Homepage |
| [Claim Review](claim-review) | Fact-check verdict label | Fact-checking articles |
| [Discussion Forum](discussion-forum) | Forum thread snippet | Forums, communities |
| [Education Q&A](education-qa) | Flashcard / practice Qs | Study & flashcard pages |
| [Math Solver](math-solver) | Math solver feature | Online math tools |
| [Profile Page](profile-page) | Creator profile signals | Author & profile pages |
| [Person](person) | Author / creator identity | Author bios, team pages |
| [@graph — Multi-Schema Pages](multi-schema) | Combined signals | Any page with multiple entities |

---

## How Google Rich Results Work

Google's crawlers read the JSON-LD in your `<head>` and use it to enhance your listing in search. Your structured data must:

1. **Match the visible page content** — don't describe content that isn't on the page
2. **Be complete** — required fields must be present and non-empty
3. **Use the right `@type`** — Google only enhances supported types
4. **Be accessible** — paywalled content needs special markup

Test your output at [Google's Rich Results Test](https://search.google.com/test/rich-results).
