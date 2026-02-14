import { PydanticFormControlledElementProps } from 'pydantic-forms';

export const DropdownField = ({
    value,
    onChange,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    return (
        <select
            data-testid={pydanticFormField.id}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            disabled={!!pydanticFormField.attributes.disabled}
            className="
    w-full appearance-none rounded-lg border border-slate-300 bg-slate-50
    px-3 py-2 pr-10 text-sm text-slate-900
    outline-none transition cursor-pointer
    focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15
    dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100
    dark:focus:bg-slate-900 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20
    bg-[length:10px_10px]
    bg-[position:right_0.75rem_center]
    bg-no-repeat
    bg-[image:linear-gradient(45deg,transparent_50%,#64748b_50%),linear-gradient(135deg,#64748b_50%,transparent_50%)]
    dark:bg-[image:linear-gradient(45deg,transparent_50%,#94a3b8_50%),linear-gradient(135deg,#94a3b8_50%,transparent_50%)]
  "
        >
            {pydanticFormField.options?.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};
