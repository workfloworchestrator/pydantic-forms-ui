/**
 * Pydantic Forms
 *
 * A SWR hook for parsing the references in a JsonSchema
 *
 * In the JSON Schema there are references to other places in the object.
 * After this hook is run with the data those references will be resolved.
 */
import useSWR, { SWRConfiguration } from 'swr';

import $RefParser from '@apidevtools/json-schema-ref-parser';

import { PydanticFormSchemaParsed, PydanticFormSchemaRawJson } from '@/types';

export function useRefParser(
    id: string,
    rawJsonSchema?: PydanticFormSchemaRawJson,
    swrConfig?: SWRConfiguration,
) {
    return useSWR<PydanticFormSchemaParsed | undefined>(
        [id, rawJsonSchema],

        // return val
        async ([, source]) => {
            try {
                if (!source) {
                    return undefined;
                }
                const parsedSchema = $RefParser.dereference(source, {
                    mutateInputSchema: false,
                }) as unknown as PydanticFormSchemaParsed;

                return parsedSchema;
            } catch (error) {
                console.error(error);
                new Error('Could not parse JSON references');
            }
        },

        // swr config
        {
            ...swrConfig,
        },
    );
}
