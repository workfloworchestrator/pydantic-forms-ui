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
