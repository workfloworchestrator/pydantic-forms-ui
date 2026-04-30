import {
    Properties,
    PydanticFormComponents,
    PydanticFormContextConfig,
} from '../types';
import { fieldToComponentMatcher } from './fieldToComponentMatcher';

export const getPydanticFormComponents = (
    properties: Properties,
    componentMatcher: PydanticFormContextConfig['componentMatcher'],
): PydanticFormComponents => {
    const components: PydanticFormComponents = Object.values(properties).map(
        (pydanticFormField) => {
            return fieldToComponentMatcher(pydanticFormField, componentMatcher);
        },
    );

    return components;
};
