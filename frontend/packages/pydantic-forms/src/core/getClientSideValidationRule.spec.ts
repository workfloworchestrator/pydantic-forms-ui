import {
    PydanticFormField,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from '../types';
import { getClientSideValidationRule } from './getClientSideValidationRule';
import { getMatcher } from './getMatcher';
import { getMockPydanticFormField } from './helper.spec';

describe('getClientSideValidationRule', () => {
    const matcher = getMatcher();

    // Boolean fields have no validator in their component matcher, so they exercise the
    // z.unknown() fallback where the required and nullable handling does all the work.
    const getBooleanField = (props: Partial<PydanticFormField> = {}) =>
        getMockPydanticFormField({
            id: 'test',
            type: PydanticFormFieldType.BOOLEAN,
            format: PydanticFormFieldFormat.DEFAULT,
            ...props,
        });

    it('Rejects undefined for a required field without a validator', () => {
        const rule = getClientSideValidationRule(
            getBooleanField({ required: true }),
            matcher,
        );

        const result = rule.safeParse(undefined);

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe('Field is required');
    });

    it('Accepts a value for a required field without a validator', () => {
        const rule = getClientSideValidationRule(
            getBooleanField({ required: true }),
            matcher,
        );

        expect(rule.safeParse(true).success).toBe(true);
        expect(rule.safeParse(false).success).toBe(true);
    });

    it('Accepts undefined for a non required field', () => {
        const rule = getClientSideValidationRule(
            getBooleanField({ required: false }),
            matcher,
        );

        expect(rule.safeParse(undefined).success).toBe(true);
    });

    it('Accepts null for a required field that is nullable', () => {
        // A field like `bool_b: Optional[bool]` is required and nullable: the key has to
        // be present in the payload but null is a valid value for it.
        const rule = getClientSideValidationRule(
            getBooleanField({
                required: true,
                validations: { isNullable: true },
            }),
            matcher,
        );

        expect(rule.safeParse(null).success).toBe(true);
        expect(rule.safeParse(undefined).success).toBe(false);
    });

    it('Accepts null for a required field that is not nullable, which the backend rejects', () => {
        // Known limitation: the z.unknown() fallback for fields without a validator
        // accepts null, and the required refine only rejects undefined. Reaching this
        // state takes a custom component, since null is only seeded for nullable fields
        // and the default components only offer an unset option when a field is nullable.
        const rule = getClientSideValidationRule(
            getBooleanField({ required: true }),
            matcher,
        );

        expect(rule.safeParse(null).success).toBe(true);
    });

    it('Accepts an empty string for a required string field without a minLength', () => {
        // Required means the key has to be present with a value. An empty string is a
        // valid str to the backend unless a minLength says otherwise.
        const rule = getClientSideValidationRule(
            getMockPydanticFormField({
                id: 'test',
                type: PydanticFormFieldType.STRING,
                format: PydanticFormFieldFormat.DEFAULT,
                required: true,
            }),
            matcher,
        );

        expect(rule.safeParse('').success).toBe(true);
        expect(rule.safeParse('some value').success).toBe(true);
        expect(rule.safeParse(undefined).success).toBe(false);
    });

    it('Rejects a too short value for a required string field with a minLength', () => {
        const rule = getClientSideValidationRule(
            getMockPydanticFormField({
                id: 'test',
                type: PydanticFormFieldType.STRING,
                format: PydanticFormFieldFormat.DEFAULT,
                required: true,
                validations: { minLength: 2 },
            }),
            matcher,
        );

        expect(rule.safeParse('').success).toBe(false);
        expect(rule.safeParse('a').success).toBe(false);
        expect(rule.safeParse('ab').success).toBe(true);
    });
});
