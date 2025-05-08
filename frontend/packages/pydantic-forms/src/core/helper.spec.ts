import { getErrorDetailsFromResponse } from '@/core/helper';
import { PydanticFormApiResponse, PydanticFormFieldType } from '@/types';

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
