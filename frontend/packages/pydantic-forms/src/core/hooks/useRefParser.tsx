/**
 * Pydantic Forms
 *
 * A SWR hook for parsing the references in a JsonSchema
 *
 * In the JSON Schema there are references to other places in the object.
 * After this hook is run with the data those references will be resolved.
 */
import useSWR from 'swr';

import $RefParser from '@apidevtools/json-schema-ref-parser';

import { PydanticFormSchemaParsed, PydanticFormSchemaRawJson } from '@/types';

export function useRefParser(
    id: string,
    rawJsonSchema: PydanticFormSchemaRawJson,
) {
    return useSWR<PydanticFormSchemaParsed | undefined>(
        [id, rawJsonSchema],
        async ([, source]) => {
            try {
                if (!source) {
                    return undefined;
                }
                const parsedSchema = (await $RefParser.dereference(source, {
                    mutateInputSchema: false,
                })) as unknown as PydanticFormSchemaParsed;
                return parsedSchema;
            } catch (error) {
                console.error(error);
                throw new Error('Could not parse JSON references');
            }
        },
        {
            fallback: {},

            // We revalidate to make sure the form updates when we use it a second time
            revalidateIfStale: true,
            revalidateOnReconnect: false,
            revalidateOnFocus: false,
            // We want to make sure the correct data is showing so we don't want to prefill with stale data
            // we dont use the previous data because of that
            keepPreviousData: false,
            shouldRetryOnError: false,
        },
    );
}
