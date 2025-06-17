import type { FieldValues } from 'react-hook-form';

import type { Properties, PydanticFormField } from '@/types';
import { PydanticFormFieldType } from '@/types';

export const insertItemAtIndex = (
    fields: PydanticFormField[],
    field: PydanticFormField,
    anchorIndex: number,
): PydanticFormField[] => {
    return [
        ...fields.slice(0, anchorIndex),
        field,
        ...fields.slice(anchorIndex),
    ];
};

export const preventDefault = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    fn();
};

export const getHashForArray = async (array: object[]) => {
    const arrayString = JSON.stringify(array);
    const arrayBuffer = new TextEncoder().encode(arrayString);

    const digest = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashHex = Array.from(new Uint8Array(digest), (b) =>
        b.toString(16).padStart(2, '0'),
    ).join('');

    return hashHex;
};

export const itemizeProperties = (
    properties: Properties,
    itemId: string,
): Properties | undefined => {
    const itemizedProperties = Object.entries(properties).reduce(
        (itemizedProperties, [key, property], index) => {
            const itemizedKey = `${itemId}.${key.split('.').pop()}`;

            if (property.type === PydanticFormFieldType.ARRAY) {
                if (property.arrayItem) {
                    itemizedProperties[itemizedKey] = {
                        ...property,
                        arrayItem: itemize(
                            property.arrayItem,
                            `${itemizedKey}.${index}`,
                        ),
                        id: itemizedKey,
                    };
                }
            } else {
                itemizedProperties[itemizedKey] = {
                    ...property,
                    properties: property.properties
                        ? itemizeProperties(property.properties, itemizedKey)
                        : undefined,
                    id: itemizedKey,
                };
            }

            return itemizedProperties;
        },
        {} as Record<string, PydanticFormField>,
    );
    return itemizedProperties;
};

export const itemize = (
    item: PydanticFormField,
    itemId: string,
): PydanticFormField => {
    const properties = item.properties
        ? itemizeProperties(item.properties, itemId)
        : undefined;
    const arrayItem = item.arrayItem
        ? itemize(item.arrayItem, itemId)
        : undefined;
    return {
        ...item,
        id: itemId,
        arrayItem,
        properties,
    };
};

export const itemizeArrayItem = (
    arrayIndex: number,
    item: PydanticFormField,
): PydanticFormField => {
    const itemId = `${item.id}.${arrayIndex}`;
    return itemize(item, itemId);
};

export function getFormFieldValue(
    fieldName: string,
    formValues: FieldValues,
    field: PydanticFormField,
) {
    const pathToParent = field.id.split('.').slice(0, -1);
    let current: FieldValues = { ...formValues };

    for (const segment of pathToParent) {
        // Try to convert numeric strings to numbers for array indexing
        const key = isNaN(Number(segment)) ? segment : Number(segment);
        if (current && key in current) {
            current = current[key];
        } else {
            return undefined;
        }
    }

    return current?.[fieldName];
}
