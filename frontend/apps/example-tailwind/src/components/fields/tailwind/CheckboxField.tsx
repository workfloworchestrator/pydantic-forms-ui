import _ from 'lodash';
import {
    PydanticFormControlledElementProps,
    getFormFieldIdWithPath,
} from 'pydantic-forms';

export const CheckboxField = ({
    value,
    onChange,
    onBlur,
    disabled,
    pydanticFormField,
    name,
}: PydanticFormControlledElementProps) => {
    // If the field is part of an array the value is passed in as an object with the field name as key
    // this is imposed by react-hook-form. We try to detect this and extract the actual value
    const fieldName = getFormFieldIdWithPath(pydanticFormField.id);
    const fieldValue = (() => {
        if (_.isObject(value) && _.has(value, fieldName)) {
            return _.get(value, fieldName);
        }
        return value;
    })();

    return (
        <div className="flex items-center">
            <input
                data-testid={pydanticFormField.id}
                type="checkbox"
                checked={!!fieldValue}
                onChange={() => onChange(!fieldValue)}
                onBlur={onBlur}
                name={name}
                disabled={disabled}
                className={
                    'h-5 w-5 rounded border-2 border-slate-300 bg-white text-indigo-600 transition cursor-pointer ' +
                    'focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 ' +
                    'checked:bg-indigo-600 checked:border-indigo-600 ' +
                    'hover:border-indigo-400 ' +
                    'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-300 ' +
                    'dark:border-slate-600 dark:bg-slate-800 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:hover:border-indigo-400'
                }
            />
        </div>
    );
};
