import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { getMockPydanticFormField } from '../../core/helper.spec';
import { PydanticFormField, PydanticFormFieldType } from '../../types';
import { DropdownField } from './DropdownField';

const renderDropdown = (
    value: unknown,
    props: Partial<PydanticFormField> = {},
) =>
    render(
        <DropdownField
            value={value}
            onChange={jest.fn()}
            onBlur={jest.fn()}
            disabled={false}
            name="test"
            pydanticFormField={getMockPydanticFormField({
                id: 'test',
                type: PydanticFormFieldType.STRING,
                options: [
                    { value: 'a', label: 'A' },
                    { value: 'b', label: 'B' },
                ],
                ...props,
            })}
        />,
    );

describe('DropdownField', () => {
    it('Shows an empty option instead of the first option when there is no value', () => {
        // Without the empty option the browser displays the first option as selected
        // while the form value is still empty, so the user can't tell a choice is needed.
        renderDropdown('');

        const select = screen.getByTestId('test') as HTMLSelectElement;
        expect(select.value).toBe('');
        expect(select.selectedOptions[0].textContent).toBe('');
    });

    it('Shows an empty option when the value is null', () => {
        renderDropdown(null, { validations: { isNullable: true } });

        expect((screen.getByTestId('test') as HTMLSelectElement).value).toBe(
            '',
        );
    });

    it('Only lets the user pick the empty option when the field is nullable', () => {
        const { unmount } = renderDropdown('', {
            validations: { isNullable: true },
        });
        expect(screen.getByRole('option', { name: '' })).toBeEnabled();
        unmount();

        renderDropdown('');
        expect(screen.getByRole('option', { name: '' })).toBeDisabled();
    });

    it('Shows the selected option', () => {
        renderDropdown('b');

        expect((screen.getByTestId('test') as HTMLSelectElement).value).toBe(
            'b',
        );
    });
});
