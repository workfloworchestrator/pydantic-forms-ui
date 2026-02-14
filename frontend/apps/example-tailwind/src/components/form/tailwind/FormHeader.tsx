import {
    getFieldLabelById,
    type PydanticFormHeaderProps,
    useGetValidationErrors,
} from 'pydantic-forms';

export default function FormHeader({
    title,
    pydanticFormSchema,
}: PydanticFormHeaderProps) {
    const validationErrors = useGetValidationErrors();
    const errors = validationErrors?.source;

    const formTitle = title || pydanticFormSchema?.title;

    const rootError = errors
        ?.filter((err) => err.loc.includes('__root__'))
        .shift();
    const fieldErrors =
        errors?.filter((err) => !err.loc.includes('__root__')) ?? [];

    return (
        <div className="mb-6">
            <div className="mb-3 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-s font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                This form uses a custom header renderer
            </div>

            {formTitle && (
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {formTitle}
                </h2>
            )}

            {!!errors?.length && (
                <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                        The form contains errors
                    </p>

                    {!!rootError && (
                        <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                            {rootError.msg}
                        </p>
                    )}

                    {!!fieldErrors.length && (
                        <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-300">
                            {fieldErrors.map((error) => (
                                <li key={JSON.stringify(error)}>
                                    <strong>
                                        {error.loc
                                            .map((value) =>
                                                getFieldLabelById(
                                                    value,
                                                    pydanticFormSchema,
                                                ),
                                            )
                                            .join(', ')}
                                    </strong>
                                    : {error.msg}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
