/**
 * Dynamic Forms
 *
 * A SWR hook for parsing the references in a JsonSchema
 *
 * In the JSON Schema there are references to other places in the object.
 * After this hook is run with the data those references will be resolved.
 */
import useSWR, { SWRConfiguration } from 'swr';

import $RefParser from '@apidevtools/json-schema-ref-parser';

import { PydanticFormApiRefResolved } from '@/types';

export function useRefParser(
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source?: any,
    swrConfig?: SWRConfiguration,
) {
    return useSWR<PydanticFormApiRefResolved | undefined>(
        // cache key
        [id, source],

        // return val
        async ([, source]) => {
            if (!source) {
                return undefined;
            }

            try {
                return $RefParser.dereference(source, {
                    mutateInputSchema: false,
                }) as unknown as PydanticFormApiRefResolved;
            } catch (error) {
                console.error(error);
                new Error('Could not parse JSON references');
            }
        },

        // swr config
        {
            fallback: {},
            ...swrConfig,
        },
    );
}
