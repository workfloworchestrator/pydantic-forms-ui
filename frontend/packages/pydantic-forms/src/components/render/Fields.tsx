/**
 * Dynamic Forms
 *
 * This component will render all the fields based on the
 * config in the dynamicFormContext
 */
import React from 'react';

import { useDynamicFormsContext } from '@/core';
import { DynamicFormsFormLayout, IDynamicFormField } from '@/types';

interface IRenderFieldsProps {
    fields: IDynamicFormField[];
}
interface RowProps {
    children: React.ReactNode;
}
const Row = ({ children }: RowProps) => <div>{children}</div>;

interface ColProps {
    md: number;
    sm: number;
    children: React.ReactNode;
}

const Col = ({ md, sm, children }: ColProps) => <div>{children}</div>;

export function RenderFields({ fields }: IRenderFieldsProps) {
    const { formLayout } = useDynamicFormsContext();

    return fields.map((field) => {
        const FormElement = field.FormElement;

        if (!FormElement) {
            return <></>;
        }

        if (field.matchedFieldResult?.preventColRender) {
            return (
                <div key={field.id} e2e-id={field.id}>
                    <FormElement field={field} />
                </div>
            );
        }

        if (formLayout === DynamicFormsFormLayout.ONE_COL) {
            return (
                <Row key={field.id}>
                    <Col md={field.columns} sm={12} e2e-id={field.id}>
                        <FormElement field={field} />
                    </Col>
                </Row>
            );
        }

        return (
            <Col key={field.id} md={field.columns} sm={12} e2e-id={field.id}>
                <FormElement field={field} />
            </Col>
        );
    });
}
