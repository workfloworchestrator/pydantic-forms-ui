import _ from 'lodash';
import {
    PydanticFormControlledElementProps,
    getFormFieldIdWithPath,
} from 'pydantic-forms';

export const DateTimeField = ({
    value,
    onChange,
    onBlur,
    disabled,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    // If the field is part of an array the value is passed in as an object with the field name as key
    // this is imposed by react-hook-form. We try to detect this and extract the actual value
    const fieldName = getFormFieldIdWithPath(pydanticFormField.id);
    const fieldValue = (() => {
        if (_.isObject(value) && _.has(value, fieldName)) {
            return _.get(value, fieldName);
        } else if (value === null) {
            // When the value is set to null (e.g. the field isNullable and the value is removed)
            // we display '' to avoid letting the field become 'uncontrolled'
            return '';
        }
        return value;
    })();

    return (
        <input
            data-testid={pydanticFormField.id}
            onBlur={onBlur}
            onChange={(e) => {
                onChange(e.currentTarget.value);
            }}
            disabled={disabled}
            value={fieldValue}
            type="datetime-local"
            className={
                'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 ' +
                'outline-none transition ' +
                'focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 ' +
                'disabled:cursor-not-allowed disabled:opacity-50 ' +
                '[&::-webkit-calendar-picker-indicator]:cursor-pointer ' +
                '[&::-webkit-calendar-picker-indicator]:opacity-60 ' +
                '[&::-webkit-calendar-picker-indicator]:hover:opacity-100'
            }
        />
    );
};
