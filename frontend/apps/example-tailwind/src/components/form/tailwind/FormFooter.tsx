import type { PydanticFormFooterProps } from 'pydantic-forms';

export default function FormFooter({
    hasNext,
    hasPrevious,
    onCancel,
    onPrevious,
    buttons,
}: PydanticFormFooterProps) {
    const { next, previous } = buttons || {};
    const submitLabel = next?.text ?? (hasNext ? 'Next' : 'Submit');

    return (
        <>
            <div className="mt-6 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-s font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                This form uses a custom footer renderer
            </div>
            <div className="mt-3 flex items-center gap-3">

                {hasPrevious && (
                    <button
                        type="button"
                        onClick={() => onPrevious?.()}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        {previous?.text ?? 'Previous'}
                    </button>
                )}

                {!!onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    className="ml-auto rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                    {submitLabel}
                </button>
            </div>

        </>

    );
}
