import { z } from 'zod/v4';

import { jest } from '@jest/globals';

import { zodValidationPresets } from '@/components';
import type {
    ComponentMatcherExtender,
    ParsedProperties,
    Properties,
    PydanticComponentMatcher,
} from '@/types';
import {
    PydanticFormFieldFormat,
    PydanticFormFieldType,
    PydanticFormPropertySchemaParsed,
} from '@/types';

import { getMockPydanticFormField } from '../helper.spec';
import { getZodValidationObject } from './useGetZodSchema';
import { parseProperties } from './usePydanticFormParser';

jest.mock('react-hook-form');

const getParsedPropertyMock = (
    props: Partial<PydanticFormPropertySchemaParsed>,
): PydanticFormPropertySchemaParsed => {
    return {
        type: PydanticFormFieldType.STRING,
        format: PydanticFormFieldFormat.DEFAULT,
        ...props,
    };
};

describe('parseProperties', () => {
    it('returns an empty object when no properties are passed', () => {
        const properties = parseProperties({});
        expect(properties).toEqual({});
    });

    it('transforms parsedProperties in pydanticFormFields', () => {
        const parsedProperties: ParsedProperties = {
            test: getParsedPropertyMock({}),
        };
        const properties = parseProperties(parsedProperties);

        const expectedProperties: Properties = {
            test: getMockPydanticFormField({
                type: PydanticFormFieldType.STRING,
                id: 'test',
                format: PydanticFormFieldFormat.DEFAULT,
                title: 'test',
            }),
        };

        expect(properties).toEqual(expectedProperties);
    });
    it('recursively transform properties of properties.', () => {
        const parsedProperties: ParsedProperties = {
            person: getParsedPropertyMock({
                type: PydanticFormFieldType.OBJECT,
                format: PydanticFormFieldFormat.DEFAULT,
                properties: {
                    name: getParsedPropertyMock({
                        type: PydanticFormFieldType.STRING,
                    }),
                    age: getParsedPropertyMock({
                        type: PydanticFormFieldType.INTEGER,
                    }),
                },
            }),
        };

        const expectedProperties: Properties = {
            person: getMockPydanticFormField({
                type: PydanticFormFieldType.OBJECT,
                format: PydanticFormFieldFormat.DEFAULT,
                id: 'person',
                title: 'person',
                schema: {
                    type: PydanticFormFieldType.OBJECT,
                    format: PydanticFormFieldFormat.DEFAULT,
                    properties: {
                        name: {
                            type: PydanticFormFieldType.STRING,
                            format: PydanticFormFieldFormat.DEFAULT,
                        },
                        age: {
                            type: PydanticFormFieldType.INTEGER,
                            format: PydanticFormFieldFormat.DEFAULT,
                        },
                    },
                },
                properties: {
                    ['name']: getMockPydanticFormField({
                        type: PydanticFormFieldType.STRING,
                        id: 'name',
                        format: PydanticFormFieldFormat.DEFAULT,
                        title: 'name',
                    }),
                    ['age']: getMockPydanticFormField({
                        type: PydanticFormFieldType.INTEGER,
                        id: 'age',
                        format: PydanticFormFieldFormat.DEFAULT,
                        title: 'age',
                        schema: {
                            type: PydanticFormFieldType.INTEGER,
                            format: PydanticFormFieldFormat.DEFAULT,
                        },
                    }),
                },
            }),
        };
        const properties = parseProperties(parsedProperties);
        expect(properties).toEqual(expectedProperties);
    });
});

describe('getZodValidationObject', () => {
    const getMockMatcher = (
        dummyMatchers: PydanticComponentMatcher[] | undefined = undefined,
    ): ComponentMatcherExtender => {
        return () => {
            return (
                (dummyMatchers && dummyMatchers) || [
                    {
                        id: 'mockMatcher',
                        ElementMatch: {
                            Element: () => {
                                return 'Mock Element';
                            },
                            isControlledElement: true,
                        },
                        matcher: () => true,
                    },
                ]
            );
        };
    };

    const basicMatchers: PydanticComponentMatcher[] = [
        {
            id: 'stringMatcher',
            ElementMatch: {
                Element: () => {
                    return 'Mock Element';
                },
                isControlledElement: true,
            },
            validator: zodValidationPresets.string,
            matcher: ({ type }) => type === PydanticFormFieldType.STRING,
        },
        {
            id: 'integerMatcher',
            ElementMatch: {
                Element: () => {
                    return 'Mock Element';
                },
                isControlledElement: true,
            },
            validator: zodValidationPresets.integer,
            matcher: ({ type }) => type === PydanticFormFieldType.INTEGER,
        },
    ];

    const nameField = getMockPydanticFormField({
        type: PydanticFormFieldType.STRING,
        id: 'name',
        required: true,
    });

    const ageField = getMockPydanticFormField({
        type: PydanticFormFieldType.INTEGER,
        id: 'age',
        required: true,
    });

    const personObjectField = getMockPydanticFormField({
        type: PydanticFormFieldType.OBJECT,
        id: 'person',
        required: true,
        properties: {
            name: nameField,
            age: ageField,
        },
    });

    it('Returns undefined when no properties are passed', () => {
        const zodObject = getZodValidationObject({}, getMockMatcher());
        const expectedZodObject = z.any();
        expect(z.toJSONSchema(zodObject)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });

    it('Doesnt return uncontrolled elements but does return controlled elements', () => {
        const matchers: PydanticComponentMatcher[] = [
            {
                id: 'unControlledElementMatcher',
                ElementMatch: {
                    Element: () => {
                        return 'Mock Element';
                    },
                    isControlledElement: false,
                },
                matcher: ({ format }) =>
                    format === PydanticFormFieldFormat.LABEL,
            },
            {
                id: 'controlledElementMatcher',
                ElementMatch: {
                    Element: () => {
                        return 'Mock Element';
                    },
                    isControlledElement: true,
                },
                matcher: ({ type }) => type === PydanticFormFieldType.STRING,
            },
        ];

        const properties: Properties = {
            uncontrolled: getMockPydanticFormField({
                id: 'uncontrolled',
                format: PydanticFormFieldFormat.LABEL,
            }),
            controlled: getMockPydanticFormField({
                id: 'controlled',
                type: PydanticFormFieldType.STRING,
                required: true,
            }),
        };

        const schema = getZodValidationObject(
            properties,
            getMockMatcher(matchers),
        );

        const expectedZodObject = z.object({
            controlled: z.any(),
        });

        expect(z.toJSONSchema(schema)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });

    it('Does returns uncontrolled element when the field contains properties', () => {
        const matchers: PydanticComponentMatcher[] = [
            {
                id: 'unControlledElementMatcher',
                ElementMatch: {
                    Element: () => {
                        return 'Mock Element';
                    },
                    isControlledElement: false,
                },
                matcher: ({ type }) => type === PydanticFormFieldType.OBJECT,
            },
            {
                id: 'controlledElementMatcher',
                ElementMatch: {
                    Element: () => {
                        return 'Mock Element';
                    },
                    isControlledElement: true,
                },
                matcher: ({ type }) => type === PydanticFormFieldType.STRING,
            },
        ];

        const properties: Properties = {
            uncontrolled: getMockPydanticFormField({
                id: 'uncontrolled',
                type: PydanticFormFieldType.OBJECT,
                properties: {
                    name: getMockPydanticFormField({
                        id: 'name',
                        type: PydanticFormFieldType.STRING,
                        required: true,
                    }),
                },
            }),
            uncontrolled2: getMockPydanticFormField({
                id: 'uncontrolled',
                type: PydanticFormFieldType.OBJECT,
            }),
        };

        const schema = getZodValidationObject(
            properties,
            getMockMatcher(matchers),
        );

        const expectedZodObject = z.object({
            uncontrolled: z.object({
                name: z.any(),
            }),
        });

        expect(z.toJSONSchema(schema)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });
    it('Does returns uncontrolled element when the field contains an arrayItem', () => {
        const matchers: PydanticComponentMatcher[] = [
            {
                id: 'unControlledElementMatcher',
                ElementMatch: {
                    Element: () => {
                        return 'Mock Element';
                    },
                    isControlledElement: false,
                },
                matcher: ({ type }) => type === PydanticFormFieldType.ARRAY,
            },
            {
                id: 'controlledElementMatcher',
                ElementMatch: {
                    Element: () => {
                        return 'Mock Element';
                    },
                    isControlledElement: true,
                },
                matcher: ({ type }) => type === PydanticFormFieldType.STRING,
            },
        ];

        const properties: Properties = {
            uncontrolled: getMockPydanticFormField({
                id: 'uncontrolled',
                type: PydanticFormFieldType.ARRAY,
                arrayItem: getMockPydanticFormField({
                    id: 'name',
                    type: PydanticFormFieldType.STRING,
                    required: true, // This is the array item
                }),
            }),
            uncontrolled2: getMockPydanticFormField({
                id: 'uncontrolled2',
                type: PydanticFormFieldType.ARRAY,
            }),
        };

        const schema = getZodValidationObject(
            properties,
            getMockMatcher(matchers),
        );

        const expectedZodObject = z.object({
            uncontrolled: z.array(z.any()),
        });

        expect(z.toJSONSchema(schema)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });

    it('Returns zod object with any() rule for a property that doesnt map to a rule but has required prop', () => {
        const pydanticFormField = getMockPydanticFormField({
            type: PydanticFormFieldType.STRING,
            id: 'test',
            required: true,
        });

        const properties: Properties = {
            test: pydanticFormField,
        };
        const zodObject = getZodValidationObject(properties, getMockMatcher());
        const expectedZodObject = z.object({ test: z.any() });

        expect(z.toJSONSchema(zodObject)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });

    it('Returns zod object with the rule the field maps to', () => {
        const pydanticFormStringField = getMockPydanticFormField({
            type: PydanticFormFieldType.STRING,
            id: 'string',
            required: true,
        });

        const pydanticFormIntegerField = getMockPydanticFormField({
            type: PydanticFormFieldType.INTEGER,
            id: 'integer',
            required: true,
        });

        const mockMatcher = getMockMatcher(basicMatchers);

        const properties: Properties = {
            string: pydanticFormStringField,
            integer: pydanticFormIntegerField,
        };
        const zodObject = getZodValidationObject(properties, mockMatcher);
        const expectedZodObject = z.object({
            string: z.string(),
            integer: z.number().int(),
        });

        expect(z.toJSONSchema(zodObject)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });

    it('Returns zod object with zod object with all properties for an object field type', () => {
        const mockMatcher = getMockMatcher(basicMatchers);

        const properties: Properties = {
            person: personObjectField,
        };
        const zodObject = getZodValidationObject(properties, mockMatcher);
        const expectedZodObject = z.object({
            person: z.object({
                name: z.string(),
                age: z.number().int(),
            }),
        });

        expect(z.toJSONSchema(zodObject)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });

    it('Works for nested objects', () => {
        const locationField = getMockPydanticFormField({
            type: PydanticFormFieldType.STRING,
            id: 'location',
            required: true,
        });

        const nameField = getMockPydanticFormField({
            type: PydanticFormFieldType.STRING,
            id: 'name',
            required: true,
        });

        const schoolObjectField = getMockPydanticFormField({
            type: PydanticFormFieldType.OBJECT,
            id: 'school',
            required: true,
            properties: {
                name: nameField,
                location: locationField,
            },
        });

        const degreeField = getMockPydanticFormField({
            type: PydanticFormFieldType.STRING,
            id: 'degree',
            required: true,
        });

        const yearField = getMockPydanticFormField({
            type: PydanticFormFieldType.INTEGER,
            id: 'year',
        });

        const eductionObjectField = getMockPydanticFormField({
            type: PydanticFormFieldType.OBJECT,
            id: 'education',
            required: true,
            properties: {
                degree: degreeField,
                year: yearField,
                school: schoolObjectField,
            },
        });

        const ageField = getMockPydanticFormField({
            type: PydanticFormFieldType.INTEGER,
            id: 'age',
            required: true,
        });

        const personObjectField = getMockPydanticFormField({
            type: PydanticFormFieldType.OBJECT,
            id: 'person',
            properties: {
                name: nameField,
                age: ageField,
                education: eductionObjectField,
            },
        });

        const mockMatcher = getMockMatcher(basicMatchers);

        const properties: Properties = {
            person: personObjectField,
        };

        const zodObject = getZodValidationObject(properties, mockMatcher);
        const expectedZodObject = z.object({
            person: z.object({
                name: z.string(),
                age: z.number().int(),
                education: z.object({
                    degree: z.string(),
                    year: z.number().int().optional(),
                    school: z.object({
                        name: z.string(),
                        location: z.string(),
                    }),
                }),
            }),
        });

        expect(z.toJSONSchema(zodObject)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });

    it('Works for array fields', () => {
        const nameField = getMockPydanticFormField({
            type: PydanticFormFieldType.STRING,
            id: 'name',
            required: true,
        });
        const personsArrayField = getMockPydanticFormField({
            type: PydanticFormFieldType.ARRAY,
            id: 'persons',
            required: true,
            arrayItem: nameField,
        });

        const properties: Properties = {
            persons: personsArrayField,
        };
        const mockMatcher = getMockMatcher(basicMatchers);
        const zodObject = getZodValidationObject(properties, mockMatcher);

        const expectedZodObject = z.object({
            persons: z.array(z.string()),
        });

        expect(z.toJSONSchema(zodObject)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });

    it('Works for array of object fields', () => {
        const nameField = getMockPydanticFormField({
            type: PydanticFormFieldType.STRING,
            id: 'name',
            required: true,
        });
        const ageField = getMockPydanticFormField({
            type: PydanticFormFieldType.INTEGER,
            id: 'age',
            required: true,
        });
        const personObjectField = getMockPydanticFormField({
            type: PydanticFormFieldType.OBJECT,
            id: 'person',
            required: true,
            properties: {
                name: nameField,
                age: ageField,
            },
        });
        const personsArrayField = getMockPydanticFormField({
            type: PydanticFormFieldType.ARRAY,
            id: 'persons',
            required: true,
            arrayItem: personObjectField,
        });

        const properties: Properties = {
            persons: personsArrayField,
        };
        const mockMatcher = getMockMatcher(basicMatchers);
        const zodObject = getZodValidationObject(properties, mockMatcher);

        const expectedZodObject = z.object({
            persons: z.array(
                z.object({
                    name: z.string(),
                    age: z.number().int(),
                }),
            ),
        });

        expect(z.toJSONSchema(zodObject)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });

    it('Works for array of array of array', () => {
        const nameField = getMockPydanticFormField({
            type: PydanticFormFieldType.STRING,
            id: 'name',
            required: true,
        });
        const personsArrayField = getMockPydanticFormField({
            type: PydanticFormFieldType.ARRAY,
            id: 'personsArrayField',
            required: true,
            arrayItem: nameField,
        });
        const personsArrayArrayField = getMockPydanticFormField({
            type: PydanticFormFieldType.ARRAY,
            id: 'personsArrayArrayField',
            required: true,
            arrayItem: personsArrayField,
        });
        const personsArrayArrayArrayField = getMockPydanticFormField({
            type: PydanticFormFieldType.ARRAY,
            id: 'personsArrayArrayArrayField',
            required: true,
            arrayItem: personsArrayArrayField,
        });

        const properties: Properties = {
            persons: personsArrayArrayArrayField,
        };
        const mockMatcher = getMockMatcher(basicMatchers);
        const zodObject = getZodValidationObject(properties, mockMatcher);

        const expectedZodObject = z.object({
            personsArrayArrayArrayField: z.array(z.array(z.array(z.string()))),
        });

        expect(z.toJSONSchema(zodObject)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });

    it('Works for objects that have array properties', () => {
        const nameField = getMockPydanticFormField({
            type: PydanticFormFieldType.STRING,
            id: 'name',
            required: true,
        });
        const languageSpokenField = getMockPydanticFormField({
            type: PydanticFormFieldType.ARRAY,
            id: 'languageSpoken',
            required: true,
            arrayItem: nameField,
        });

        const personObjectField = getMockPydanticFormField({
            type: PydanticFormFieldType.OBJECT,
            id: 'person',
            required: true,
            properties: {
                name: nameField,
                languageSpoken: languageSpokenField,
            },
        });

        const properties: Properties = {
            test: nameField,
            person: personObjectField,
        };
        const mockMatcher = getMockMatcher(basicMatchers);
        const zodObject = getZodValidationObject(properties, mockMatcher);

        const expectedZodObject = z.object({
            name: z.string(),
            person: z.object({
                name: z.string(),
                languageSpoken: z.array(z.string()),
            }),
        });

        expect(z.toJSONSchema(zodObject)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });

    it('Works for arrays of objects that have array properties', () => {
        const nameField = getMockPydanticFormField({
            type: PydanticFormFieldType.STRING,
            id: 'name',
            required: true,
        });
        const languageSpokenField = getMockPydanticFormField({
            type: PydanticFormFieldType.ARRAY,
            id: 'languageSpoken',
            arrayItem: nameField,
            required: true,
        });

        const personObjectField = getMockPydanticFormField({
            type: PydanticFormFieldType.OBJECT,
            id: 'person',
            required: true,
            properties: {
                name: nameField,
                languageSpoken: languageSpokenField,
            },
        });

        const personsArrayField = getMockPydanticFormField({
            type: PydanticFormFieldType.ARRAY,
            id: 'persons',
            required: true,
            arrayItem: personObjectField,
        });

        const properties: Properties = {
            test: nameField,
            person: personsArrayField,
        };
        const mockMatcher = getMockMatcher(basicMatchers);
        const zodObject = getZodValidationObject(properties, mockMatcher);

        const expectedZodObject = z.object({
            name: z.string(),
            persons: z.array(
                z.object({
                    name: z.string(),
                    languageSpoken: z.array(z.string()),
                }),
            ),
        });

        expect(z.toJSONSchema(zodObject)).toEqual(
            z.toJSONSchema(expectedZodObject),
        );
    });
});
