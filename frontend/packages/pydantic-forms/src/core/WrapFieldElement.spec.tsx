import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';

import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';

import {
    PydanticFormConfigContext,
    PydanticFormValidationErrorContext,
} from '../PydanticForm';
import {
    PydanticFormApiResponseType,
    PydanticFormControlledElementProps,
    PydanticFormField,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
    PydanticFormValidationErrorDetails,
    PydanticFormValidationResponse,
    RowRenderComponent,
} from '../types';
import { WrapFieldElement } from './WrapFieldElement';
import { getValidationErrorDetailsFromResponse } from './helper';

type TestFieldState = {
    invalid: boolean;
    error?: { type: string; message: string };
};

jest.mock('react-hook-form', () => {
    let fieldState: TestFieldState = { invalid: false };

    return {
        __setFieldState: (state: TestFieldState) => {
            fieldState = state;
        },
        __resetFieldState: () => {
            fieldState = { invalid: false };
        },
        Controller: ({
            name,
            render: renderController,
        }: {
            name: string;
            render: (props: {
                field: ControllerRenderProps;
                fieldState: TestFieldState;
            }) => React.ReactNode;
        }) =>
            renderController({
                field: {
                    name,
                    value: '',
                    onBlur: jest.fn(),
                    onChange: jest.fn(),
                    ref: jest.fn(),
                },
                fieldState,
            }),
        useFormContext: () => ({
            control: {},
            trigger: jest.fn(),
        }),
    };
});

beforeEach(() => {
    jest.requireMock('react-hook-form').__resetFieldState();
});

const TestRow: RowRenderComponent = ({ title, error, children }) => (
    <section aria-label={title}>
        {children}
        {error && <div role="alert">{error}</div>}
    </section>
);

const TestElement = ({ name }: PydanticFormControlledElementProps) => (
    <input aria-label={name} />
);

const getMockField = (id: string): PydanticFormField => ({
    id,
    type: PydanticFormFieldType.STRING,
    format: PydanticFormFieldFormat.DEFAULT,
    title: id,
    default: undefined,
    description: undefined,
    arrayItem: undefined,
    properties: {},
    required: false,
    schema: {
        type: PydanticFormFieldType.STRING,
        format: PydanticFormFieldFormat.DEFAULT,
    },
    validations: {},
    attributes: {},
});

const getValidationErrors = (
    validationErrors: PydanticFormValidationResponse['validation_errors'],
) =>
    getValidationErrorDetailsFromResponse({
        type: PydanticFormApiResponseType.VALIDATION_ERRORS,
        validation_errors: validationErrors,
        status: 400,
    });

const renderFields = (validationErrors: PydanticFormValidationErrorDetails) =>
    render(
        <PydanticFormConfigContext.Provider
            value={{
                apiProvider: jest.fn(),
                componentMatcher: jest.fn(),
                componentMatcherExtender: jest.fn(),
                labelProvider: jest.fn(),
                rowRenderer: TestRow,
            }}
        >
            <PydanticFormValidationErrorContext.Provider
                value={validationErrors}
            >
                <WrapFieldElement
                    PydanticFormControlledElement={TestElement}
                    pydanticFormField={getMockField('ip_static_service_port')}
                />
                <WrapFieldElement
                    PydanticFormControlledElement={TestElement}
                    pydanticFormField={getMockField(
                        'ip_static_service_port.0.vlan',
                    )}
                />
            </PydanticFormValidationErrorContext.Provider>
        </PydanticFormConfigContext.Provider>,
    );

describe('WrapFieldElement backend validation errors', () => {
    it('renders an array item error only on the exact item field', () => {
        const message = 'VLAN range must be between 2 and 4094';
        renderFields(
            getValidationErrors([
                {
                    loc: ['ip_static_service_port', 0, 'vlan'],
                    msg: message,
                    input: '1',
                    type: 'value_error',
                    url: '',
                },
            ]),
        );

        expect(screen.getAllByText(message)).toHaveLength(1);
        expect(
            within(
                screen.getByRole('region', {
                    name: 'ip_static_service_port',
                }),
            ).queryByRole('alert'),
        ).not.toBeInTheDocument();
        expect(
            within(
                screen.getByRole('region', {
                    name: 'ip_static_service_port.0.vlan',
                }),
            ).getByRole('alert'),
        ).toHaveTextContent(message);
    });

    it('renders an array-level error only on the array field', () => {
        const message = 'Select at least one service port';
        renderFields(
            getValidationErrors([
                {
                    loc: ['ip_static_service_port'],
                    msg: message,
                    input: '',
                    type: 'value_error',
                    url: '',
                },
            ]),
        );

        expect(screen.getAllByText(message)).toHaveLength(1);
        expect(
            within(
                screen.getByRole('region', {
                    name: 'ip_static_service_port',
                }),
            ).getByRole('alert'),
        ).toHaveTextContent(message);
        expect(
            within(
                screen.getByRole('region', {
                    name: 'ip_static_service_port.0.vlan',
                }),
            ).queryByRole('alert'),
        ).not.toBeInTheDocument();
    });

    it('renders distinct array-level and item-level errors once each', () => {
        const arrayMessage = 'Select at least one service port';
        const itemMessage = 'Invalid VLAN';
        renderFields(
            getValidationErrors([
                {
                    loc: ['ip_static_service_port'],
                    msg: arrayMessage,
                    input: '',
                    type: 'value_error',
                    url: '',
                },
                {
                    loc: ['ip_static_service_port', 0, 'vlan'],
                    msg: itemMessage,
                    input: '1',
                    type: 'value_error',
                    url: '',
                },
            ]),
        );

        expect(screen.getAllByText(arrayMessage)).toHaveLength(1);
        expect(screen.getAllByText(itemMessage)).toHaveLength(1);
        expect(
            within(
                screen.getByRole('region', {
                    name: 'ip_static_service_port',
                }),
            ).getByRole('alert'),
        ).toHaveTextContent(arrayMessage);
        expect(
            within(
                screen.getByRole('region', {
                    name: 'ip_static_service_port.0.vlan',
                }),
            ).getByRole('alert'),
        ).toHaveTextContent(itemMessage);
    });

    it('prefers the backend error over a client-side error on the same field', () => {
        jest.requireMock('react-hook-form').__setFieldState({
            invalid: true,
            error: { type: 'required', message: 'Client-side error' },
        });

        const message = 'Invalid VLAN';
        renderFields(
            getValidationErrors([
                {
                    loc: ['ip_static_service_port', 0, 'vlan'],
                    msg: message,
                    input: '1',
                    type: 'value_error',
                    url: '',
                },
            ]),
        );

        const itemRow = within(
            screen.getByRole('region', {
                name: 'ip_static_service_port.0.vlan',
            }),
        );
        expect(itemRow.getByRole('alert')).toHaveTextContent(message);
        expect(
            itemRow.queryByText('Client-side error'),
        ).not.toBeInTheDocument();
    });

    it('falls back to the client-side error when there is no backend error', () => {
        jest.requireMock('react-hook-form').__setFieldState({
            invalid: true,
            error: { type: 'required', message: 'Client-side error' },
        });

        renderFields(getValidationErrors([]));

        expect(
            within(
                screen.getByRole('region', {
                    name: 'ip_static_service_port.0.vlan',
                }),
            ).getByRole('alert'),
        ).toHaveTextContent('Client-side error');
    });
});
