import type { FieldValues } from 'react-hook-form';

import type { PydanticFormField } from './types';
import { PydanticFormFieldFormat, PydanticFormFieldType } from './types';
import { getFormFieldValue, insertItemAtIndex } from './utils';

const getPydanticFormFieldDummy = (
    props: Partial<PydanticFormField>,
): PydanticFormField => {
    return {
        id: 'dummy',
        type: PydanticFormFieldType.STRING,
        format: PydanticFormFieldFormat.LONG,
        title: 'Dummy Field',
        required: false,
        properties: {},
        options: [],
        isEnumField: false,
        columns: 1,
        schema: {
            type: PydanticFormFieldType.OBJECT,
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
