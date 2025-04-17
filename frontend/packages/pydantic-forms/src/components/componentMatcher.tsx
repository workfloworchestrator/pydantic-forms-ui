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
    field: PydanticFormField | undefined,
    rhf?: ReturnType<typeof useForm>,
    customComponentMatcher?: PydanticFormsContextConfig['componentMatcher'],
) => {
    if (!field) return z.unknown();
    const matcher = getMatcher(customComponentMatcher);

    const componentMatch = matcher(field);

    let validationRule = componentMatch?.validator?.(field, rhf) ?? z.unknown();

    if (!field.required) {
        validationRule = validationRule.optional();
    }

    if (field.validations.isNullable) {
        validationRule = validationRule.nullable();
    }

    return validationRule;
};

export const componentsMatcher = (
    properties: Properties,
    customComponentMatcher: PydanticFormsContextConfig['componentMatcher'],
): PydanticFormComponents => {
    const components: PydanticFormComponents = Object.entries(properties).map(
        ([, pydanticFormField]) => {
            return fieldToComponentMatcher(
                pydanticFormField,
                customComponentMatcher,
            );
        },
    );

    return components;
};

export const fieldToComponentMatcher = (
    pydanticFormField: PydanticFormField,
    customComponentMatcher: PydanticFormsContextConfig['componentMatcher'],
) => {
    const matcher = getMatcher(customComponentMatcher);
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
};
