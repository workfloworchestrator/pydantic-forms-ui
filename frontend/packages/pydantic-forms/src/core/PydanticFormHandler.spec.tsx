import React from 'react';

import { SWRConfig } from 'swr';

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PydanticForm } from '../PydanticForm';
import { PydanticFormApiProvider, PydanticFormConfig } from '../types';

// next-intl only ships ESM, which jest can't load. Translation keys are rendered as is.
jest.mock('next-intl', () => ({
    IntlErrorCode: {},
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
        children,
    useTranslations: () => (key: string) => key,
}));

// Same for the ref parser, the schemas in this test don't contain references
jest.mock('@apidevtools/json-schema-ref-parser', () => ({
    dereference: async (schema: object) => schema,
}));

// jsdom lacks the APIs used to hash the form history, use the node versions
Object.assign(globalThis, {
    TextEncoder: jest.requireActual('util').TextEncoder,
});
Object.defineProperty(globalThis, 'crypto', {
    value: jest.requireActual('crypto').webcrypto,
});

const getStringFormPage = (fieldId: string) => ({
    type: 'object',
    title: fieldId,
    properties: {
        [fieldId]: { type: 'string', title: fieldId },
    },
    required: [fieldId],
});

const pageMeta = { hasNext: true };

// Two page form: the backend rejects cities starting with 'invalid' on the second page
const apiProvider: PydanticFormApiProvider = async ({ requestBody }) => {
    if (requestBody.length === 0) {
        return { form: getStringFormPage('name'), meta: pageMeta };
    }
    if (requestBody.length === 1) {
        return { form: getStringFormPage('city'), meta: pageMeta };
    }
    const { city } = requestBody[1];
    if (city.startsWith('invalid')) {
        return {
            validation_errors: [
                {
                    loc: ['city'],
                    msg: 'City is invalid',
                    input: city,
                    type: 'value_error',
                },
            ],
        };
    }
    return { status: 200, data: {} };
};

const config: PydanticFormConfig = {
    apiProvider,
};

const getInput = (id: string) =>
    screen.findByTestId(id) as Promise<HTMLInputElement>;

describe('PydanticFormHandler history', () => {
    it('keeps the submitted values when the backend rejects them and restores them after going back and forth', async () => {
        const user = userEvent.setup();

        const fillInput = async (id: string, value: string) => {
            const input = await getInput(id);
            await user.clear(input);
            await user.type(input, value);
        };

        const submit = () =>
            user.click(screen.getByRole('button', { name: /send|submit/i }));

        // Disable deduping, so going back to a previous step fetches it again
        render(
            <SWRConfig
                value={{ dedupingInterval: 0, provider: () => new Map() }}
            >
                <PydanticForm
                    config={config}
                    formKey="history-form"
                    formId="1"
                />
            </SWRConfig>,
        );

        await fillInput('name', 'Alice');
        await submit();

        await fillInput('city', 'invalid');
        await submit();

        // A rejected step must not reset the form to its default values
        expect(await screen.findByText('City is invalid')).toBeInTheDocument();
        expect(await getInput('city')).toHaveValue('invalid');

        await user.click(screen.getByRole('button', { name: /previous/i }));
        await waitFor(async () =>
            expect(await getInput('name')).toHaveValue('Alice'),
        );

        await submit();

        // An accepted step restores the values entered earlier on the next page
        await waitFor(async () =>
            expect(await getInput('city')).toHaveValue('invalid'),
        );

        // Rejecting a changed value must keep it, not fall back to the restored or default values
        await fillInput('city', 'invalid again');
        await submit();
        expect(await screen.findByText('City is invalid')).toBeInTheDocument();
        expect(await getInput('city')).toHaveValue('invalid again');
    });
});
