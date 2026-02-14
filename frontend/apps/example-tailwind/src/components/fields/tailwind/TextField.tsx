import _ from 'lodash';
import {
    PydanticFormControlledElementProps,
    getFormFieldIdWithPath,
} from 'pydantic-forms';

export const TextField = ({
    value,
    onChange,
    onBlur,
    disabled,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    // If the field is part of an array the value is passed in as an object with the field name as key
    // this is imposed by react-hook-form. We try to detect this and extract the actual value
    const fieldName = getFormFieldIdWithPath(pydanticFormField.id);
    const fieldValue =
        _.isObject(value) && _.has(value, fieldName)
            ? _.get(value, fieldName)
            : value;

    return (
        <input
            data-testid={pydanticFormField.id}
            onBlur={onBlur}
            onChange={(t) => {
                onChange(t.currentTarget.value);
            }}
            disabled={disabled}
            value={fieldValue}
            type="text"
            className={
                'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20'
            }
        />
    );
};
