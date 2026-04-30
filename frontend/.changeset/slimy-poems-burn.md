---
'pydantic-forms': major
---

Adds the compiled componentMatcher function to global configuration on app initialization. Custom input components should use that instead of componentMatcherExtender.
Hardcodes zod validation messages in zod rules to avoid a situation where they would be lost in certain situations.
