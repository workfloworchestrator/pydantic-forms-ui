---
'pydantic-forms': major
---

- Nullable fields without a default value are now seeded with `null` in the form's default values. As a result every property in the schema is submitted on each request; previously, optional fields that were never set were omitted from the payload.
- Boolean fields are now rendered by the new `BooleanField` (radio buttons for true / false, plus an "unset" option for nullable fields) instead of `CheckboxField`. `CheckboxField` is still exported and can be re-enabled via `componentMatcherExtender`.
- The default component matcher for booleans is renamed from `checkbox` to `boolean`. Update any `componentMatcherExtender` logic that references the matcher by id.
- Required fields now fail client-side validation when they have no value, instead of relying on the backend to reject them.
