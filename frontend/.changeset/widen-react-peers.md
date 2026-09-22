---
"pydantic-forms": minor
---

Widen `react` and `react-dom` peer dependencies to `^18.2.0 || ^19.0.0`, and drop the `next` peer dependency.

The package never imports `next` directly -- it was only listed because `next-intl` requires it. Consumers on Next.js are unaffected (`next-intl` still declares its own `next` peer), and the package now installs cleanly in non-Next React projects.
