import type { FieldValues } from 'react-hook-form';

import { getMockPydanticFormField } from './core/helper.spec';
import { PydanticFormFieldType } from './types';
import {
    disableField,
    getFormFieldIdWithPath,
    getFormFieldValue,
    insertItemAtIndex,
    itemizeArrayItem,
    toOptionalObjectProperty,
} from './utils';

describe('insertItemAtIndex', () => {
    const fieldA = getMockPydanticFormField({ id: 'a' });
    const fieldB = getMockPydanticFormField({ id: 'b' });
    const fieldC = getMockPydanticFormField({ id: 'c' });
    const newField = getMockPydanticFormField({ id: 'new' });

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
        const field = getMockPydanticFormField({ id: 'name' });
        const fieldName = 'name';
        const value = getFormFieldValue(formValues, field, fieldName);
        expect(value).toBe('John Doe');
    });

    it('returns undefined for unknown fields', () => {
        const field = getMockPydanticFormField({ id: 'name' });
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

        const field = getMockPydanticFormField({
            id: 'company.contactPersons.0.name',
        });
        const value = getFormFieldValue(complexValues, field, 'age');
        expect(value).toEqual(25);

        const field2 = getMockPydanticFormField({
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

        const firstListElementField = getMockPydanticFormField({
            id: 'company.contactIds.0',
        });
        const valueFromFirstListElement = getFormFieldValue(
            complexValues,
            firstListElementField,
            'age',
        );
        expect(valueFromFirstListElement).toEqual(30);

        const secondListElementField = getMockPydanticFormField({
            id: 'company.contactIds.1',
        });
        const valueFromSecondListElement = getFormFieldValue(
            complexValues,
            secondListElementField,
            'age',
        );
        expect(valueFromSecondListElement).toEqual(30);

        const nameElementField = getMockPydanticFormField({
            id: 'company.name',
        });
        const valueFromNameElement = getFormFieldValue(
            complexValues,
            nameElementField,
            'age',
        );
        expect(valueFromNameElement).toEqual(30);

        const contactIdsElementField = getMockPydanticFormField({
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

        const companyField = getMockPydanticFormField({
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

        const secondListElementField = getMockPydanticFormField({
            id: 'company.contactIds.1',
        });

        const valueFromSecondListElement = getFormFieldValue(
            complexValues,
            secondListElementField,
        );

        expect(valueFromSecondListElement).toEqual(['123', '456']);

        const firstListElementField = getMockPydanticFormField({
            id: 'company.contactIds.0',
        });

        const valueFromListElement = getFormFieldValue(
            complexValues,
            firstListElementField,
        );

        expect(valueFromListElement).toEqual(['123', '456']);
    });
});

describe('getFormFieldIdWithPath', () => {
    it('returns fieldname when no path is supplied', () => {
        expect(getFormFieldIdWithPath('', 'name')).toBe('name');
    });

    it('returns the full field id from the sybling level', () => {
        expect(getFormFieldIdWithPath('person.name', 'age')).toBe('person.age');
    });

    it('works with array', () => {
        expect(getFormFieldIdWithPath('person.0', '')).toBe('person');
    });

    it('works with array of objects', () => {
        expect(getFormFieldIdWithPath('person.0.name', 'age')).toBe(
            'person.0.age',
        );
    });
});

describe('itemizeArrayItem', () => {
    // Postfixes .{index} to PydanticFormField id
    // When the item being itemized is an object field adds .{index} at correct position in to ids of all properties
    // It will itemize only one level. Lower levels will be itemized when the item is rendered and the path from the parent
    // is passed in again making the id unique for that level

    const stringField = getMockPydanticFormField({
        id: 'stringField',
        type: PydanticFormFieldType.STRING,
    });

    const objectField = getMockPydanticFormField({
        id: 'objectField',
        properties: {
            prop1: getMockPydanticFormField({
                id: 'prop1',
                type: PydanticFormFieldType.STRING,
            }),
            prop2: getMockPydanticFormField({
                id: 'prop2',
                type: PydanticFormFieldType.STRING,
            }),
        },
    });

    const arrayFieldWithArrayFieldArrayItem = getMockPydanticFormField({
        id: 'arrayFieldWithArrayArrayItem',
        type: PydanticFormFieldType.ARRAY,
        arrayItem: getMockPydanticFormField({
            id: 'arrayItemArrayField',
            type: PydanticFormFieldType.ARRAY,
            arrayItem: getMockPydanticFormField({
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
                    id: `${objectField.properties?.prop1.id}`,
                },
                prop2: {
                    ...objectField.properties?.prop2,
                    id: `${objectField.properties?.prop2.id}`,
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
        const arrayItemWithObjectWithArrayItem = getMockPydanticFormField({
            id: 'arrayItemWithObjectWithArrayItem',
            type: PydanticFormFieldType.OBJECT,
            properties: {
                level1prop1: stringField,
                level1prop2: getMockPydanticFormField({
                    id: 'arrayField',
                    type: PydanticFormFieldType.ARRAY,
                    arrayItem: getMockPydanticFormField({
                        id: 'arrayField',
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
            arrayItemWithObjectWithArrayItem,
            'PATH',
        );

        const expectedItemizedItem = {
            ...arrayItemWithObjectWithArrayItem,
            id: 'PATH.5',
        };

        expect(expectedItemizedItem).toEqual(itemizedItem);

        const subItem = itemizedItem.properties?.level1prop2;

        if (subItem?.arrayItem) {
            const itemizedSubItem = itemizeArrayItem(
                3,
                subItem?.arrayItem,
                `${itemizedItem?.id}.${subItem.id}`, // in actual use the ${itemizedItem?.id} is added by feeding the component through the object field
            );

            const expectedSubItem = {
                ...subItem.arrayItem,
                id: 'PATH.5.arrayField.3',
            };
            expect(itemizedSubItem).toEqual(expectedSubItem);
        }
    });
});

describe('disableField', () => {
    it('Disables the field by setting the disabled attribute to true', () => {
        const field = getMockPydanticFormField({
            attributes: { disabled: false },
        });
        const disabledField = disableField(field);
        expect(disabledField.attributes?.disabled).toBe(true);
    });
});

describe('toOptionalObjectProperty', () => {
    const flatSchema = { const: 'CONST_VAL' };

    function withSpread(addConstValue: boolean) {
        return {
            ...(addConstValue && { const: flatSchema.const }),
        };
    }

    function withHelper(addConstValue: boolean) {
        return {
            ...toOptionalObjectProperty(
                { const: flatSchema.const },
                addConstValue,
            ),
        };
    }

    it('adds const when addConstValue = true', () => {
        expect(withSpread(true)).toEqual(withHelper(true));
        expect(withSpread(true)).toHaveProperty('const', 'CONST_VAL');
    });

    it('omits const when addConstValue = false', () => {
        expect(withSpread(false)).toEqual(withHelper(false));
        expect(withSpread(false)).not.toHaveProperty('const');
    });
});
