import { TextField } from '../components/fields';
import type {
    ElementMatch,
    PydanticFormConfig,
    PydanticFormField,
} from '../types';
import { getMatcher } from './getMatcher';

const defaultComponent: ElementMatch = {
    Element: TextField,
    isControlledElement: true,
};

export const fieldToComponentMatcher = (
    pydanticFormField: PydanticFormField,
    componentMatcherExtender: PydanticFormConfig['componentMatcherExtender'],
) => {
    const matcher = getMatcher(componentMatcherExtender);
    const matchedComponent = matcher(pydanticFormField);

    const ElementMatch: ElementMatch = matchedComponent
        ? matchedComponent.ElementMatch
        : defaultComponent; // Defaults to textField when there are no matches

    return {
        Element: ElementMatch,
        pydanticFormField: pydanticFormField,
    };
};
