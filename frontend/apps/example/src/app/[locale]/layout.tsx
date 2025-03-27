import type { Metadata } from 'next';
import localFont from 'next/font/local';
import {NextIntlClientProvider} from 'next-intl';

import '../globals.css';
import {notFound} from "next/navigation";
import {hasLocale} from "next-intl";
import {routing} from "@/i18n/routing";

const geistSans = localFont({
    src: '../fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: '../fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'Pydantic forms example app',
    description: 'Generates forms from Pydantic models',
};

export default async function RootLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const messages = (await import(`../../../messages/${locale}.json`)).default;

    console.log('locale', locale);
    console.log("MESSAGE HERE", messages);


    return (
        <html lang={locale}>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
            <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
            </NextIntlClientProvider>
            </body>
        </html>
    );
}
