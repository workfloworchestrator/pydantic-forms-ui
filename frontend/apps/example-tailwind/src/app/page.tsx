'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { items } from '@/app/items';

export default function Home() {
    const pathname = usePathname()

    return (
        <main className="mx-auto max-w-5xl px-6 py-16">
            <h1 className="mb-10 text-3xl font-bold tracking-tight">
                Form Examples
            </h1>

            <nav className="grid gap-6 sm:grid-cols-2">
                {items.map(({ title, url, icon: Icon }) => {
                    const isActive = pathname === url

                    return (
                        <Link
                            key={url}
                            href={url}
                            className={clsx(
                                "group relative flex items-center gap-4 rounded-xl border p-6 transition-all",
                                "hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md",
                                "focus:outline-none focus:ring-2 focus:ring-neutral-900",
                                isActive
                                    ? "border-neutral-900 ring-2 ring-neutral-900"
                                    : "border-neutral-200"
                            )}
                        >
                            <div
                                className={clsx(
                                    "flex h-12 w-12 items-center justify-center rounded-lg",
                                    "bg-neutral-100 transition-colors",
                                    "group-hover:bg-neutral-900 group-hover:text-white",
                                    isActive && "bg-neutral-900 text-white"
                                )}
                            >
                                <Icon className="h-6 w-6" />
                            </div>

                            <div className="flex flex-col">
                                <span className="text-lg font-semibold">
                                    {title}
                                </span>
                                <span className="text-sm text-neutral-500">
                                    {url}
                                </span>
                            </div>

                            {/* subtle arrow */}
                            <span className="ml-auto text-neutral-400 transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </main>
    )
}
