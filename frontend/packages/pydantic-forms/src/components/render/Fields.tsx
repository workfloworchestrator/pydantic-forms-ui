/**
 * Pydantic Forms
 *
 * This component will render all the fields based on the
 * config in the pydanticFormContext
 */
import React from 'react';

import { usePydanticFormContext } from '@/core';
import { wrapFieldElement } from '@/core/wrapFieldElement';
import { PydanticFormField, PydanticFormLayout } from '@/types';

interface RenderFieldsProps {
    fields: PydanticFormField[];
}

/**
 * Row and Col are imported from "@lib/rijkshuisstijl" in the original implementation
 * These are mocked until the layoutProvider pattern is implemented
 * */
interface RowProps {
    children: React.ReactNode;
}

const Row = ({ children }: RowProps) => <div>{children}</div>;

interface ColProps {
    md: number;
    sm: number;
    children: React.ReactNode;
}

const Col = ({ children }: ColProps) => {
    // TODO: implement md, sm);
    return <div>{children}</div>;
};

export function RenderFields({ fields }: RenderFieldsProps) {
    const { formLayout, rhf } = usePydanticFormContext();

    return fields.map((field) => {
        const element = field.FormElement;

        if (!element) {
            return <></>;
        }
        const formElement = wrapFieldElement(element, field, rhf);

        if (formLayout === PydanticFormLayout.ONE_COL) {
            return (
                <Row key={field.id}>
                    <Col md={field.columns} sm={12} e2e-id={field.id}>
                        {formElement}
                    </Col>
                </Row>
            );
        }

        return (
            <Col key={field.id} md={field.columns} sm={12} e2e-id={field.id}>
                {formElement}
            </Col>
        );
    });
}
