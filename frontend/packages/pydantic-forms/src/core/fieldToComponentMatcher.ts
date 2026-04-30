import { TextField } from '../components/fields';
import { ComponentMatcher, ElementMatch, PydanticFormField } from '../types';

const defaultComponent: ElementMatch = {
    Element: TextField,
    isControlledElement: true,
};

export const fieldToComponentMatcher = (
    pydanticFormField: PydanticFormField,
    matcher: ComponentMatcher,
) => {
    const matchedComponent = matcher(pydanticFormField);

    const ElementMatch: ElementMatch = matchedComponent
        ? matchedComponent.ElementMatch
        : defaultComponent; // Defaults to textField when there are no matches

    return {
        Element: ElementMatch,
        pydanticFormField: pydanticFormField,
    };
};
