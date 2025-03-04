import { TextField } from '@/components/fields';
import { getMatchers } from '@/core/helper';
import type {
    ElementMatch,
    PydanticFormComponents,
    PydanticFormField,
    PydanticFormSchema,
    PydanticFormsContextConfig,
} from '@/types';

const getComponentsFromProperties = (
    properties: {
        [propId: string]: PydanticFormField;
    },
    matcher: (field: PydanticFormField) => ElementMatch,
): PydanticFormComponents => {
    const components: PydanticFormComponents = Object.entries(properties).map(
        ([, pydanticFormField]) => ({
            Element: matcher(pydanticFormField),
            pydanticFormField: pydanticFormField,
        }),
    );

    return components;
};

export const getComponentMatcher = (
    customComponentMatcher: PydanticFormsContextConfig['componentMatcher'],
) => {
    const matchers = getMatchers(customComponentMatcher);

    const matcher = (field: PydanticFormField): ElementMatch => {
        const matchedComponent = matchers.find(({ matcher }) => {
            return matcher(field);
        });

        if (matchedComponent) return matchedComponent.ElementMatch;

        // Defaults to textField when there are no matches
        return {
            Element: TextField,
            isControlledElement: true,
        };
    };

    const componentMatcher = (
        pydanticFormSchema: PydanticFormSchema,
    ): PydanticFormComponents => {
        const components = getComponentsFromProperties(
            pydanticFormSchema.properties,
            matcher,
        );
        return components;
    };

    return componentMatcher;
};
