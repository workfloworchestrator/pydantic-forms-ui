"use client"
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    Locale,
    PydanticForm,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from 'pydantic-forms';
import type {
    PydanticComponentMatcher,
    PydanticFormApiProvider,
    PydanticFormCustomDataProvider,
    PydanticFormLabelProvider,
    PydanticFormSuccessResponse,
} from 'pydantic-forms';

import { FieldValues } from 'react-hook-form';
import { TextField } from '@/components/fields/shadcn/TextField';
import { IntegerField } from '@/components/fields/shadcn/IntegerField';
import { TextAreaField } from '@/components/fields/shadcn/TextAreaField';
import { DropdownField } from '@/components/fields/shadcn/DropdownField';

import { items } from '@/app/items';
import Link from 'next/link';

// Map form query param to API endpoint
const FORM_MAP: Record<string, string> = {
    "standard-form": "/form",
    "full-form": "/form-full",
    "simple-form": "/form-simple",
}

// Default form
const DEFAULT_FORM = "standard-form"

export default function Home() {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Get form from URL or use default
    const formParam = searchParams.get("form") || DEFAULT_FORM
    const activeFormEndpoint = FORM_MAP[formParam] || FORM_MAP[DEFAULT_FORM]

    // Sync URL if invalid form param
    useEffect(() => {
        if (!searchParams.get("form")) {
            router.replace(`${pathname}?form=${DEFAULT_FORM}`, { scroll: false })
        } else if (!FORM_MAP[formParam]) {
            router.replace(`${pathname}?form=${DEFAULT_FORM}`, { scroll: false })
        }
    }, [formParam, pathname, router, searchParams])

    const setActiveForm = (formKey: string) => {
        router.push(`${pathname}?form=${formKey}`, { scroll: false })
    }

    const pydanticFormApiProvider: PydanticFormApiProvider = async ({
                                                                        requestBody,
                                                                    }) => {
        const url = `http://localhost:8000${activeFormEndpoint}`;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (fetchResult) => {
                // Note: https://chatgpt.com/share/68c16538-5544-800c-9684-1e641168dbff
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
                                resolve({
                                    ...data,
                                    status: fetchResult.status,
                                });
                            }
                            if (fetchResult.status === 200) {
                                resolve({ status: 200, data });
                            }
                            reject('No valid status in response');
                        },
                    );
                }
                throw new Error(
                    `Status not 400, 510 or 200: ${fetchResult.statusText}`,
                );
            }) //
            .catch((error) => {
                // Note: https://chatgpt.com/share/68c16538-5544-800c-9684-1e641168dbff
                throw new Error(`Fetch error: ${error}`);
            });
    };

    const pydanticLabelProvider: PydanticFormLabelProvider = async () => {
        return new Promise((resolve) => {
            resolve({
                labels: {
                    name: 'LABEL NAME',
                    name_info: 'DESCRIPTION NAAM',
                },
                data: {
                    name: 'LABEL VALUE NAAM',
                },
            });
        });
    };

    const pydanticCustomDataProvider: PydanticFormCustomDataProvider = () => {
        return new Promise((resolve) => {
            resolve({
                name: 'CUSTOM VALUE NAAM',
            });
        });
    };

    const componentMatcher = (
        currentMatchers: PydanticComponentMatcher[],
    ): PydanticComponentMatcher[] => {
        return [
            {
                id: 'textarea',
                ElementMatch: {
                    Element: TextField,
                    isControlledElement: true,
                },
                matcher(field) {
                    return (
                        field.type === PydanticFormFieldType.STRING &&
                        field.format === PydanticFormFieldFormat.LONG
                    );
                },
            },
            {
                id: 'integer',
                ElementMatch: {
                    Element: IntegerField,
                    isControlledElement: true,
                },
                matcher(field) {
                    return field.type === PydanticFormFieldType.INTEGER
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
                        // @ts-expect-error shizzle
                        field.options?.length > 0 &&
                        field.type === PydanticFormFieldType.STRING
                    )
                },
            },
            {
                id: 'string',
                ElementMatch: {
                    Element: TextField,
                    isControlledElement: true,
                },
                matcher(field) {
                    return field.type === PydanticFormFieldType.STRING
                },
            },
            ...currentMatchers,
        ];
    };

    const customTranslations = {
        renderForm: {
            loading: 'The form is loading. Please wait.',
        },
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

    return (
          <SidebarProvider>
              <Sidebar>
                  <SidebarContent>
                      <SidebarGroup>
                          <SidebarGroupLabel>Application</SidebarGroupLabel>
                          <SidebarGroupContent>
                              <SidebarMenu>
                                  {items.map((item) => (
                                      <SidebarMenuItem key={item.title}>
                                          <SidebarMenuButton asChild>
                                              <Link href={item.url} className="flex items-center gap-2">
                                                  <item.icon className="h-4 w-4" />
                                                  <span>{item.title}</span>
                                              </Link>
                                          </SidebarMenuButton>
                                      </SidebarMenuItem>
                                  ))}
                              </SidebarMenu>
                          </SidebarGroupContent>
                      </SidebarGroup>
                  </SidebarContent>
              </Sidebar>
              <SidebarInset>
                  <header className="flex h-12 items-center justify-between px-4">
                      <SidebarTrigger />
                  </header>
                  <div className="p-6 space-y-4">
                      {/* Tabs */}
                      <Card className="w-full">
                          <CardContent className="pt-6">
                              <div className="flex gap-2">
                                  <button
                                      type="button"
                                      onClick={() => setActiveForm('standard-form')}
                                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                          formParam === 'standard-form'
                                              ? 'bg-primary text-primary-foreground'
                                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                      }`}
                                  >
                                      Standard Form
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => setActiveForm('full-form')}
                                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                          formParam === 'full-form'
                                              ? 'bg-primary text-primary-foreground'
                                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                      }`}
                                  >
                                      Full Form
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => setActiveForm('simple-form')}
                                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                          formParam === 'simple-form'
                                              ? 'bg-primary text-primary-foreground'
                                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                      }`}
                                  >
                                      Simple Form
                                  </button>
                              </div>
                          </CardContent>
                      </Card>

                      {/* Form Card */}
                      <Card className="w-full">
                          <CardHeader>
                              <CardTitle>Example Form</CardTitle>
                              <CardDescription>
                                  Simple example form with custom shadcn components
                              </CardDescription>
                          </CardHeader>
                          <CardContent>
                              <div className="[&>form>h2]:mb-4 [&>form>h2]:text-xl [&>form>h2]:font-semibold    [&_button]:px-4
    [&_button]:py-2
    [&_button]:rounded-lg
    [&_button]:font-medium
    [&_button]:transition

    [&_button]:bg-zinc-200
    [&_button]:text-zinc-800
    [&_button]:hover:bg-zinc-300
    dark:[&_button]:bg-zinc-700
    dark:[&_button]:text-zinc-100
    dark:[&_button]:hover:bg-zinc-600

    [&_button[type=submit]]:bg-blue-600
    [&_button[type=submit]]:text-white
    [&_button[type=submit]]:hover:bg-blue-700
    [&_ul:first-of-type]:bg-red-100 [&_ul:first-of-type]:p-4


    ">
                              <PydanticForm
                                  key={formParam}
                                  formKey="theForm"
                                  formId="example123"
                                  title="Example form"
                                  onCancel={() => {
                                      alert('Form cancelled');
                                  }}
                                  onSuccess={onSuccess}
                                  config={{
                                      apiProvider: pydanticFormApiProvider,
                                      labelProvider: pydanticLabelProvider,
                                      customDataProvider: pydanticCustomDataProvider,
                                      componentMatcherExtender: componentMatcher,
                                      customTranslations: customTranslations,
                                      locale: locale,
                                      loadingComponent: <div>Custom loading component</div>,
                                  }}
                              />
                              </div>
                          </CardContent>
                      </Card>
                  </div>

              </SidebarInset>
          </SidebarProvider>





  );
}
