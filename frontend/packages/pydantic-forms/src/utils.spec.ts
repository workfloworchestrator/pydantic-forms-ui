import type { FieldValues } from 'react-hook-form';

import type { PydanticFormField } from './types';
import { PydanticFormFieldFormat, PydanticFormFieldType } from './types';
import {
    getFormFieldValue,
    insertItemAtIndex,
    itemizeArrayItem,
} from './utils';

export const getPydanticFormFieldDummy = (
    props: Partial<PydanticFormField>,
): PydanticFormField => {
    return {
        id: 'dummy',
        type: PydanticFormFieldType.STRING,
        format: PydanticFormFieldFormat.LONG,
        title: 'Dummy Field',
        default: undefined,
        description: undefined,
        arrayItem: undefined,
        properties: {},
        required: false,
        options: [],
        columns: 6,
        schema: {
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
        },
        validations: {},
        attributes: {},
        ...props,
    };
};

describe('insertItemAtIndex', () => {
    const fieldA = getPydanticFormFieldDummy({ id: 'a' });
    const fieldB = getPydanticFormFieldDummy({ id: 'b' });
    const fieldC = getPydanticFormFieldDummy({ id: 'c' });
    const newField = getPydanticFormFieldDummy({ id: 'new' });

    it('inserts at the beginning when anchorIndex is 0', () => {
        const result = insertItemAtIndex([fieldA, fieldB], newField, 0);
        expect(result).toEqual([newField, fieldA, fieldB]);
    });

    it('inserts at the end when anchorIndex is equal to array length', () => {
        const result = insertItemAtIndex([fieldA, fieldB], newField, 2);
        expect(result).toEqual([fieldA, fieldB, newField]);
    });

    it('inserts in the middle', () => {
        const result = insertItemAtIndex([fieldA, fieldB, fieldC], newField, 1);
        expect(result).toEqual([fieldA, newField, fieldB, fieldC]);
    });

    it('inserts into an empty array', () => {
        const result = insertItemAtIndex([], newField, 0);
        expect(result).toEqual([newField]);
    });

    it('does not mutate the original array', () => {
        const fields = [fieldA, fieldB];
        const copy = [...fields];
        insertItemAtIndex(fields, newField, 1);
        expect(fields).toEqual(copy);
    });
});

describe('getFormFieldValue', () => {
    const formValues: FieldValues = {
        name: 'John Doe',
        age: 30,
        isActive: true,
    };
    it('gets the value by fieldName', () => {
        const field = getPydanticFormFieldDummy({ id: 'name' });
        const fieldName = 'name';
        const value = getFormFieldValue(formValues, field, fieldName);
        expect(value).toBe('John Doe');
    });

    it('returns undefined for unknown fields', () => {
        const field = getPydanticFormFieldDummy({ id: 'name' });
        const fieldName = 'UNKNOWN_FIELD';
        const value = getFormFieldValue(formValues, field, fieldName);
        expect(value).toBe(undefined);
    });

    it('gets the value at the right level from an array of objects', () => {
        const complexValues = {
            company: {
                name: 'John Deer',
                age: 30,
                contactPersons: [
                    {
                        name: 'Jane Smith',
                        age: 25,
                        licenses: ['A', 'B'],
                    },
                    {
                        name: 'Alice Johnson',
                        age: 28,
                        licenses: ['C'],
                    },
                ],
            },
        };

        const field = getPydanticFormFieldDummy({
            id: 'company.contactPersons.0.name',
        });
        const value = getFormFieldValue(complexValues, field, 'age');
        expect(value).toEqual(25);

        const field2 = getPydanticFormFieldDummy({
            id: 'company.contactPersons.1.name',
        });

        const value2 = getFormFieldValue(complexValues, field2, 'licenses');
        expect(value2).toEqual(['C']);
    });

    it('gets the value at the right level from an array item', () => {
        const complexValues = {
            company: {
                name: 'John Deer',
                age: 30,
                contactIds: ['123', '456'],
            },
            age: 666,
        };

        const firstListElementField = getPydanticFormFieldDummy({
            id: 'company.contactIds.0',
        });
        const valueFromFirstListElement = getFormFieldValue(
            complexValues,
            firstListElementField,
            'age',
        );
        expect(valueFromFirstListElement).toEqual(30);

        const secondListElementField = getPydanticFormFieldDummy({
            id: 'company.contactIds.1',
        });
        const valueFromSecondListElement = getFormFieldValue(
            complexValues,
            secondListElementField,
            'age',
        );
        expect(valueFromSecondListElement).toEqual(30);

        const nameElementField = getPydanticFormFieldDummy({
            id: 'company.name',
        });
        const valueFromNameElement = getFormFieldValue(
            complexValues,
            nameElementField,
            'age',
        );
        expect(valueFromNameElement).toEqual(30);

        const contactIdsElementField = getPydanticFormFieldDummy({
            id: 'company.contactIds',
        });
        const ownValue = getFormFieldValue(
            complexValues,
            contactIdsElementField,
            'contactIds',
        );
        expect(ownValue).toEqual(['123', '456']);
    });

    it('gets its own value based on the pydanticform definition if no fieldName is provided', () => {
        const complexValues = {
            company: {
                name: 'John Deer',
                age: 30,
                contactIds: ['123', '456'],
            },
            age: 666,
        };

        const companyField = getPydanticFormFieldDummy({
            id: 'company',
        });
        const valueFromCompanyElement = getFormFieldValue(
            complexValues,
            companyField,
        );
        expect(valueFromCompanyElement).toEqual({
            name: 'John Deer',
            age: 30,
            contactIds: ['123', '456'],
        });

        const secondListElementField = getPydanticFormFieldDummy({
            id: 'company.contactIds.1',
        });

        const valueFromSecondListElement = getFormFieldValue(
            complexValues,
            secondListElementField,
        );

        expect(valueFromSecondListElement).toEqual(['123', '456']);

        const firstListElementField = getPydanticFormFieldDummy({
            id: 'company.contactIds.0',
        });

        const valueFromListElement = getFormFieldValue(
            complexValues,
            firstListElementField,
        );

        expect(valueFromListElement).toEqual(['123', '456']);
    });
});

describe('itemizeArrayItem', () => {
    // Postfixes .{index} to PydanticFormField id
    // When the item being itemized is an object field adds .{index} at correct position in to ids of all properties
    // It will itemize only one level. Lower levels will be itemized when the item is rendered and the path from the parent
    // is passed in again making the id unique for that level

    const stringField = getPydanticFormFieldDummy({
        id: 'stringField',
        type: PydanticFormFieldType.STRING,
    });

    const objectField = getPydanticFormFieldDummy({
        id: 'objectField',
        properties: {
            prop1: getPydanticFormFieldDummy({
                id: 'prop1',
                type: PydanticFormFieldType.STRING,
            }),
            prop2: getPydanticFormFieldDummy({
                id: 'prop2',
                type: PydanticFormFieldType.STRING,
            }),
        },
    });

    const arrayFieldWithArrayFieldArrayItem = getPydanticFormFieldDummy({
        id: 'arrayFieldWithArrayArrayItem',
        type: PydanticFormFieldType.ARRAY,
        arrayItem: getPydanticFormFieldDummy({
            id: 'arrayItemArrayField',
            type: PydanticFormFieldType.ARRAY,
            arrayItem: getPydanticFormFieldDummy({
                id: 'arrayItemArrayField',
                type: PydanticFormFieldType.ARRAY,
                arrayItem: stringField,
            }),
        }),
    });

    it('Appends the passed index to the id', () => {
        // If the field is an arrayItem it should return the field with the index added to the end of its id
        expect(itemizeArrayItem(1, stringField, 'PATH')).toEqual({
            ...stringField,
            id: 'PATH.1',
        });
    });

    it('Appends the passed index to the id foreach array item', () => {
        [1, 2, 3].forEach((index) => {
            expect(itemizeArrayItem(index, stringField, 'PATH')).toEqual({
                ...stringField,
                id: `PATH.${index}`,
            });
        });
    });

    it('Prepends the passed index to the ids of properties of an object field', () => {
        const expectedId = 'PATH.1';

        expect(itemizeArrayItem(1, objectField, 'PATH')).toEqual({
            ...objectField,
            id: expectedId,
            properties: {
                prop1: {
                    ...objectField.properties?.prop1,
                    id: `${expectedId}.${objectField.properties?.prop1.id}`,
                },
                prop2: {
                    ...objectField.properties?.prop2,
                    id: `${expectedId}.${objectField.properties?.prop2.id}`,
                },
            },
        });
    });

    it('Prepends id and itemizes subitem correctly with given the parents id as starting path', () => {
        const expectedId = 'PATH.1';

        // Should keep id and arrayItem id the same
        const itemizedItem = itemizeArrayItem(
            1,
            arrayFieldWithArrayFieldArrayItem,
            'PATH',
        );
        expect(itemizedItem).toEqual({
            ...arrayFieldWithArrayFieldArrayItem,
            id: expectedId,
        });

        if (itemizedItem.arrayItem) {
            const subItem = itemizedItem.arrayItem;
            const itemizedSubItem = itemizeArrayItem(
                4,
                subItem,
                itemizedItem.id,
            );
            expect(itemizedSubItem).toEqual({
                ...subItem,
                id: 'PATH.1.4',
            });
        }
    });

    it('Works with an arrayItem thats an object field that has an arrayItem that is an object field', () => {
        const objectWithArrayWithObjectWithArrayItem =
            getPydanticFormFieldDummy({
                id: 'object',
                type: PydanticFormFieldType.OBJECT,
                properties: {
                    level1prop1: stringField,
                    level1prop2: getPydanticFormFieldDummy({
                        id: 'arrayField',
                        type: PydanticFormFieldType.ARRAY,
                        arrayItem: getPydanticFormFieldDummy({
                            id: 'arrayItem',
                            type: PydanticFormFieldType.OBJECT,
                            properties: {
                                level2prop1: {
                                    ...stringField,
                                    id: 'level2prop1StringField',
                                },
                                level2prop2: {
                                    ...stringField,
                                    id: 'level2prop2StringField',
                                },
                            },
                        }),
                    }),
                },
            });
        const itemizedItem = itemizeArrayItem(
            5,
            objectWithArrayWithObjectWithArrayItem,
            'PATH',
        );

        const expectedItemizedItem = {
            ...objectWithArrayWithObjectWithArrayItem,
            id: 'PATH.5',
            properties: {
                level1prop1: {
                    ...objectWithArrayWithObjectWithArrayItem.properties
                        ?.level1prop1,
                    id: 'PATH.5.stringField',
                },
                level1prop2: {
                    ...objectWithArrayWithObjectWithArrayItem.properties
                        ?.level1prop2,
                    id: 'PATH.5.arrayField',
                },
            },
        };

        expect(expectedItemizedItem).toEqual(itemizedItem);

        const subItem = itemizedItem.properties?.level1prop2;

        if (subItem?.arrayItem) {
            const itemizedSubItem = itemizeArrayItem(
                3,
                subItem.arrayItem,
                subItem?.id || '',
            );

            const expectedSubItem = {
                ...subItem.arrayItem,
                id: 'PATH.5.arrayField.3',
                properties: {
                    level2prop1: {
                        ...subItem.arrayItem?.properties?.level2prop1,
                        id: 'PATH.5.arrayField.3.level2prop1StringField',
                    },
                    level2prop2: {
                        ...subItem.arrayItem?.properties?.level2prop2,
                        id: 'PATH.5.arrayField.3.level2prop2StringField',
                    },
                },
            };
            expect(expectedSubItem).toEqual(itemizedSubItem);
        }
    });
});
