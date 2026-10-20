import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { getMockPydanticFormField } from '../../core/helper.spec';
import {
    PydanticFormComponents,
    PydanticFormElementProps,
    PydanticFormField,
} from '../../types';
import { RenderFields } from './RenderFields';

jest.mock('../../core/WrapFieldElement', () => ({
    WrapFieldElement: ({
        pydanticFormField,
    }: {
        pydanticFormField: PydanticFormField;
    }) => <input aria-label={pydanticFormField.id} />,
}));

const ControlledElement = () => null;
const UncontrolledElement = ({
    pydanticFormField,
}: PydanticFormElementProps) => <hr aria-label={pydanticFormField.id} />;

const getComponents = (
    fields: Partial<PydanticFormField>[],
    isControlledElement = true,
): PydanticFormComponents =>
    fields.map((field) => ({
        Element: isControlledElement
            ? { Element: ControlledElement, isControlledElement: true }
            : { Element: UncontrolledElement, isControlledElement: false },
        pydanticFormField: getMockPydanticFormField(field),
    }));

const getCell = (id: string) => screen.getByLabelText(id).parentElement;

describe('RenderFields layout', () => {
    it('renders the fields in a 12-column grid when a field has a layout', () => {
        const { container } = render(
            <RenderFields
                pydanticFormComponents={getComponents([
                    { id: 'name', layout: { span: 6 } },
                ])}
            />,
        );

        expect(container.firstChild).toHaveClass('pf-grid');
        expect(container.firstChild).toHaveStyle({
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
        });
    });

    it('renders the fields directly in the parent when no field has a layout', () => {
        const { container } = render(
            <RenderFields
                pydanticFormComponents={getComponents([
                    { id: 'name' },
                    { id: 'email' },
                    { id: 'phone' },
                ])}
            />,
        );

        expect(container.querySelector('.pf-grid')).toBeNull();
        ['name', 'email', 'phone'].forEach((id) => {
            expect(getCell(id)).toHaveStyle({ width: '100%' });
            expect(getCell(id)).not.toHaveClass('pf-col-span-12');
            expect(getCell(id)?.parentElement).toBe(container);
        });
    });

    it('does not wrap uncontrolled elements without a layout', () => {
        const { container } = render(
            <RenderFields
                pydanticFormComponents={getComponents(
                    [{ id: 'divider' }],
                    false,
                )}
            />,
        );

        expect(getCell('divider')).toBe(container);
    });

    it('places each field according to its layout', () => {
        const { container } = render(
            <RenderFields
                pydanticFormComponents={getComponents([
                    { id: 'first_name', layout: { span: 6 } },
                    { id: 'last_name', layout: { span: 6 } },
                    { id: 'comments' },
                ])}
            />,
        );

        ['first_name', 'last_name'].forEach((id) => {
            expect(getCell(id)).toHaveStyle({ gridColumn: 'span 6' });
            expect(getCell(id)).toHaveClass('pf-col-span-6');
            expect(getCell(id)?.parentElement).toBe(container.firstChild);
        });
        expect(getCell('comments')).toHaveStyle({ gridColumn: 'span 12' });
        expect(getCell('comments')).toHaveClass('pf-col-span-12');
        expect(getCell('comments')?.parentElement).toBe(container.firstChild);
    });

    it('starts a field at the given column', () => {
        render(
            <RenderFields
                pydanticFormComponents={getComponents([
                    { id: 'last_name', layout: { span: 4, start: 9 } },
                ])}
            />,
        );

        expect(getCell('last_name')).toHaveStyle({ gridColumn: '9 / span 4' });
        expect(getCell('last_name')).toHaveClass('pf-col-span-4');
    });

    it('wraps uncontrolled elements in a grid cell', () => {
        render(
            <RenderFields
                pydanticFormComponents={getComponents(
                    [{ id: 'divider', layout: { span: 3, align: 'center' } }],
                    false,
                )}
            />,
        );

        expect(getCell('divider')).toHaveStyle({
            gridColumn: 'span 3',
            alignSelf: 'center',
        });
    });

    it('prefixes the ids of nested fields', () => {
        render(
            <RenderFields
                pydanticFormComponents={getComponents([{ id: 'street' }])}
                idPrefix="address"
            />,
        );

        expect(screen.getByLabelText('address.street')).toBeInTheDocument();
    });
});
