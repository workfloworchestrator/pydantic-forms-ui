/**
 * Pydantic Forms
 *
 * We will search for the first field that returns a positive match
 */
import { PydanticComponentMatcher } from '@/types';

const defaultComponentMatchers: PydanticComponentMatcher[] = [
    // no matchers, it defaults to Text field in the mapToComponent function
];

export default defaultComponentMatchers;
