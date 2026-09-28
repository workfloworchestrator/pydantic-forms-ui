/**
 * Pydantic Forms
 *
 * This component will render all the fields based on the
 * config in the pydanticFormContext
 */
import React from 'react';
import type { CSSProperties } from 'react';

import { WrapFieldElement } from '../../core/WrapFieldElement';
import {
    GRID_COLUMNS,
    getLayoutColumns,
    getLayoutStyle,
} from '../../core/helper';
import {
    PydanticFormComponent,
    PydanticFormComponents,
    PydanticFormField,
} from '../../types';

interface RenderFieldsProps {
    pydanticFormComponents: PydanticFormComponents;
    extraTriggerFields?: string[]; // The use case for this is that we want to trigger the array field aswell as the array item field
    idPrefix?: string; // This is used to prefix the id of the field for nested fields
}

// Fields are placed on a 12 column grid. The pf-grid and pf-col-span-{n}
// classes allow apps to override the layout, e.g. for small screens
const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(0, 1fr))`,
    columnGap: '1rem',
    width: '100%',
};

export function RenderFields({
    pydanticFormComponents,
    extraTriggerFields,
    idPrefix = '',
}: RenderFieldsProps) {
    const getPrefixedField = (
        pydanticFormField: PydanticFormField,
    ): PydanticFormField => ({
        ...pydanticFormField,
        id: idPrefix
            ? `${idPrefix}.${pydanticFormField.id}`
            : pydanticFormField.id,
    });

    const getCellClassName = (field: PydanticFormField) =>
        `pf-col-span-${getLayoutColumns(field.layout).span}`;

    const getCellStyle = (field: PydanticFormField): CSSProperties => ({
        minWidth: 0,
        ...getLayoutStyle(field.layout),
    });

    const renderElement = (
        component: PydanticFormComponent,
        field: PydanticFormField,
    ) => {
        const { Element, isControlledElement } = component.Element;

        return isControlledElement ? (
            <WrapFieldElement
                PydanticFormControlledElement={Element}
                pydanticFormField={field}
                extraTriggerFields={extraTriggerFields}
            />
        ) : (
            <Element pydanticFormField={field} />
        );
    };

    const renderCell = (component: PydanticFormComponent) => {
        const field = getPrefixedField(component.pydanticFormField);

        return (
            <div
                className={getCellClassName(field)}
                style={getCellStyle(field)}
                key={field.id}
            >
                {renderElement(component, field)}
            </div>
        );
    };

    return (
        <div className="pf-grid" style={gridStyle}>
            {pydanticFormComponents.map(renderCell)}
        </div>
    );
}
