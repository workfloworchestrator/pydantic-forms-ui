"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Locale,
    PydanticForm,
    PydanticFormFieldFormat,
    PydanticFormFieldType,
} from "pydantic-forms"
import type {
    PydanticComponentMatcher,
    PydanticFormApiProvider,
    PydanticFormCustomDataProvider,
    PydanticFormLabelProvider,
    PydanticFormSuccessResponse,
} from "pydantic-forms"

import type { FieldValues } from "react-hook-form"
import { BookIcon, BookPlusIcon, MoonIcon, SunIcon } from "lucide-react"

import { TextField } from "@/components/fields/tailwind/TextField"
import { IntegerField } from "@/components/fields/tailwind/IntegerField"
import { DropdownField } from "@/components/fields/tailwind/DropdownField"
import { items } from '@/app/items';

type MenuItem = {
    title: string
    url: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export default function Page() {
    const pathname = usePathname()
    const [dark, setDark] = useState(false)

    const current = items.find((i) => i.url === pathname) ?? items[0]

    return (
        <div className={dark ? "dark" : ""}>
            <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
                {/* Top bar */}
                <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-zinc-900 dark:bg-zinc-100" />
                            <div className="leading-tight">
                                <div className="text-sm font-semibold">Pydantic Forms</div>
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
                                const active = pathname === item.url
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.url}
                                        href={item.url}
                                        className={[
                                            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                                            active
                                                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                                                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
                                        ].join(" ")}
                                    >
                                        <Icon className="h-4 w-4 opacity-90" />
                                        <span className="font-medium">{item.title}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                            Active route:{" "}
                            <span className="font-mono text-[11px]">{current.url}</span>
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
                                Full form with custom footer and header or renderers
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                                    <svg
                                        className="h-8 w-8 text-zinc-400 dark:text-zinc-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                    Work in Progress
                                </h3>
                                <p className="mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
                                    This full Tailwind form example with custom footer, header, and renderers is currently under development.
                                </p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
