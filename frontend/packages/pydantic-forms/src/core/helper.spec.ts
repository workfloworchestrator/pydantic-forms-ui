import {
    enumToOption,
    flattenSchemaCombinators,
    getErrorDetailsFromResponse,
    isNullable,
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

describe('flattenSchemaCombinators', () => {
    const getMockFormPropertySchemaParsed = (
        overrides: Partial<PydanticFormPropertySchemaParsed> = {},
    ): PydanticFormPropertySchemaParsed => ({
        format: PydanticFormFieldFormat.DEFAULT,
        ...overrides,
    });

    it('Doesnt change the schema if no combinator properties exist', () => {
        const inputSchema = getMockFormPropertySchemaParsed();
        const outputSchema = flattenSchemaCombinators(inputSchema);
        expect(inputSchema).toEqual(outputSchema);
    });

    it('Adds properties found in combinators to root level', () => {
        const inputSchema = getMockFormPropertySchemaParsed({
            title: 'Test Schema Title',
            allOf: [
                {
                    type: PydanticFormFieldType.STRING,
                    enum: ['option1', 'option2'],
                },
            ],
        });
        const outputSchema = flattenSchemaCombinators(inputSchema);

        const expectedSchema: PydanticFormPropertySchemaParsed = {
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            title: 'Test Schema Title',
            enum: ['option1', 'option2'],
            allOf: [
                {
                    type: PydanticFormFieldType.STRING,
                    enum: ['option1', 'option2'],
                },
            ],
        };

        expect(outputSchema).toEqual(expectedSchema);
    });

    it('Lets root properties prevail over matching ones found in combinators', () => {
        const inputSchema = getMockFormPropertySchemaParsed({
            title: 'Test Schema Title',
            allOf: [
                {
                    type: PydanticFormFieldType.STRING,
                    title: 'Overridden Title',
                },
            ],
        });
        const outputSchema = flattenSchemaCombinators(inputSchema);

        const expectedSchema: PydanticFormPropertySchemaParsed = {
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            title: 'Test Schema Title',
            allOf: [
                {
                    type: PydanticFormFieldType.STRING,
                    title: 'Overridden Title',
                },
            ],
        };

        expect(outputSchema).toEqual(expectedSchema);
    });

    it('Merges properties of allOf combinator together before merging with root properties', () => {
        const inputSchema = getMockFormPropertySchemaParsed({
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            allOf: [
                {
                    description: 'Test description',
                },
                {
                    title: 'Overridden Title',
                },
            ],
        });
        const outputSchema = flattenSchemaCombinators(inputSchema);

        const expectedSchema: PydanticFormPropertySchemaParsed = {
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            description: 'Test description',
            title: 'Overridden Title',
            allOf: [
                {
                    description: 'Test description',
                },
                {
                    title: 'Overridden Title',
                },
            ],
        };

        expect(outputSchema).toEqual(expectedSchema);
    });

    it('Picks the first array item when it finds a oneOf key', () => {
        const inputSchema = getMockFormPropertySchemaParsed({
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            oneOf: [
                {
                    description: 'Test description',
                },
                {
                    title: 'Overridden Title',
                },
            ],
        });
        const outputSchema = flattenSchemaCombinators(inputSchema);

        const expectedSchema: PydanticFormPropertySchemaParsed = {
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            description: 'Test description',
            oneOf: [
                {
                    description: 'Test description',
                },
                {
                    title: 'Overridden Title',
                },
            ],
        };

        expect(outputSchema).toEqual(expectedSchema);
    });

    it('Picks the first array item when it finds a anyOf key', () => {
        const inputSchema = getMockFormPropertySchemaParsed({
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            anyOf: [
                {
                    description: 'Test description',
                },
                {
                    title: 'Overridden Title',
                },
            ],
        });
        const outputSchema = flattenSchemaCombinators(inputSchema);

        const expectedSchema: PydanticFormPropertySchemaParsed = {
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            description: 'Test description',
            anyOf: [
                {
                    description: 'Test description',
                },
                {
                    title: 'Overridden Title',
                },
            ],
        };

        expect(outputSchema).toEqual(expectedSchema);
    });

    it('Triggers a console warning when it finds a oneOf property with multiple entries except if the extra entry is null', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

        const inputSchema = getMockFormPropertySchemaParsed({
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            oneOf: [
                {
                    description: 'Test description',
                },
                {
                    title: 'Overridden Title',
                },
            ],
        });
        flattenSchemaCombinators(inputSchema);

        expect(consoleWarnSpy).toHaveBeenCalled();

        consoleWarnSpy.mockRestore();

        const consoleWarnSpyNoCall = jest
            .spyOn(console, 'warn')
            .mockImplementation();

        const inputSchemaWithNull = getMockFormPropertySchemaParsed({
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            oneOf: [
                {
                    description: 'Test description',
                },
                {
                    type: PydanticFormFieldType.NULL,
                },
            ],
        });
        flattenSchemaCombinators(inputSchemaWithNull);

        expect(consoleWarnSpyNoCall).toHaveBeenCalledTimes(0);
    });

    it('Triggers a console warning when it finds a anyOf property with multiple entries except if the extra entry is null', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

        const inputSchema = getMockFormPropertySchemaParsed({
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            anyOf: [
                {
                    description: 'Test description',
                },
                {
                    title: 'Overridden Title',
                },
            ],
        });
        flattenSchemaCombinators(inputSchema);

        expect(consoleWarnSpy).toHaveBeenCalled();

        consoleWarnSpy.mockRestore();

        const consoleWarnSpyNoCall = jest
            .spyOn(console, 'warn')
            .mockImplementation();

        const inputSchemaWithNull = getMockFormPropertySchemaParsed({
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            anyOf: [
                {
                    description: 'Test description',
                },
                {
                    type: PydanticFormFieldType.NULL,
                },
            ],
        });
        flattenSchemaCombinators(inputSchemaWithNull);

        expect(consoleWarnSpyNoCall).toHaveBeenCalledTimes(0);
    });

    it('Triggers a console warning when it finds an allOf and and anyOf property', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

        const inputSchema = getMockFormPropertySchemaParsed({
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            allOf: [
                {
                    description: 'Test description',
                },
            ],
            anyOf: [
                {
                    description: 'Test description',
                },
            ],
        });
        flattenSchemaCombinators(inputSchema);

        expect(consoleWarnSpy).toHaveBeenCalled();

        consoleWarnSpy.mockRestore();
    });

    it('Triggers a console warning when it finds an allOf and and oneOf property', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

        const inputSchema = getMockFormPropertySchemaParsed({
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            allOf: [
                {
                    description: 'Test description',
                },
            ],
            oneOf: [
                {
                    description: 'Test description',
                },
            ],
        });
        flattenSchemaCombinators(inputSchema);

        expect(consoleWarnSpy).toHaveBeenCalled();

        consoleWarnSpy.mockRestore();
    });

    it('Triggers a console warning when it finds an oneOf and and anyOf property', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

        const inputSchema = getMockFormPropertySchemaParsed({
            type: PydanticFormFieldType.STRING,
            format: PydanticFormFieldFormat.DEFAULT,
            oneOf: [
                {
                    description: 'Test description',
                },
            ],
            anyOf: [
                {
                    description: 'Test description',
                },
            ],
        });
        flattenSchemaCombinators(inputSchema);

        expect(consoleWarnSpy).toHaveBeenCalled();

        consoleWarnSpy.mockRestore();
    });

    describe('isNullable', () => {
        it('returns true if the schema has a null type in anyOf', () => {
            const inputSchema = getMockFormPropertySchemaParsed({
                type: PydanticFormFieldType.STRING,
                format: PydanticFormFieldFormat.DEFAULT,
                anyOf: [
                    {
                        type: PydanticFormFieldType.STRING,
                    },
                    {
                        type: PydanticFormFieldType.NULL,
                    },
                ],
            });
            const result: boolean = isNullable(inputSchema);
            expect(result).toBe(true);
        });

        it('returns true if the schema has a null type in oneOf', () => {
            const inputSchema = getMockFormPropertySchemaParsed({
                type: PydanticFormFieldType.STRING,
                format: PydanticFormFieldFormat.DEFAULT,
                oneOf: [
                    {
                        type: PydanticFormFieldType.STRING,
                    },
                    {
                        type: PydanticFormFieldType.NULL,
                    },
                ],
            });
            const result: boolean = isNullable(inputSchema);
            expect(result).toBe(true);
        });

        it('returns false if the schema does not have a null type', () => {
            const inputSchema = getMockFormPropertySchemaParsed({
                type: PydanticFormFieldType.STRING,
                format: PydanticFormFieldFormat.DEFAULT,
            });
            const result: boolean = isNullable(inputSchema);
            expect(result).toBe(false);
        });
    });
});
