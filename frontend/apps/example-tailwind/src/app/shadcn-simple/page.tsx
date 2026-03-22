'use client';

import Link from 'next/link';
import { PydanticForm } from 'pydantic-forms';
import type {
    PydanticFormCustomDataProvider,
    PydanticFormLabelProvider,
} from 'pydantic-forms';

import { items } from '@/app/items';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
} from '@/components/ui/sidebar';
import {
    createApiProvider,
    createComponentMatcherShadcn,
    DEFAULT_LOCALE,
    DEFAULT_TRANSLATIONS,
    defaultOnCancel,
    defaultOnSuccess,
    useQueryParam,
} from '@/shared';

// Map form query param to API endpoint
const FORM_MAP: Record<string, string> = {
    'standard-form': '/form',
    'full-form': '/form-full',
    'simple-form': '/form-simple',
};

const DEFAULT_FORM = 'standard-form';

export default function Home() {
    const [formParam, setFormParam] = useQueryParam('form', DEFAULT_FORM);
    const activeFormEndpoint = FORM_MAP[formParam] || FORM_MAP[DEFAULT_FORM];

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
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Examples</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                <item.icon />
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
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="text-lg font-semibold">
                        Pydantic Forms - ShadCN Simple
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Simple ShaDCN Form</CardTitle>
                            <CardDescription>
                                Form using ShadCN UI components without custom
                                header or footer
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Form Tabs */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormParam('standard-form')
                                    }
                                    className={[
                                        'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition',
                                        formParam === 'standard-form'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                                    ].join(' ')}
                                >
                                    Standard Form
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormParam('full-form')}
                                    className={[
                                        'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition',
                                        formParam === 'full-form'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                                    ].join(' ')}
                                >
                                    Full Form
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormParam('simple-form')}
                                    className={[
                                        'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition',
                                        formParam === 'simple-form'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                                    ].join(' ')}
                                >
                                    Simple Form
                                </button>
                            </div>

                            {/* Form */}
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
                                    customDataProvider:
                                        pydanticCustomDataProvider,
                                    componentMatcherExtender:
                                        createComponentMatcherShadcn,
                                    customTranslations: DEFAULT_TRANSLATIONS,
                                    locale: DEFAULT_LOCALE,
                                    loadingComponent: (
                                        <div className="rounded-lg border bg-card p-4 text-sm text-card-foreground">
                                            Loading form...
                                        </div>
                                    ),
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
