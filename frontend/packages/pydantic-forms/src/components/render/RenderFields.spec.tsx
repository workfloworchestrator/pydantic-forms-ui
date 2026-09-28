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
    it('renders the fields in a 12-column grid', () => {
        const { container } = render(
            <RenderFields
                pydanticFormComponents={getComponents([{ id: 'name' }])}
            />,
        );

        expect(container.firstChild).toHaveClass('pf-grid');
        expect(container.firstChild).toHaveStyle({
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
        });
    });

    it('places each field according to its layout', () => {
        render(
            <RenderFields
                pydanticFormComponents={getComponents([
                    { id: 'first_name', layout: { span: 6 } },
                    { id: 'last_name', layout: { span: 4, start: 9 } },
                    { id: 'comments' },
                ])}
            />,
        );

        expect(getCell('first_name')).toHaveStyle({ gridColumn: 'span 6' });
        expect(getCell('first_name')).toHaveClass('pf-col-span-6');
        expect(getCell('last_name')).toHaveStyle({ gridColumn: '9 / span 4' });
        expect(getCell('comments')).toHaveStyle({ gridColumn: 'span 12' });
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
