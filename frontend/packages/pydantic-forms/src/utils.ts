import { PydanticFormField } from '@/types';

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
