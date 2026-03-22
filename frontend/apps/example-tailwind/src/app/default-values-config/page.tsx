'use client';

import { PydanticForm } from 'pydantic-forms';

import { ExampleLayout } from '@/components/layout/ExampleLayout';
import { FormContainer } from '@/components/layout/FormContainer';
import {
    DEFAULT_LOCALE,
    DEFAULT_TRANSLATIONS,
    createApiProvider,
    createComponentMatcher,
    defaultOnCancel,
    defaultOnSuccess,
    useQueryParam,
} from '@/shared';

// Simulate an async API call to fetch default values
async function fetchDefaultValuesFromAPI(): Promise<Record<string, unknown>> {
    // Simulate network delay - increased to make loading more noticeable
    await new Promise((resolve) => setTimeout(resolve, 2500));

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
    const [mode, setMode] = useQueryParam('mode', 'static');

    const apiProvider = createApiProvider('/form-simple');

    return (
        <ExampleLayout
            title="Custom useFormConfig Example"
            subtitle="useFormConfig with defaultValues"
            description="Pass react-hook-form config via config.useFormConfig including async defaultValues functions"
        >
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
                        {mode === 'async' &&
                            `// Async function that fetches default values
async function fetchDefaultValuesFromAPI() {
  await new Promise(resolve => setTimeout(resolve, 2500));
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
// 3. Handle errors if promise rejects`}

                        {mode === 'static' &&
                            `// Static default values object
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

            {/* Form */}
            <FormContainer>
                <PydanticForm
                    key={mode}
                    formKey="theForm"
                    formId="useFormConfigExample"
                    title="Example form"
                    onCancel={defaultOnCancel}
                    onSuccess={defaultOnSuccess}
                    config={{
                        apiProvider,
                        componentMatcherExtender: createComponentMatcher,
                        customTranslations: DEFAULT_TRANSLATIONS,
                        locale: DEFAULT_LOCALE,
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
            </FormContainer>
        </ExampleLayout>
    );
}
