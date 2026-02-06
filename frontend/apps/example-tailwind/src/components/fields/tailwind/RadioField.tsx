import _ from 'lodash';
import {
    PydanticFormControlledElementProps,
    PydanticFormFieldOption,
    getFormFieldIdWithPath,
} from 'pydantic-forms';

export const RadioField = ({
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
        if (_.isObject(value) && _.has(value, fieldName))
            return _.get(value, fieldName);
        return value;
    })();

    return (
        <div className="space-y-2">
            {options?.map((option: PydanticFormFieldOption, key: number) => {
                const optionId = `${id}-${option.value}`;
                const isChecked = fieldValue === option.value;

                return (
                    <label
                        key={key}
                        htmlFor={optionId}
                        className={[
                            // layout
                            'flex items-center gap-3 py-1.5 px-2 rounded-lg border transition',
                            // base colors
                            'border-slate-200 bg-white text-slate-900',
                            'dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100',
                            // hover
                            'hover:bg-slate-50 hover:border-slate-300',
                            'dark:hover:bg-zinc-900/60 dark:hover:border-zinc-700',
                            // selected row highlight
                            isChecked ? 'bg-indigo-50 border-indigo-200' : '',
                            isChecked
                                ? 'dark:bg-indigo-500/10 dark:border-indigo-500/30'
                                : '',
                            // disabled
                            disabled
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                    >
                        <input
                            data-testid={optionId}
                            type="radio"
                            id={optionId}
                            name={id}
                            value={option.value}
                            checked={isChecked}
                            onChange={(e) => onChange(e.target.value)}
                            onBlur={onBlur}
                            disabled={disabled}
                            className={[
                                'h-5 w-5 shrink-0 cursor-pointer rounded-full border-2 transition',
                                // light
                                'border-slate-300 bg-white text-indigo-600',
                                'focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500',
                                'hover:border-slate-400',
                                // dark
                                'dark:border-zinc-700 dark:bg-zinc-950 dark:text-indigo-400',
                                'dark:focus:ring-indigo-400/20 dark:focus:border-indigo-400',
                                'dark:hover:border-zinc-500',
                                // disabled
                                'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-300',
                                'dark:disabled:hover:border-zinc-700',
                            ].join(' ')}
                        />

                        <span
                            className={[
                                'text-sm select-none',
                                'text-slate-900 dark:text-zinc-100',
                                disabled
                                    ? 'text-slate-500 dark:text-zinc-500'
                                    : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                        >
                            {option.label || option.value}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};
