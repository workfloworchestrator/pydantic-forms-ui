import { IDynamicFormField } from './types';

export const insertItemAtIndex = (
    fields: IDynamicFormField[],
    field: IDynamicFormField,
    anchorIndex: number,
) => {
    return [
        ...fields.slice(0, anchorIndex),
        field,
        ...fields.slice(anchorIndex),
    ];
};
