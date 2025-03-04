/**
 * Pydantic Forms
 *
 * Helper functions to be used in PydanticForms
 */
import { ControllerRenderProps, FieldValues, useForm } from 'react-hook-form';

import defaultComponentMatchers from '@/components/defaultComponentMatchers';
import {
    PydanticComponentMatcher,
    PydanticFormApiResponse,
    PydanticFormComponents,
    PydanticFormField,
    PydanticFormFieldAttributes,
    PydanticFormFieldOption,
    PydanticFormFieldSection,
    PydanticFormFieldType,
    PydanticFormFieldValidations,
    PydanticFormPropertySchemaParsed,
    PydanticFormSchema,
    PydanticFormsContextConfig,
} from '@/types';

/**
 * Error object formatting
 *
 * @param apiErrorResp The JSON Schema from the backend
 * @returns A object better usable for displaying errors
 */
export const getErrorDetailsFromResponse = function (
    apiErrorResp: PydanticFormApiResponse,
) {
    return {
        detail: apiErrorResp.detail ?? '',
        source: apiErrorResp.validation_errors,
        mapped: apiErrorResp.validation_errors.reduce((old, cur) => {
            return {
                ...old,
                [cur.loc[0]]: {
                    value: cur.input,
                    msg: cur.msg,
                },
            };
        }, {}),
    };
};

/**
 * Easy pluk options or format from the anyOf, allOf or oneOf keys
 *
 * @param field A field from the 'properties' key of the JSON Schema
 * @returns anyOf, allOf, or allOf value
 */
export const getFieldAllOfAnyOfEntry = (
    propertySchemaParsed: PydanticFormPropertySchemaParsed,
) => {
    const optionFields = [
        propertySchemaParsed.anyOf,
        propertySchemaParsed.oneOf,
        propertySchemaParsed.allOf,
    ];

    for (const optionsDefs of optionFields) {
        if (!optionsDefs) {
            continue;
        }

        return optionsDefs;
    }
};

/**
 * Field to field options
 *
 * @param propertySchemaParsed A field from the 'properties' key of the JSON Schema
 * @returns an array of options in strings
 */
export const getFieldOptions = (
    propertySchemaParsed: PydanticFormPropertySchemaParsed,
) => {
    let isOptionsField = false;
    const options: PydanticFormFieldOption[] = [];

    const optionDef = getFieldAllOfAnyOfEntry(propertySchemaParsed);

    const propertyEnums =
        propertySchemaParsed.enum ?? propertySchemaParsed.items?.enum;
    const propertyOptions =
        propertySchemaParsed.options ?? propertySchemaParsed.items?.options;

    if (propertyEnums && !propertyOptions) {
        isOptionsField = true;

        options.push(...enumToOption(propertyEnums));
    }

    if (propertyOptions) {
        options.push(...optionsToOption(propertyOptions, propertyEnums));
    }

    const hasEntryWithEnums = optionDef?.filter(
        (option) => !!option.items?.enum || option?.enum,
    );

    if (propertySchemaParsed.items) {
        isOptionsField = true;
    }

    if (!optionDef) {
        return {
            options,
            isOptionsField: false,
        };
    }

    for (const entry of optionDef) {
        if (entry.type === 'null' && hasEntryWithEnums) {
            continue;
        }

        if (entry.items) {
            isOptionsField = true;
        }

        const itemFieldEnums = entry?.enum ?? entry.items?.enum;
        const itemFieldOptions = entry?.options ?? entry.items?.options;

        if (itemFieldEnums && !itemFieldOptions) {
            isOptionsField = true;
            // add all the other options to the options arr
            options.push(...enumToOption(itemFieldEnums));
        }

        if (itemFieldOptions) {
            isOptionsField = true;
            // add all the other options to the options arr
            options.push(...optionsToOption(itemFieldOptions, itemFieldEnums));
        }
    }

    return {
        options,
        isOptionsField,
    };
};

export const enumToOption = (enums: string[]) =>
    enums.map((option: string) => ({
        value: option,
        label: option,
    }));

export const optionsToOption = (
    options: { [id: string]: string },
    enums?: string[],
) =>
    Object.keys(options)
        .map((id: string) => ({
            value: id,
            label: options[id as keyof typeof options],
        }))
        .sort(
            (a, b) =>
                (enums?.indexOf(a.value) ?? 0) - (enums?.indexOf(b.value) ?? 0),
        );

export const getFieldLabelById = (
    fieldId: string,
    formScheam: PydanticFormSchema,
) => {
    return fieldId;
};

/**
 * Field to validation object
 *
 * @param fieldProperties A field from the 'properties' key of the JSON Schema
 * @returns returns a validation object
 */
export const getFieldValidation = (
    fieldProperties: PydanticFormPropertySchemaParsed,
) => {
    const validation: PydanticFormFieldValidations = {};
    const propertyDef = getFieldAllOfAnyOfEntry(fieldProperties);
    const isNullable = propertyDef?.filter((option) => option.type === 'null');

    if (isNullable) {
        validation.isNullable = true;
    }

    for (const properties of [fieldProperties, ...(propertyDef ?? [])]) {
        if (fieldProperties.type === PydanticFormFieldType.STRING) {
            if (properties.maxLength)
                validation.maxLength = properties.maxLength;
            if (properties.minLength)
                validation.minLength = properties.minLength;
            if (properties.pattern) validation.pattern = properties.pattern;
        }
        if (
            fieldProperties.type === PydanticFormFieldType.NUMBER ||
            fieldProperties.type === PydanticFormFieldType.INTEGER
        ) {
            if (properties.minimum) validation.minimum = properties.minimum;
            if (properties.maximum) validation.maximum = properties.maximum;
            if (properties.exclusiveMinimum)
                validation.exclusiveMinimum = properties.exclusiveMinimum;
            if (properties.exclusiveMaximum)
                validation.exclusiveMaximum = properties.exclusiveMaximum;
            if (properties.multipleOf)
                validation.multipleOf = properties.multipleOf;
        }
    }

    return validation;
};

/**
 * Returns if a field should be nullable
 * @param field
 * @returns
 */
export const isNullableField = (field: PydanticFormField) =>
    !!field.validations.isNullable;

/**
 * Sort field per section for displaying
 *
 * This function will organize the fields per section
 * every time a field comes by that starts with label_
 * we start a new section
 */
export const getFieldBySection = (components: PydanticFormComponents) => {
    const sections: PydanticFormFieldSection[] = [];
    let curSection = 0;

    // Ids will be nested at this point. We look at the last part of the id
    for (const component of components) {
        const id = component.pydanticFormField.id.split('.').pop();
        const field = component.pydanticFormField;

        if (id && id.startsWith('label_')) {
            curSection++;
            sections.push({
                id,

                // strange as it is, the backend will put the
                // correct label in the 'default' prop
                title: field.default ?? field.title,

                components: [],
            });

            continue;
        }

        if (curSection === 0) {
            // if we are here there was no first label field,
            // we'll create a label / section to prevent errors

            sections.push({
                id: 'auto-created-section',
                title: '',
                components: [],
            });

            // Make sure new fields are pushed into this section and
            // prevent empty sections created
            curSection = 1;
        }

        // since we start at 0, and the first label will add
        const targetSection = curSection - 1;

        sections[targetSection].components.push(component);
    }

    return sections;
};

/**
 * Will return a Record map of [fieldId]: "Fieldvalue"
 *
 * Requires both fieldsDef (these can have default values)
 * And labelData (this holds the current values from API)
 */
export const getFormValuesFromFieldOrLabels = (
    pydanticFormSchema: PydanticFormSchema,
    labelData?: Record<string, any>,
) => {
    // NOTE: PydanticFormSchema has recursive property ids at this point
    // The data in label data is flat so we need to take care of that

    const fieldValues: Record<string, string> = {};

    /*
    const includedFields: string[] = [];

    for (const field of fields) {
        includedFields.push(field.id);

        if (typeof field.default === 'undefined') {
            continue;
        }

        fieldValues[field.id] = field.default;
    }

    if (labelData) {
        for (const fieldId in labelData) {
            if (labelData[fieldId] && includedFields.includes(fieldId)) {
                fieldValues[fieldId] = labelData[fieldId];
            }
        }
    }
        */

    return fieldValues;
};

/**
 * Finds and returns the attributes in the schemafield
 */
export const getFieldAttributes = function (
    schemaField: PydanticFormPropertySchemaParsed,
) {
    const attributes: PydanticFormFieldAttributes = {};

    // we could do this in a few lines by casting schemafield
    // to the attributes. However, we dont know yet if the
    // data from the Backend will stay the same..

    if (schemaField.uniforms?.disabled) {
        attributes.disabled = true;
    }

    if (schemaField.uniforms?.sensitive) {
        attributes.sensitive = true;
    }

    if (schemaField.uniforms?.password) {
        attributes.password = true;
    }

    return attributes;
};

/**
 * This function can be used as the onValueChange handler in a react hook form form element component.
 * When used, it will trigger the related validations whenever the field changes
 *
 * @param rhf
 * @param field
 * @returns
 */
export const rhfTriggerValidationsOnChange =
    (
        rhf: ReturnType<typeof useForm>,
        field: ControllerRenderProps<FieldValues, string>,
    ) =>
    (value: string) => {
        field.onChange(value);

        // it seems we need this because the 2nd error would get stale..
        // https://github.com/react-hook-form/react-hook-form/issues/8170
        // https://github.com/react-hook-form/react-hook-form/issues/10832
        rhf.trigger(field.name);
    };

export const getMatcher = (
    customComponentMatcher?: PydanticFormsContextConfig['componentMatcher'],
) => {
    const componentMatchers = customComponentMatcher
        ? customComponentMatcher(defaultComponentMatchers)
        : defaultComponentMatchers;

    return (field: PydanticFormField) => {
        return componentMatchers.find(({ matcher }) => {
            return matcher(field);
        });
    };
};
