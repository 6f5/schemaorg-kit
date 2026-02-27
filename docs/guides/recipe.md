---
title: Recipe
parent: Guides
nav_order: 5
---

# Recipe Rich Results
{: .no_toc }

Recipe structured data produces the richest Google cards of any content type: cook time, servings, ingredients preview, nutrition, star ratings, and a video thumbnail — all displayed before the user even clicks.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Required Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | Recipe title |
| `image` | `string \| string[]` | Required by Google; multiple angles recommended |

## Recommended Fields

| Field | Type | Notes |
|-------|------|-------|
| `author` | `Person \| Organization` | Recipe author |
| `datePublished` | `string` | Publication date |
| `description` | `string` | Brief recipe description |
| `prepTime` | `string` | ISO 8601 duration (e.g. `"PT15M"`) |
| `cookTime` | `string` | ISO 8601 duration |
| `totalTime` | `string` | ISO 8601 duration |
| `recipeYield` | `string` | Servings, e.g. `"4 servings"` |
| `recipeCategory` | `string` | Breakfast, Dessert, etc. |
| `recipeCuisine` | `string` | Italian, Mexican, etc. |
| `recipeIngredient` | `string[]` | Full ingredient list |
| `recipeInstructions` | `HowToStep[] \| HowToSection[]` | Step-by-step instructions |
| `nutrition` | `NutritionInformation` | Calories, macros |
| `aggregateRating` | `AggregateRating` | Community ratings |
| `video` | `VideoObject` | Recipe video |
| `keywords` | `string` | Comma-separated keywords |

---

## ISO 8601 Duration Quick Reference

| Duration | Value |
|----------|-------|
| 15 minutes | `"PT15M"` |
| 1 hour | `"PT1H"` |
| 1 hour 30 min | `"PT1H30M"` |
| 2 days | `"P2D"` |
| 1 hour 15 min | `"PT1H15M"` |

---

## Full Recipe Example

```ts
import { createRecipe } from 'schemaorg-kit';

const recipe = createRecipe({
  name: 'Classic Tiramisu',
  description: 'The definitive Italian tiramisu with mascarpone cream, espresso-soaked ladyfingers, and a dusting of cocoa.',
  image: [
    'https://example.com/recipes/tiramisu-1200x900.jpg',
    'https://example.com/recipes/tiramisu-square.jpg',
  ],
  author: { '@type': 'Person', name: 'Giulia Rossi' },
  datePublished: '2025-01-20',
  prepTime: 'PT30M',
  cookTime: 'PT0M',       // no cooking needed
  totalTime: 'PT4H30M',   // includes 4h chilling
  recipeYield: '8 servings',
  recipeCategory: 'Dessert',
  recipeCuisine: 'Italian',
  keywords: 'tiramisu, italian dessert, mascarpone, no-bake',
  recipeIngredient: [
    '6 egg yolks',
    '¾ cup (150g) granulated sugar',
    '1 lb (450g) mascarpone cheese, softened',
    '1½ cups (360ml) heavy whipping cream',
    '2 cups (480ml) strong brewed espresso, cooled',
    '2 tablespoons rum or coffee liqueur (optional)',
    '24–30 ladyfinger biscuits (Savoiardi)',
    'Unsweetened cocoa powder for dusting',
  ],
  recipeInstructions: [
    {
      '@type': 'HowToStep',
      name: 'Whip the egg yolks',
      text: 'Beat egg yolks and sugar in a bowl set over simmering water until thick and pale yellow, about 5 minutes.',
      url: 'https://example.com/recipes/tiramisu#step-1',
    },
    {
      '@type': 'HowToStep',
      name: 'Add mascarpone',
      text: 'Remove from heat. Stir in softened mascarpone until smooth.',
      url: 'https://example.com/recipes/tiramisu#step-2',
    },
    {
      '@type': 'HowToStep',
      name: 'Whip cream',
      text: 'In a separate bowl, whip heavy cream to stiff peaks. Fold into mascarpone mixture.',
      url: 'https://example.com/recipes/tiramisu#step-3',
    },
    {
      '@type': 'HowToStep',
      name: 'Assemble',
      text: 'Dip each ladyfinger briefly in espresso mixture. Arrange in a single layer in a 9×13 inch dish. Spread half the cream mixture on top. Repeat layers.',
      url: 'https://example.com/recipes/tiramisu#step-4',
    },
    {
      '@type': 'HowToStep',
      name: 'Chill and serve',
      text: 'Refrigerate at least 4 hours or overnight. Dust with cocoa powder before serving.',
      url: 'https://example.com/recipes/tiramisu#step-5',
    },
  ],
  nutrition: {
    '@type': 'NutritionInformation',
    calories: '420 calories',
    carbohydrateContent: '38g',
    fatContent: '28g',
    proteinContent: '7g',
    sugarContent: '24g',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.9,
    ratingCount: 3820,
    bestRating: 5,
  },
});
```

---

## Grouped Instructions (HowToSection)

For complex recipes with distinct phases:

```ts
import { createRecipe } from 'schemaorg-kit';

const bread = createRecipe({
  name: 'Sourdough Bread',
  image: 'https://example.com/sourdough.jpg',
  recipeInstructions: [
    {
      '@type': 'HowToSection',
      name: 'Autolyse',
      itemListElement: [
        { '@type': 'HowToStep', text: 'Mix flour and water. Rest 1 hour.' },
        { '@type': 'HowToStep', text: 'Add starter and salt. Mix thoroughly.' },
      ],
    },
    {
      '@type': 'HowToSection',
      name: 'Bulk Fermentation',
      itemListElement: [
        { '@type': 'HowToStep', text: 'Perform 4 sets of stretch-and-folds over 2 hours.' },
        { '@type': 'HowToStep', text: 'Let dough bulk-ferment at 78°F for 4–5 hours until 50% risen.' },
      ],
    },
    {
      '@type': 'HowToSection',
      name: 'Bake',
      itemListElement: [
        { '@type': 'HowToStep', text: 'Preheat Dutch oven at 500°F for 1 hour.' },
        { '@type': 'HowToStep', text: 'Score dough. Bake covered 20 min, then uncovered 25 min.' },
      ],
    },
  ],
});
```

---

## Recipe with Video

```ts
import { createRecipe } from 'schemaorg-kit';

const recipe = createRecipe({
  name: 'Banana Bread',
  image: 'https://example.com/banana-bread.jpg',
  video: {
    '@type': 'VideoObject',
    name: 'How to Make Banana Bread',
    description: 'Step-by-step banana bread recipe video.',
    thumbnailUrl: 'https://example.com/videos/banana-bread-thumb.jpg',
    contentUrl: 'https://example.com/videos/banana-bread.mp4',
    embedUrl: 'https://www.youtube.com/embed/abc123',
    uploadDate: '2025-01-15',
    duration: 'PT8M30S',
  },
});
```

---

## Recipe Carousel

Show multiple recipes as a carousel in search results:

```ts
import { createCarousel, createRecipe } from 'schemaorg-kit';

const carousel = createCarousel([
  createRecipe({ name: 'Tiramisu',       image: 'https://example.com/tiramisu.jpg', ... }),
  createRecipe({ name: 'Panna Cotta',    image: 'https://example.com/panna-cotta.jpg', ... }),
  createRecipe({ name: 'Cannoli',        image: 'https://example.com/cannoli.jpg', ... }),
]);
```

---

## Common Mistakes

{: .warning }
> **`image` is required.** Recipes without an image won't be shown as rich results.

{: .tip }
> Use the `PT` prefix for durations. `"30 minutes"` won't work — it must be `"PT30M"`.

{: .tip }
> More specific ingredient quantities and step descriptions improve Google's recipe understanding and may increase recipe appearance in voice search results.
