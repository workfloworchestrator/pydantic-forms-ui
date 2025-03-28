import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../globals.css';
import {handleInvalidLocale} from "@/app/[locale]/useGetTranslationMessages";

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
    params: Promise<{ locale: string }>;
}>) {
    const {locale} = await params;
    const validLocale = handleInvalidLocale(locale);

    return (
        <html lang={validLocale}>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                {children}
            </body>
        </html>
    );
}
