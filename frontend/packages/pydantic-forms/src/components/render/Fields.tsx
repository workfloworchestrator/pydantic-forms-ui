/**
 * Dynamic Forms
 *
 * This component will render all the fields based on the
 * config in the dynamicFormContext
 */
import React from 'react';

import { usePydanticFormContext } from '@/core';
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

const Col = ({ md, sm, children }: ColProps) => {
    console.log('TODO: implement MD and SM', md, sm);
    return <div>{children}</div>;
};

export function RenderFields({ fields }: RenderFieldsProps) {
    const { formLayout } = usePydanticFormContext();

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

        if (formLayout === PydanticFormLayout.ONE_COL) {
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
