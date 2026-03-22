'use client';

import { useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PydanticForm } from 'pydantic-forms';
import type {
    PydanticFormCustomDataProvider,
    PydanticFormLabelProvider,
} from 'pydantic-forms';

import { ExampleLayout } from '@/components/layout/ExampleLayout';
import { FormContainer } from '@/components/layout/FormContainer';
import {
    createApiProvider,
    createComponentMatcher,
    DEFAULT_LOCALE,
    DEFAULT_TRANSLATIONS,
    defaultOnCancel,
    defaultOnSuccess,
} from '@/shared';

// Map form query param to API endpoint
const FORM_MAP: Record<string, string> = {
    'standard-form': '/form',
    'full-form': '/form-full',
    'simple-form': '/form-simple',
};

const DEFAULT_FORM = 'standard-form';

export default function Page() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

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
    const apiProvider = createApiProvider(activeFormEndpoint);

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

    return (
        <ExampleLayout
            title="Simple tailwind form example"
            subtitle="Tailwind demo's"
            description="Simple form without custom footer and header or renderers"
        >
            {/* Form Tabs */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveForm('standard-form')}
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

            {/* Form */}
            <FormContainer>
                <PydanticForm
                    key={formParam}
                    formKey="theForm"
                    formId="example123"
                    title="Example form"
                    onCancel={defaultOnCancel}
                    onSuccess={defaultOnSuccess}
                    config={{
                        apiProvider,
                        labelProvider: pydanticLabelProvider,
                        customDataProvider: pydanticCustomDataProvider,
                        componentMatcherExtender: createComponentMatcher,
                        customTranslations: DEFAULT_TRANSLATIONS,
                        locale: DEFAULT_LOCALE,
                        loadingComponent: (
                            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950">
                                Custom loading component
                            </div>
                        ),
                    }}
                />
            </FormContainer>
        </ExampleLayout>
    );
}
