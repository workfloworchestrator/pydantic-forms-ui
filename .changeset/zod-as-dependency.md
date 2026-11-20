---
"pydantic-forms": patch
---

Installs `zod` as a regular dependency instead of a peer dependency, so `npm install pydantic-forms` no longer fails with `ERESOLVE` when Zod is not installed yet
