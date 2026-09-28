---
"pydantic-forms": minor
---

Read footer button settings from the form page's `meta__.customButtons` (returned as `meta.customButtons` in the API response). When a page has no `customButtons`, the footer falls back to `buttons` from the label provider data, as before.

Adds the `FormMeta` type for the API response `meta` field. `FormHasNext` is kept as a deprecated alias of `FormMeta`.
