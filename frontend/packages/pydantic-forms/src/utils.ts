import type { FieldPath, FieldValues } from 'react-hook-form';

import type { PydanticFormField } from '@/types';

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

export const itemizeArrayItem = (
    arrayIndex: number,
    item: PydanticFormField,
    path: FieldPath<FieldValues>,
): PydanticFormField => {
    const itemId = `${path}.${arrayIndex}`;
    return {
        ...item,
        id: itemId,
    };
};

export const disableField = (
    pydanticFormField: PydanticFormField,
): PydanticFormField => {
    return {
        ...pydanticFormField,
        attributes: {
            ...pydanticFormField.attributes,
            disabled: true,
        },
    };
};

/**
 * Determines how many parts to slice from the PydanticFormField's id.
 * If the last segment is a number we conclude it's an array item and  it returns 2 (to slice off the index and the field name).
 * Otherwise, it returns 1 (to slice off just the field name).
 */
const getNumberOfPartsToSlice = (
    pydanticFormField: PydanticFormField,
): number => {
    const pathSegments = pydanticFormField.id.split('.');
    const lastSegment = pathSegments[pathSegments.length - 1];
    return isNaN(Number(lastSegment)) ? 1 : 2;
};

/**
 * Returns the field name extracted from the PydanticFormField's id.
 * If the id contains a dot return the last segment, if the last segment is an integer
 * indicating a position in an array, it will return the segment before that.
 */
const getFieldName = (pydanticFormField: PydanticFormField): string => {
    if (pydanticFormField.id.includes('.')) {
        const numberOfPartsToSlice = getNumberOfPartsToSlice(pydanticFormField);
        return (
            pydanticFormField.id
                .split('.')
                .slice(0, -(numberOfPartsToSlice - 1))
                .pop() || ''
        );
    }
    return pydanticFormField.id;
};

/**
 * This functions returns a fields value but taking into account the position
 * of the field in any tree it might be in. For example when requesting the
 * 'age' field it will return the sibling field called 'age'. This is relevant
 * if the field is part of an array or object where there might be more 'age'
 * fields on other levels
 * */
export function getFormFieldValue(
    formValues: FieldValues,
    pydanticFormField: PydanticFormField,
    fieldName?: string,
) {
    const name = fieldName ? fieldName : getFieldName(pydanticFormField);

    // Determine by the path if we are part of an array. If we are, we need to chop of one more element
    const numberOfPartsToSlice = getNumberOfPartsToSlice(pydanticFormField);
    const pathToParent = pydanticFormField.id
        .split('.')
        .slice(0, -numberOfPartsToSlice);
    let current: FieldValues = { ...formValues };

    for (const segment of pathToParent) {
        // Convert numeric strings to numbers for array indexing
        const key = isNaN(Number(segment)) ? segment : Number(segment);
        if (current && key in current) {
            current = current[key];
        } else {
            return undefined;
        }
    }

    return current?.[name];
}

/**
 * Returns the full field id from the sibling level. Used to pass into rhfs watch function.
 * This is relevant if the field is part of an array or object where there might be more
 *
 */
export function getFormFieldIdWithPath(
    pydanticFormFieldId: PydanticFormField['id'],
    fieldName: string,
): string {
    const pathToParent = pydanticFormFieldId.split('.');
    pathToParent.pop();

    if (fieldName) {
        return pathToParent?.length > 0
            ? [pathToParent.join('.'), fieldName].join('.')
            : fieldName;
    } else if (pathToParent?.length > 0) {
        return pathToParent.join('.'); // Return the full path without the last segment
    }

    return '';
}
