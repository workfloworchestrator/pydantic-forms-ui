'use client';

import React, { useState } from 'react';

import { MoonIcon, SunIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { items } from '@/app/items';

interface ExampleLayoutProps {
    title: string;
    subtitle: string;
    description: string;
    children: React.ReactNode;
}

export function ExampleLayout({
    title,
    subtitle,
    description,
    children,
}: ExampleLayoutProps) {
    const pathname = usePathname();
    const [dark, setDark] = useState(false);

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
                                    {subtitle}
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
                        {/* Page header */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                {subtitle}
                            </div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                {title}
                            </h1>
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                                {description}
                            </p>
                        </div>

                        {/* Content */}
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
