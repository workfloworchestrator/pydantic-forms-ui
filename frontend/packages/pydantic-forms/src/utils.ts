import { IDynamicFormField } from './types';

export const insertItemAtIndex = (
    fields: IDynamicFormField[],
    field: IDynamicFormField,
    anchorIndex: number,
): IDynamicFormField[] => {
    return [
        ...fields.slice(0, anchorIndex),
        field,
        ...fields.slice(anchorIndex),
    ];
};

export const navPreventDefaultFn =
    (fn: () => void) => (e: React.MouseEvent) => {
        e.preventDefault();
        fn();
    };
