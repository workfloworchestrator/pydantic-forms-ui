import { useForm } from 'react-hook-form';

import { z } from 'zod';

import defaultComponentMatchers from '@/components/defaultComponentMatchers';
import { TextField } from '@/components/fields';
import type {
    ElementMatch,
    Properties,
    PydanticComponentMatcher,
    PydanticFormComponents,
    PydanticFormField,
    PydanticFormsContextConfig,
} from '@/types';

export const getMatcher = (
    customComponentMatcher: PydanticFormsContextConfig['componentMatcher'],
) => {
    const componentMatchers = customComponentMatcher
        ? customComponentMatcher(defaultComponentMatchers)
        : defaultComponentMatchers;

    return (field: PydanticFormField): PydanticComponentMatcher | undefined => {
        return componentMatchers.find(({ matcher }) => {
            return matcher(field);
        });
    };
};

export const getClientSideValidationRule = (
    field: PydanticFormField,
    rhf?: ReturnType<typeof useForm>,
    customComponentMatcher?: PydanticFormsContextConfig['componentMatcher'],
) => {
    const matcher = getMatcher(customComponentMatcher);

    const componentMatch = matcher(field);

    let validationRule = componentMatch?.validator?.(field, rhf) ?? z.string();

    if (!field.required) {
        validationRule = validationRule.optional();
    }

    if (field.validations.isNullable) {
        validationRule = validationRule.nullable();
    }

    return validationRule;
};

export const componentMatcher = (
    properties: Properties,
    customComponentMatcher: PydanticFormsContextConfig['componentMatcher'],
): PydanticFormComponents => {
    const matcher = getMatcher(customComponentMatcher);

    const components: PydanticFormComponents = Object.entries(properties).map(
        ([, pydanticFormField]) => {
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
        },
    );

    return components;
};
