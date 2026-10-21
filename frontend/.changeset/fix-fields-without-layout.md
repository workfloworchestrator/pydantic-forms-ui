---
"pydantic-forms": patch
---

Fix fields without a `layout` being wrapped in the CSS grid. The layout grid is now only rendered when a field has a layout; fields without one are rendered directly in the parent again, as they were before the layout feature.
