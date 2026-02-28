---
title: Math Solver
parent: Guides
nav_order: 19
---

# Math Solver Rich Results
{: .no_toc }

Math Solver structured data helps students, teachers, and others discover your math solving tool on Google Search. It enables a [Math Solver](https://developers.google.com/search/docs/appearance/structured-data/math-solvers) rich result that shows the types of math problems your tool can solve.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## When to Use

- Online math solver tools (Wolfram Alpha-style)
- Step-by-step equation solving apps
- Math tutoring platforms with interactive solvers
- Calculator apps with structured solutions

---

## Quick Start

```ts
import { createMathSolver } from 'schemaorg-kit';

const solver = createMathSolver({
  name: 'QuickMath Solver',
  url: 'https://quickmath.example.com',
  usageInfo: 'https://quickmath.example.com/terms',
  potentialAction: {
    '@type': 'SolveMathAction',
    eduQuestionType: ['Polynomial', 'Linear Equation'],
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://quickmath.example.com/solve?q={math_expression_string}',
      actionAccessibilityRequirement: {
        '@type': 'ActionAccessSpecification',
        requiresSubscription: false,
      },
    },
  },
});

document.head.innerHTML += solver.toScript();
```

---

## Google Required Fields

| Field | Description |
|-------|-------------|
| `name` | Name of your math solver |
| `potentialAction` | At least one `SolveMathAction` |
| `usageInfo` | URL to terms of service / usage page |

---

## Supported Math Types

The `eduQuestionType` field on `SolveMathAction` tells Google what kinds of problems your solver handles:

| Value | Description |
|-------|-------------|
| `"Algebra"` | General algebra |
| `"Arithmetic"` | Basic arithmetic |
| `"Calculus"` | Derivatives, integrals |
| `"Geometry"` | Geometric problems |
| `"Linear Equation"` | Linear equations |
| `"Polynomial"` | Polynomial expressions |
| `"Quadratic Equation"` | Quadratic equations |
| `"Statistics"` | Statistical calculations |
| `"Trigonometry"` | Trigonometric functions |

You can specify a single type or an array of types.

---

## Full Example

```ts
import { createMathSolver, SolveMathActionSchema } from 'schemaorg-kit';

const solver = createMathSolver({
  name: 'MathSteps Pro',
  url: 'https://mathsteps.example.com',
  usageInfo: 'https://mathsteps.example.com/terms',
  educationalLevel: 'high school',
  teaches: ['Algebra', 'Calculus', 'Trigonometry'],
  assesses: ['equation solving', 'derivative computation'],
  potentialAction: [
    SolveMathActionSchema.parse({
      eduQuestionType: ['Algebra', 'Linear Equation', 'Quadratic Equation'],
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://mathsteps.example.com/algebra?expr={math_expression_string}',
        actionAccessibilityRequirement: {
          '@type': 'ActionAccessSpecification',
          requiresSubscription: false,
        },
      },
    }),
    SolveMathActionSchema.parse({
      eduQuestionType: 'Calculus',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://mathsteps.example.com/calculus?expr={math_expression_string}',
        actionAccessibilityRequirement: {
          '@type': 'ActionAccessSpecification',
          requiresSubscription: true,
        },
      },
    }),
  ],
});
```

---

## Free vs Paid Solvers

Use `requiresSubscription` in the `ActionAccessSpecification` to indicate whether the solver is free:

```ts
// Free solver
actionAccessibilityRequirement: {
  '@type': 'ActionAccessSpecification',
  requiresSubscription: false,
}

// Paid / subscription solver
actionAccessibilityRequirement: {
  '@type': 'ActionAccessSpecification',
  requiresSubscription: true,
}
```

---

## Best Practices

- **Always include `usageInfo`** — Google requires a terms/usage page URL
- **Use descriptive `eduQuestionType` values** — be specific about what math types you support
- **Include `{math_expression_string}`** in the `urlTemplate` — Google replaces it with the user's query
- **Set `learningResourceType`** — defaults to `"Math Solver"` automatically
- **Add `teaches` and `assesses`** to help Google match your solver to student queries

---

## Common Mistakes

{: .warning }
> **Don't forget `usageInfo`.** Unlike most schema types, Google specifically requires a terms-of-service URL for Math Solver.

{: .tip }
> If your solver handles multiple math types with different URLs, use multiple `SolveMathAction` entries in an array rather than a single action.
