import {
    enumToOption,
    getErrorDetailsFromResponse,
    getFieldAllOfAnyOfEntry,
    optionsToOption,
} from '@/core/helper';
import {
    PydanticFormApiResponse,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
    PydanticFormPropertySchemaParsed,
} from '@/types';

describe('getErrorDetailsFromResponse', () => {
    it('should correctly format the error details from API response', () => {
        const mockApiErrorResponse: PydanticFormApiResponse = {
            detail: 'Validation failed',
            status: 422,
            form: {
                type: PydanticFormFieldType.OBJECT,
                properties: {},
            },
            validation_errors: [
                {
                    loc: ['email'],
                    msg: 'Invalid email address',
                    input: 'not-an-email',
                    type: '',
                    url: '',
                },
                {
                    loc: ['password'],
                    msg: 'Password too short',
                    input: '123',
                    type: '',
                    url: '',
                },
            ],
        };

        const result = getErrorDetailsFromResponse(mockApiErrorResponse);

        expect(result).toEqual({
            detail: 'Validation failed',
            source: mockApiErrorResponse.validation_errors,
            mapped: {
                email: {
                    value: 'not-an-email',
                    msg: 'Invalid email address',
                },
                password: {
                    value: '123',
                    msg: 'Password too short',
                },
            },
        });
    });

    it('should handle missing detail with fallback to empty string', () => {
        const mockApiErrorResp: PydanticFormApiResponse = {
            status: 400,
            form: {
                type: PydanticFormFieldType.OBJECT,
                properties: {},
            },
            validation_errors: [],
        };

        const result = getErrorDetailsFromResponse(mockApiErrorResp);

        expect(result.detail).toBe('');
        expect(result.source).toEqual([]);
        expect(result.mapped).toEqual({});
    });
});

describe('getFieldAllOfAnyOfEntry', () => {
    const baseField: Omit<
        PydanticFormPropertySchemaParsed,
        'anyOf' | 'oneOf' | 'allOf'
    > = {
        type: PydanticFormFieldType.STRING,
        format: PydanticFormFieldFormat.DEFAULT,
        uniforms: {
            disabled: false,
            sensitive: false,
            password: false,
        },
    };

    it('returns anyOf if present', () => {
        const input: PydanticFormPropertySchemaParsed = {
            ...baseField,
            anyOf: [{ type: PydanticFormFieldType.NUMBER }],
        };
        const result = getFieldAllOfAnyOfEntry(input);
        expect(result).toEqual([{ type: PydanticFormFieldType.NUMBER }]);
    });

    it('returns oneOf if anyOf is undefined', () => {
        const input: PydanticFormPropertySchemaParsed = {
            ...baseField,
            oneOf: [{ type: PydanticFormFieldType.DATE }],
        };
        const result = getFieldAllOfAnyOfEntry(input);
        expect(result).toEqual([{ type: PydanticFormFieldType.DATE }]);
    });

    it('returns allOf if anyOf and oneOf are undefined', () => {
        const input: PydanticFormPropertySchemaParsed = {
            ...baseField,
            allOf: [{ type: PydanticFormFieldType.STRING }],
        };
        const result = getFieldAllOfAnyOfEntry(input);
        expect(result).toEqual([{ type: PydanticFormFieldType.STRING }]);
    });

    it('returns undefined if all are undefined', () => {
        const input: PydanticFormPropertySchemaParsed = {
            ...baseField,
        };
        const result = getFieldAllOfAnyOfEntry(input);
        expect(result).toBeUndefined();
    });

    it('returns the first defined entry in priority order', () => {
        const input: PydanticFormPropertySchemaParsed = {
            ...baseField,
            anyOf: [{ type: PydanticFormFieldType.STRING }],
            oneOf: [{ type: PydanticFormFieldType.NUMBER }],
            allOf: [{ type: PydanticFormFieldType.DATE }],
        };
        const result = getFieldAllOfAnyOfEntry(input);
        expect(result).toEqual([{ type: PydanticFormFieldType.STRING }]);
    });
});

describe('enumToOption', () => {
    it('converts an array of strings to value/label pairs', () => {
        const input = ['option1', 'option2', 'option3'];
        const result = enumToOption(input);
        expect(result).toEqual([
            { value: 'option1', label: 'option1' },
            { value: 'option2', label: 'option2' },
            { value: 'option3', label: 'option3' },
        ]);
    });

    it('converts an array of enums to value/label pairs', () => {
        const { OBJECT, DATE, NUMBER } = PydanticFormFieldType;
        const input = [OBJECT, DATE, NUMBER];
        const result = enumToOption(input);
        expect(result).toEqual([
            { value: OBJECT, label: OBJECT },
            { value: DATE, label: DATE },
            { value: NUMBER, label: NUMBER },
        ]);
    });

    it('returns an empty array if input is empty', () => {
        const result = enumToOption([]);
        expect(result).toEqual([]);
    });

    it('handles special characters and whitespace', () => {
        const input = ['Yes', 'No', 'Maybe Later'];
        const result = enumToOption(input);
        expect(result).toEqual([
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
            { value: 'Maybe Later', label: 'Maybe Later' },
        ]);
    });

    it('handles duplicated entries (no deduplication)', () => {
        const { OBJECT, DATE } = PydanticFormFieldType;
        const input = [OBJECT, DATE, OBJECT];
        const result = enumToOption(input);
        expect(result).toEqual([
            { value: OBJECT, label: OBJECT },
            { value: DATE, label: DATE },
            { value: OBJECT, label: OBJECT },
        ]);
    });
});

describe('optionsToOption', () => {
    it('converts a plain options object to value/label pairs', () => {
        const input = {
            option1: 'Option 1',
            option2: 'Option 2',
            option3: 'Option 3',
        };
        const result = optionsToOption(input);
        expect(result).toEqual([
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
        ]);
    });

    it('respects sorting based on enums order', () => {
        const input = {
            A: 'Alpha',
            B: 'Bravo',
            C: 'Charlie',
        };
        const enums = ['C', 'A', 'B'];
        const result = optionsToOption(input, enums);
        expect(result).toEqual([
            { value: 'C', label: 'Charlie' },
            { value: 'A', label: 'Alpha' },
            { value: 'B', label: 'Bravo' },
        ]);
    });

    it('returns an empty array if options is empty', () => {
        const result = optionsToOption({});
        expect(result).toEqual([]);
    });

    it('handles special characters and whitespace in keys/labels', () => {
        const input = {
            Yes: 'Yes ✔',
            No: 'No ❌',
            'Maybe Later': 'Maybe ⏳',
        };
        const result = optionsToOption(input);
        expect(result).toEqual([
            { value: 'Yes', label: 'Yes ✔' },
            { value: 'No', label: 'No ❌' },
            { value: 'Maybe Later', label: 'Maybe ⏳' },
        ]);
    });
gs
    it('sorts correctly even if enums include extra or missing keys', () => {
        const input = {
            THREE: 'Three',
            ONE: 'One',
            TWO: 'Two',
        };
        const enums = ['TWO', 'THREE', 'FOUR']; // FOUR doesn't exist in options
        const result = optionsToOption(input, enums);
        expect(result).toEqual([
            { value: 'ONE', label: 'One' }, // Not in enums, goes first
            { value: 'TWO', label: 'Two' },
            { value: 'THREE', label: 'Three' },
        ]);
    });
});
