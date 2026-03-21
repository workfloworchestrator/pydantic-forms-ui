'use client';

import React, { useState } from 'react';
import type { FieldValues } from 'react-hook-form';

import _ from 'lodash';
import { MoonIcon, SunIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Locale,
    PydanticForm,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
    zodValidationPresets,
} from 'pydantic-forms';
import type {
    PydanticComponentMatcher,
    PydanticFormApiProvider,
    PydanticFormSuccessResponse,
} from 'pydantic-forms';

import { items } from '@/app/items';
import { CheckboxField } from '@/components/fields/tailwind/CheckboxField';
import { DateField } from '@/components/fields/tailwind/DateField';
import { DateTimeField } from '@/components/fields/tailwind/DateTimeField';
import { DropdownField } from '@/components/fields/tailwind/DropdownField';
import { IntegerField } from '@/components/fields/tailwind/IntegerField';
import { RadioField } from '@/components/fields/tailwind/RadioField';
import { TextAreaField } from '@/components/fields/tailwind/TextAreaField';
import { TextField } from '@/components/fields/tailwind/TextField';

// Simulate an async API call to fetch default values
async function fetchDefaultValuesFromAPI(): Promise<Record<string, unknown>> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('✓ Async defaults loaded from API');

    // Return mock default values
    return {
        full_name: 'Jane Smith (from API)',
        comments:
            'This comment was loaded asynchronously from an API using an async function',
        age: 28,
        birth_date: '1998-03-15',
        subscribe: true,
        preference: 'b', // Option B
    };
}

export default function Page() {
    const pathname = usePathname();
    const [dark, setDark] = useState(false);
    const [mode, setMode] = useState<'static' | 'async'>('static');

    // ---- Pydantic providers ----
    const pydanticFormApiProvider: PydanticFormApiProvider = async ({
        requestBody,
    }) => {
        const url = 'http://localhost:8000/form-simple';
        try {
            const fetchResult = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: { 'Content-Type': 'application/json' },
            });

            if (
                fetchResult.status === 400 ||
                fetchResult.status === 510 ||
                fetchResult.status === 200 ||
                fetchResult.status === 201
            ) {
                const data = await fetchResult.json();

                return new Promise<Record<string, unknown>>(
                    (resolve, reject) => {
                        if (
                            fetchResult.status === 510 ||
                            fetchResult.status === 400
                        ) {
                            resolve({ ...data, status: fetchResult.status });
                            return;
                        }
                        if (
                            fetchResult.status === 200 ||
                            fetchResult.status === 201
                        ) {
                            resolve({ status: fetchResult.status, data });
                            return;
                        }
                        reject('No valid status in response');
                    },
                );
            }

            throw new Error(
                `Status not 400, 510, 200 or 201: ${fetchResult.statusText}`,
            );
        } catch (error) {
            throw new Error(`Fetch error: ${String(error)}`);
        }
    };

    const componentMatcher = (
        currentMatchers: PydanticComponentMatcher[],
    ): PydanticComponentMatcher[] => {
        return [
            {
                id: 'date',
                ElementMatch: {
                    Element: DateField,
                    isControlledElement: true,
                },
                matcher(field) {
                    return (
                        field.type === PydanticFormFieldType.STRING &&
                        field.format === PydanticFormFieldFormat.DATE
                    );
                },
            },
            {
                id: 'datetime',
                ElementMatch: {
                    Element: DateTimeField,
                    isControlledElement: true,
                },
                matcher(field) {
                    return (
                        field.type === PydanticFormFieldType.STRING &&
                        field.format === PydanticFormFieldFormat.DATETIME
                    );
                },
            },
            {
                id: 'textarea',
                ElementMatch: {
                    Element: TextAreaField,
                    isControlledElement: true,
                },
                matcher(field) {
                    return (
                        field.type === PydanticFormFieldType.STRING &&
                        field.format === PydanticFormFieldFormat.LONG
                    );
                },
                validator: zodValidationPresets.string,
            },
            {
                id: 'integer',
                ElementMatch: {
                    Element: IntegerField,
                    isControlledElement: true,
                },
                matcher(field) {
                    return field.type === PydanticFormFieldType.INTEGER;
                },
                validator: zodValidationPresets.integer,
            },
            {
                id: 'radio',
                ElementMatch: {
                    Element: RadioField,
                    isControlledElement: true,
                },
                matcher(field) {
                    return (
                        field.type === PydanticFormFieldType.STRING &&
                        _.isArray(field.options) &&
                        field.options?.length > 0 &&
                        field.options?.length <= 3
                    );
                },
            },
            {
                id: 'select',
                ElementMatch: {
                    Element: DropdownField,
                    isControlledElement: true,
                },
                matcher(field) {
                    return (
                        // @ts-expect-error options can exist depending on backend schema
                        field.options?.length > 0 &&
                        field.type === PydanticFormFieldType.STRING
                    );
                },
            },
            {
                id: 'checkbox',
                ElementMatch: {
                    Element: CheckboxField,
                    isControlledElement: true,
                },
                matcher(field) {
                    return field.type === PydanticFormFieldType.BOOLEAN;
                },
            },
            {
                id: 'string',
                ElementMatch: { Element: TextField, isControlledElement: true },
                matcher(field) {
                    return field.type === PydanticFormFieldType.STRING;
                },
                validator: zodValidationPresets.string,
            },
            ...currentMatchers,
        ];
    };

    const customTranslations = {
        renderForm: { loading: 'The form is loading. Please wait.' },
    };
    const locale = Locale.enGB;

    const onSuccess = (
        _: FieldValues[],
        apiResponse: PydanticFormSuccessResponse,
    ) => {
        alert(
            `Form submitted successfully: ${JSON.stringify(apiResponse.data)}`,
        );
    };

    // ---- Route -> "page" content mapping ----
    const current = items.find((i) => i.url === pathname) ?? items[0];

    return (
        <div className={dark ? 'dark' : ''}>
            <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
                {/* Top bar */}
                <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-zinc-900 dark:bg-zinc-100" />
                            <div className="leading-tight">
                                <div className="text-sm font-semibold">
                                    Pydantic Forms
                                </div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                    useFormConfig Demo
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setDark((v) => !v)}
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                            aria-label="Toggle dark mode"
                        >
                            {dark ? (
                                <>
                                    <SunIcon className="h-4 w-4" />
                                    Light
                                </>
                            ) : (
                                <>
                                    <MoonIcon className="h-4 w-4" />
                                    Dark
                                </>
                            )}
                        </button>
                    </div>
                </header>

                <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
                    {/* Sidebar */}
                    <aside className="rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
                        <nav className="space-y-1">
                            {items.map((item) => {
                                const active = pathname === item.url;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.url}
                                        href={item.url}
                                        className={[
                                            'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
                                            active
                                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                                : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
                                        ].join(' ')}
                                    >
                                        <Icon className="h-4 w-4 opacity-90" />
                                        <span className="font-medium">
                                            {item.title}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                            Active route:{' '}
                            <span className="font-mono text-[11px]">
                                {current.url}
                            </span>
                        </div>
                    </aside>

                    {/* Main */}
                    <main className="space-y-4">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                useFormConfig with defaultValues
                            </div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                Custom useFormConfig Example
                            </h1>
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                                Pass react-hook-form config via{' '}
                                <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">
                                    config.useFormConfig
                                </code>{' '}
                                including async defaultValues functions
                            </p>
                        </div>

                        {/* Toggle between static and async */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => setMode('static')}
                                    className={[
                                        'flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition',
                                        mode === 'static'
                                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
                                    ].join(' ')}
                                >
                                    Static DefaultValues
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('async')}
                                    className={[
                                        'flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition',
                                        mode === 'async'
                                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
                                    ].join(' ')}
                                >
                                    Async DefaultValues
                                </button>
                            </div>
                        </div>

                        {/* Code example */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                            <h2 className="mb-2 text-sm font-semibold">
                                {mode === 'async'
                                    ? 'Async DefaultValues Function'
                                    : 'Static DefaultValues Object'}
                            </h2>
                            <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-3 text-xs dark:bg-zinc-950">
                                <code>
                                    {mode === 'async'
                                        ? `// Async function that fetches default values
async function fetchDefaultValuesFromAPI() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    full_name: 'Jane Smith (from API)',
    comments: 'This comment was loaded asynchronously from an API',
    age: 28,
    birth_date: '1998-03-15',
    subscribe: true,
    preference: 'b',
  };
}

// Pass async function to useFormConfig.defaultValues
<PydanticForm
  config={{
    apiProvider: pydanticFormApiProvider,
    componentMatcherExtender: componentMatcher,
    useFormConfig: {
      defaultValues: fetchDefaultValuesFromAPI, // ✓ Async function!
    },
  }}
/>

// React Hook Form will:
// 1. Show loading state while function executes
// 2. Populate form fields when promise resolves
// 3. Handle errors if promise rejects`
                                        : `// Static default values object
const staticDefaults = {
  full_name: 'John Doe',
  comments: 'This is a pre-filled comment using static default values',
  age: 25,
  birth_date: '1999-01-01',
  subscribe: false,
  preference: 'a',
};

// Pass static object to useFormConfig.defaultValues
<PydanticForm
  config={{
    apiProvider: pydanticFormApiProvider,
    componentMatcherExtender: componentMatcher,
    useFormConfig: {
      defaultValues: staticDefaults, // ✓ Static object!
    },
  }}
/>

// Form fields will be immediately populated with these values`}
                                </code>
                            </pre>
                        </div>

                        {/* Benefits */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                            <h2 className="mb-2 text-sm font-semibold">
                                Benefits of Async DefaultValues Function
                            </h2>
                            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 dark:text-green-400">
                                        ✓
                                    </span>
                                    <span>
                                        <strong>Cleaner code</strong> - No need
                                        for useState + useEffect
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 dark:text-green-400">
                                        ✓
                                    </span>
                                    <span>
                                        <strong>Built-in loading state</strong>{' '}
                                        - React Hook Form handles it
                                        automatically
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 dark:text-green-400">
                                        ✓
                                    </span>
                                    <span>
                                        <strong>Error handling</strong> -
                                        Promise rejections are caught by RHF
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 dark:text-green-400">
                                        ✓
                                    </span>
                                    <span>
                                        <strong>Type safety</strong> - Same
                                        TypeScript support as static defaults
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Form */}
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
                            <PydanticForm
                                key={mode}
                                formKey="theForm"
                                formId="useFormConfigExample"
                                title="Example form"
                                onCancel={() => alert('Form cancelled')}
                                onSuccess={onSuccess}
                                config={{
                                    apiProvider: pydanticFormApiProvider,
                                    componentMatcherExtender: componentMatcher,
                                    customTranslations,
                                    locale,
                                    useFormConfig: {
                                        defaultValues:
                                            mode === 'async'
                                                ? fetchDefaultValuesFromAPI // Async function
                                                : {
                                                      // Static object
                                                      full_name: 'John Doe',
                                                      comments:
                                                          'This is a pre-filled comment using static default values',
                                                      age: 25,
                                                      birth_date: '1999-01-01',
                                                      subscribe: false,
                                                      preference: 'a',
                                                  },
                                    },
                                }}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
