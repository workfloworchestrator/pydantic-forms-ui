/**
 * Pydantic Forms
 *
 * This component will render all the sections based on the
 * config in the pydanticFormContext
 */
import { usePydanticFormContext } from '@/core';
import { PydanticFormField, PydanticFormFieldSection } from '@/types';

export interface RenderSectionsChildProps {
    id: string;
    title: string;
    fields: PydanticFormField[];
}

interface RenderSectionsProps {
    section: PydanticFormFieldSection;
    children: (props: RenderSectionsChildProps) => React.ReactNode;
}

export function RenderSections({ section, children }: RenderSectionsProps) {
    const { pydanticFormData } = usePydanticFormContext();

    const fields = pydanticFormData?.fields ?? [];

    return children({
        ...section,
        fields: fields.filter((field) => section.fields.includes(field)),
    });
}
