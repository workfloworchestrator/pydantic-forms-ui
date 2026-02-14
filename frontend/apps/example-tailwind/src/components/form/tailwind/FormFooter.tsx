import {
    ArrowLeftIcon,
    ArrowRightIcon,
    SendIcon,
    XIcon,
} from 'lucide-react';
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
            <div className="mt-4 flex items-center gap-4">
                {hasPrevious && (
                    <button
                        type="button"
                        onClick={() => onPrevious?.()}
                        className="inline-flex items-center gap-2 rounded-2xl border-2 border-zinc-200 bg-gradient-to-b from-white to-zinc-50 px-6 py-3 text-base font-bold text-zinc-700 shadow-md transition hover:scale-105 hover:shadow-lg active:scale-95 dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-200 dark:hover:from-zinc-700"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        {previous?.text ?? 'Previous'}
                    </button>
                )}

                {!!onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center gap-2 rounded-2xl border-2 border-zinc-300 bg-gradient-to-b from-white to-zinc-100 px-6 py-3 text-base font-bold text-zinc-600 shadow-md transition hover:scale-105 hover:shadow-lg active:scale-95 dark:border-zinc-600 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-300 dark:hover:from-zinc-700"
                    >
                        <XIcon className="h-5 w-5" />
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    className="ml-auto inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-7 py-3 text-base font-bold text-white shadow-lg shadow-zinc-900/20 transition hover:scale-105 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/30 active:scale-95 dark:bg-white dark:text-zinc-900 dark:shadow-white/10 dark:hover:bg-zinc-100 dark:hover:shadow-white/20"
                >
                    {submitLabel}
                    {hasNext ? (
                        <ArrowRightIcon className="h-5 w-5" />
                    ) : (
                        <SendIcon className="h-5 w-5" />
                    )}
                </button>
            </div>
        </>
    );
}
