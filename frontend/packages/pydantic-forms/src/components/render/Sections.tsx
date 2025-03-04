/**
 * Pydantic Forms
 *
 * This component will render all the sections based on the
 * config in the pydanticFormContext
 */
import { PydanticFormComponents, PydanticFormFieldSection } from '@/types';

export interface RenderSectionsChildProps {
    id: string;
    title: string;
    components: PydanticFormComponents;
}

interface RenderSectionsProps {
    section: PydanticFormFieldSection;
    components: PydanticFormComponents;
    children: (props: RenderSectionsChildProps) => React.ReactNode;
}

export function RenderSections({
    section,
    components,
    children,
}: RenderSectionsProps) {
    return children({
        ...section,
        components: components.filter((component) =>
            section.components.find(
                (sectionComponent) =>
                    component.pydanticFormField.id ===
                    sectionComponent.pydanticFormField.id,
            ),
        ),
    });
}
