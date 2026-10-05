---
"pydantic-forms": minor
---

Adds the `legacyNullHandling` config option. When set to `true` the form restores the pre-4.0 default value behaviour: nullable fields without a default are not seeded with `null` and `null` schema defaults are ignored, so untouched optional fields are omitted from the submitted payload instead of being sent as an explicit `null`. Defaults to `false`.
