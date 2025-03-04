import { TextField } from '@/components/fields';
import { getMatcher } from '@/core/helper';
import type {
    ElementMatch,
    PydanticFormComponents,
    PydanticFormSchema,
    PydanticFormsContextConfig,
} from '@/types';

export const componentMatcher = (
    pydanticFormSchema: PydanticFormSchema,
    customComponentMatcher: PydanticFormsContextConfig['componentMatcher'],
): PydanticFormComponents => {
    const matcher = getMatcher(customComponentMatcher);

    const components: PydanticFormComponents = Object.entries(
        pydanticFormSchema.properties,
    ).map(([, pydanticFormField]) => {
        const matchedComponent = matcher(pydanticFormField);

        const ElementMatch: ElementMatch = matchedComponent
            ? matchedComponent.ElementMatch
            : {
                  Element: TextField,
                  isControlledElement: true,
              };

        // Defaults to textField when there are no matches
        return {
            Element: ElementMatch,
            pydanticFormField: pydanticFormField,
        };
    });

    return components;
};
