import _ from 'lodash';
import {
    PydanticFormControlledElementProps,
    PydanticFormFieldOption,
    getFormFieldIdWithPath,
} from 'pydantic-forms';

export const MultiCheckboxField = ({
    value,
    onChange,
    onBlur,
    disabled,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    const { options, id } = pydanticFormField;

    // If the field is part of an array the value is passed in as an object with the field name as key
    // this is imposed by react-hook-form. We try to detect this and extract the actual value
    const fieldName = getFormFieldIdWithPath(pydanticFormField.id);
    const fieldValue = (() => {
        if (_.isObject(value) && _.has(value, fieldName)) {
            return _.get(value, fieldName) as string[];
        }
        return (value as string[]) || [];
    })();

    const handleCheckboxChange = (optionValue: string) => {
        const currentValue = fieldValue;
        const newValue = currentValue.includes(optionValue)
            ? currentValue.filter((item) => item !== optionValue)
            : [...currentValue, optionValue];

        onChange(newValue);
    };

    return (
        <div className="space-y-2">
            {options?.map((option: PydanticFormFieldOption) => {
                // Extract the unique ID for this option
                const optionId = `${id}-${option.value}`;
                const isChecked = fieldValue.includes(option.value);

                return (
                    <label
                        key={optionId}
                        className={
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent transition cursor-pointer ' +
                            'hover:bg-slate-50 hover:border-slate-200 ' +
                            'dark:hover:bg-slate-800 dark:hover:border-slate-700 ' +
                            (disabled
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer')
                        }
                    >
                        <input
                            data-testid={id}
                            type="checkbox"
                            id={optionId}
                            name={optionId}
                            value={option.value}
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(option.value)}
                            onBlur={onBlur}
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
                        <span
                            className={
                                'text-sm text-slate-900 dark:text-slate-100 select-none ' +
                                (disabled ? 'text-slate-500 dark:text-slate-500' : '')
                            }
                        >
                            {option.label || option.value}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};
