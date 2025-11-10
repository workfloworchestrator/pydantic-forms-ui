# pydantic-forms

## 0.10.0

### Minor Changes

-   26fdf66: Fix validation error not resetting when form field has change

## 0.9.8

### Patch Changes

-   5049979: Adds README stub
-   5049979: Fixes README typos

## 0.9.7

### Patch Changes

-   e3007fc: Adds README stub

## 0.9.6

### Patch Changes

-   b6776d0: Trigger a deployment as a trusted publisher

## 0.9.5

### Patch Changes

-   fd5b1d6: Trigger a deployment as a trusted publisher

## 0.9.5

### Patch Changes

-   b6090cf: Trigger a deployment as a trusted publisher

## 0.9.5

### Patch Changes

-   d463ef3: Trigger a deployment as a trusted publisher

## 0.9.7

### Patch Changes

-   da6bd7d: Trigger a deployment as a trusted publisher

## 0.9.6

### Patch Changes

-   9b2d51b: Trigger a deployment as a trusted publisher

## 0.9.5

### Patch Changes

-   2ae2610: Publish to npm using trusted publisher

## 0.9.4

### Patch Changes

-   faf543b: Fixes triggering onSuccess twice

## 0.9.3

### Patch Changes

-   6997d21: Fixes form caching bug

## 0.9.2

### Patch Changes

-   46330d4: Fixes resetting formdata with forms that have no properties

## 0.9.1

### Patch Changes

-   90721b8: Sets locale for zod validation messages

## 0.9.0

### Minor Changes

-   34bfe49: Refactors component and contextprovider setup

### Patch Changes

-   7a107cf: Improves handling 500 api errors

## 0.8.1

### Patch Changes

-   1bfc84a: Resets errorDetails when switching forms

## 0.8.0

### Minor Changes

-   e44cf7b: Cleans up unused code.

## 0.7.4

### Patch Changes

-   7fec930: Refactors rhf const to reactHookForm for better readability
-   b87af55: Adds fieldData storage

## 0.7.3

### Patch Changes

-   f71cd2d: Adds default value for required array fields. Disables descendants of disabled fields

## 0.7.2

### Patch Changes

-   d544fbe: Fixes restoring and submitting forms

## 0.7.1

### Patch Changes

-   e70319b: Fix restoring values after an error

## 0.7.0

### Minor Changes

-   7bcb18e: Removes some unused functionality. Introduces shouldRegister=true to react-hook-form creation.

## 0.6.11

### Patch Changes

-   5888345: Fixes resetting form data

## 0.6.10

### Patch Changes

-   5207ff1: Calls reset without argument instead of empty object

## 0.6.9

### Patch Changes

-   1acbbb6: Removes double function call

## 0.6.8

### Patch Changes

-   94d7623: Removes custom translations and fallsback to standard translations provided by zod

## 0.6.7

### Patch Changes

-   fecf9f1: Resets form if formKey changes

## 0.6.6

### Patch Changes

-   cbe2019: Fix error where resetForm is called to often clearing initialData in some cases

## 0.6.5

### Patch Changes

-   6202fd8: Removes form reset after render to avoid losing values on errors

## 0.6.4

### Patch Changes

-   4b54738: Adds util for watching fields
-   569bcdf: Resets the form with initial data in useEffect after render

## 0.6.3

### Patch Changes

-   cda50fe: Fixes getting default values

## 0.6.2

### Patch Changes

-   82d0a5a: Improves schema combinators anyOf, allOf and oneOf parsing
-   32428b1: Add schemaField const to set disabled attribute

## 0.6.1

### Patch Changes

-   0164485: Updates zod dependencies to avoid collisions

## 0.6.0

### Minor Changes

-   a06e777: Fixes history navigation. Fixes array item validations and rendering.

## 0.5.3

### Patch Changes

-   8112444: Improves context check in hook to avoid false negatives

## 0.5.2

### Patch Changes

-   ce409ce: Fixes formInput values reference bug

## 0.5.1

### Patch Changes

-   dad865d: Fixes title and description on array items

## 0.5.0

### Minor Changes

-   8cf1046: Rename componentMatcher to componentMatcherExtender

## 0.4.1

### Patch Changes

-   86d702c: Triggers form validation on default values

## 0.4.0

### Minor Changes

-   42c007a: Set width to 100% for RenderFields, add resetErrorDetails

## 0.3.6

### Patch Changes

-   282f974: When calling getFormFieldValue defaults to own value if no fielName is passed

## 0.3.5

### Patch Changes

-   3983ace: Fixes getFormFieldValue to handle arrayItem fields better

## 0.3.4

### Patch Changes

-   0415932: Adds getFormFieldValue function

## 0.3.3

### Patch Changes

-   b486bad: Exposes fieldToComponents function

## 0.3.2

### Patch Changes

-   115232d: Expands configurable header component to include title. Aligns render components.

## 0.3.1

### Patch Changes

-   1101ac0: Fixes data reset bug

## 0.3.0

### Minor Changes

-   2cd70d8: Adds hasNext property for multistep forms

### Patch Changes

-   4b473f9: Exports components from components/render folder

## 0.2.3

### Patch Changes

-   4c6c076: Prevents uncontrolled elements from being added to formstate

## 0.2.2

### Patch Changes

-   15e40bd: Exports util functions and RenderFields component. Bugfixes
-   5505ea2: Show minus button in ArrayField even if min_items value is not provided.

## 0.2.1

### Patch Changes

-   b3374b5: Exports zodPresets

## 0.2.0

### Minor Changes

-   dadbdb8: Fixes label fields by removing section logic

## 0.1.6

### Patch Changes

-   1d7f1c3: Resolves warning that refs cant be passed to function components
-   53a77aa: Small README update

## 0.1.5

### Patch Changes

-   af0069e: Removes default styling

## 0.1.4

### Patch Changes

-   cf0da35: Exports component matcher type

## 0.1.3

### Patch Changes

-   0039c7f: Downgrades next-intl to version 3.x

## 0.1.2

### Patch Changes

-   46b7fdb: Bugfix

## 0.1.1

### Patch Changes

-   abdd8fb: Fixes array field value error

## 0.1.0

### Minor Changes

-   29ffb3f: Adds array field

## 0.0.20

### Patch Changes

-   88d5a7f: Adds translations for general text

## 0.0.19

### Patch Changes

-   7b6a1fc: 1682 - Back button implementation. Caching steps when browsing between previous and next pages

## 0.0.18

### Patch Changes

-   d2f0839: Disables using previous form definition while new one is loading

## 0.0.17

### Patch Changes

-   487a561: Refetches form definiton everytime the form is loaded

## 0.0.16

### Patch Changes

-   111007d: Adds better way to reset after form submission

## 0.0.15

### Patch Changes

-   9dc37c0: Adds option to clear form after submission

## 0.0.14

### Patch Changes

-   9b0d4a3: Hides form title if it's "unknown"

## 0.0.13

### Patch Changes

-   839fb76: Fixes form labels
-   6878fbe: Makes rowRenderer configurable

## 0.0.12

### Patch Changes

-   0cf5269: Adds passable footer renderer

## 0.0.11

### Patch Changes

-   a860f16: Loosens next peer dependency

## 0.0.10

### Patch Changes

-   11c742b: Updates dependencies to latest minor versions

## 0.0.9

### Patch Changes

-   bd671f1: Updates react peer dependencies

## 0.0.8

### Patch Changes

-   844c11b: Adds object field

## 0.0.7

### Patch Changes

-   65fd200: Readds multistep forms

## 0.0.6

### Patch Changes

-   db80d93: Finishes renaming

## 0.0.5

### Patch Changes

-   2d4fce5: Triggers npm publish test

## 0.0.4

### Patch Changes

-   1251d9c: Initial publish trigger
