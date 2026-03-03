'use client';

import React, { useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

import _ from 'lodash';
import { MoonIcon, SunIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    Locale,
    PydanticForm,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
    zodValidationPresets
} from 'pydantic-forms';
import type {
    PydanticComponentMatcher,
    PydanticFormApiProvider,
    PydanticFormCustomDataProvider,
    PydanticFormLabelProvider,
    PydanticFormSuccessResponse,
} from 'pydantic-forms';

import { items } from '@/app/items';
import { CheckboxField } from '@/components/fields/tailwind/CheckboxField';
import { DateField } from '@/components/fields/tailwind/DateField';
import { DateTimeField } from '@/components/fields/tailwind/DateTimeField';
import { DropdownField } from '@/components/fields/tailwind/DropdownField';
import { IntegerField } from '@/components/fields/tailwind/IntegerField';
import { MultiCheckboxField } from '@/components/fields/tailwind/MultiCheckboxField';
import { RadioField } from '@/components/fields/tailwind/RadioField';
import { TextAreaField } from '@/components/fields/tailwind/TextAreaField';
import { TextField } from '@/components/fields/tailwind/TextField';
import FormFooter from '@/components/form/tailwind/FormFooter';
import FormHeader from '@/components/form/tailwind/FormHeader';

type MenuItem = {
    title: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

// Map form query param to API endpoint
const FORM_MAP: Record<string, string> = {
    'standard-form': '/form',
    'full-form': '/form-full',
    'simple-form': '/form-simple',
};

// Default form
const DEFAULT_FORM = 'standard-form';

export default function Page() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [dark, setDark] = useState(false);

    // Get form from URL or use default
    const formParam = searchParams.get('form') || DEFAULT_FORM;
    const activeFormEndpoint = FORM_MAP[formParam] || FORM_MAP[DEFAULT_FORM];

    // Sync URL if invalid form param
    useEffect(() => {
        if (!searchParams.get('form')) {
            router.replace(`${pathname}?form=${DEFAULT_FORM}`, {
                scroll: false,
            });
        } else if (!FORM_MAP[formParam]) {
            router.replace(`${pathname}?form=${DEFAULT_FORM}`, {
                scroll: false,
            });
        }
    }, [formParam, pathname, router, searchParams]);

    const setActiveForm = (formKey: string) => {
        router.push(`${pathname}?form=${formKey}`, { scroll: false });
    };

    // ---- Pydantic providers ----
    const pydanticFormApiProvider: PydanticFormApiProvider = async ({
        requestBody,
    }) => {
        const url = `http://localhost:8000${activeFormEndpoint}`;
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

    const pydanticLabelProvider: PydanticFormLabelProvider = async () => {
        return {
            labels: {
                name: 'LABEL NAME',
                name_info: 'DESCRIPTION NAAM',
            },
            data: {
                name: 'LABEL VALUE NAAM',
            },
        };
    };

    const pydanticCustomDataProvider: PydanticFormCustomDataProvider =
        async () => {
            return {
                name: 'CUSTOM VALUE NAAM',
            };
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
                validator: zodValidationPresets.string
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
                validator: zodValidationPresets.integer
            },
            {
                id: 'radio',
                ElementMatch: {
                    Element: RadioField,
                    isControlledElement: true,
                },
                matcher(field) {
                    // We are looking for a single value from a set list of options. With less than 4 options, use radio buttons.
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
                validator: zodValidationPresets.string
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
                                    Tailwind demo menu
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
                                tailwind demo's
                            </div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                Full tailwind form example
                            </h1>
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                                Full form with custom footer, header and
                                renderers
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveForm('standard-form')
                                    }
                                    className={[
                                        'flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition',
                                        formParam === 'standard-form'
                                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
                                    ].join(' ')}
                                >
                                    Standard Form
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveForm('full-form')}
                                    className={[
                                        'flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition',
                                        formParam === 'full-form'
                                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
                                    ].join(' ')}
                                >
                                    Full Form
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveForm('simple-form')}
                                    className={[
                                        'flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition',
                                        formParam === 'simple-form'
                                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
                                    ].join(' ')}
                                >
                                    Simple Form
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 [&_.pf-field-error]:mt-1 [&_.pf-field-error]:text-sm [&_.pf-field-error]:text-red-600 dark:[&_.pf-field-error]:text-red-400">
                            <PydanticForm
                                key={formParam}
                                formKey="theForm"
                                formId="example123"
                                title="Example form"
                                onCancel={() => alert('Form cancelled')}
                                onSuccess={onSuccess}
                                config={{
                                    apiProvider: pydanticFormApiProvider,
                                    labelProvider: pydanticLabelProvider,
                                    customDataProvider:
                                        pydanticCustomDataProvider,
                                    componentMatcherExtender: componentMatcher,
                                    headerRenderer: FormHeader,
                                    footerRenderer: FormFooter,
                                    customTranslations,
                                    locale,
                                    loadingComponent: (
                                        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950">
                                            Custom loading component
                                        </div>
                                    ),
                                }}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
