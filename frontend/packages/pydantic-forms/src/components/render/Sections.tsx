/**
 * Dynamic Forms
 *
 * This component will render all the sections based on the
 * config in the dynamicFormContext
 */
import { useDynamicFormsContext } from '@/core';
import { IDynamicFormField, IDynamicFormFieldSection } from '@/types';

export interface IRenderDynamicFormSectionsChildProps {
    id: string;
    title: string;
    fields: IDynamicFormField[];
}

interface IRenderDynamicFormSectionsProps {
    section: IDynamicFormFieldSection;
    children: (props: IRenderDynamicFormSectionsChildProps) => React.ReactNode;
}

export function RenderSections({
    section,
    children,
}: IRenderDynamicFormSectionsProps) {
    const { formData } = useDynamicFormsContext();

    const fields = formData?.fields ?? [];

    return children({
        ...section,
        fields: fields.filter((field) => section.fields.includes(field.id)),
    });
}
