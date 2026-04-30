import defaultComponentMatchers from '../components/defaultComponentMatchers';
import type {
    PydanticComponentMatcher,
    PydanticFormConfig,
    PydanticFormField,
} from '../types';

export const getMatcher = (
    componentMatcherExtender?: PydanticFormConfig['componentMatcherExtender'],
) => {
    const componentMatchers = componentMatcherExtender
        ? componentMatcherExtender(defaultComponentMatchers)
        : defaultComponentMatchers;

    return (field: PydanticFormField): PydanticComponentMatcher | undefined => {
        return componentMatchers.find(({ matcher }) => {
            return matcher(field);
        });
    };
};
