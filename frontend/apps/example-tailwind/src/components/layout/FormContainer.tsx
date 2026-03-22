import React from 'react';

interface FormContainerProps {
    children: React.ReactNode;
}

/**
 * Shared form container with consistent styling for all example forms.
 * Provides consistent button styles, error messages, and form layout.
 */
export function FormContainer({ children }: FormContainerProps) {
    return (
        <div
            className="
                rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900
                [&>form>h2]:mb-4 [&>form>h2]:text-xl [&>form>h2]:font-semibold
                [&_button]:px-4 [&_button]:py-2 [&_button]:rounded-lg [&_button]:font-medium [&_button]:transition
                [&_button]:bg-zinc-200 [&_button]:text-zinc-800 [&_button]:hover:bg-zinc-300
                dark:[&_button]:bg-zinc-700 dark:[&_button]:text-zinc-100 dark:[&_button]:hover:bg-zinc-600
                [&_button[type=submit]]:bg-blue-600 [&_button[type=submit]]:text-white [&_button[type=submit]]:hover:bg-blue-700
                [&_ul:first-of-type]:bg-red-100 [&_ul:first-of-type]:p-4
                dark:[&_ul:first-of-type]:bg-red-900
                dark:[&_ul:first-of-type]:text-red-100
                dark:[&_ul:first-of-type_*]:text-inherit
                [&_.pf-field-error]:mt-1 [&_.pf-field-error]:text-sm [&_.pf-field-error]:text-red-600
                dark:[&_.pf-field-error]:text-red-400
            "
        >
            {children}
        </div>
    );
}
