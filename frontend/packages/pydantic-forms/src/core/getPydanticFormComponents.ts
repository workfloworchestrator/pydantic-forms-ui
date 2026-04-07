import {
    Properties,
    PydanticFormComponents,
    PydanticFormConfig,
} from '../types';
import { fieldToComponentMatcher } from './fieldToComponentMatcher';

export const getPydanticFormComponents = (
    properties: Properties,
    componentMatcherExtender: PydanticFormConfig['componentMatcherExtender'],
): PydanticFormComponents => {
    const components: PydanticFormComponents = Object.values(properties).map(
        (pydanticFormField) => {
            return fieldToComponentMatcher(
                pydanticFormField,
                componentMatcherExtender,
            );
        },
    );

    return components;
};
