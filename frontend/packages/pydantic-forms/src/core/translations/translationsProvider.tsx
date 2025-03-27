import React from 'react';
import type { ReactNode } from 'react';

import { merge } from 'lodash';
import {IntlErrorCode, NextIntlClientProvider} from 'next-intl';
// import {
//     Locale,
//     useGetTranslationMessages,
// } from '@orchestrator-ui/orchestrator-ui-components';
import nlNL from './nl.json'
import enGB from './en.json'
import {useGetTranslationMessages} from "@/core/translations/useGetTranslationMessages";
import {useSearchParams} from "next/navigation";

export enum Locale {
    enGB = 'en-GB',
    nlNL = 'nl-NL',
}

// import enGB from './en-GB.json';

interface TranslationsProviderProps {
    children: ReactNode;
}

export const TranslationsProvider = ({
    children,
}: TranslationsProviderProps) => {
    const searchParams = useSearchParams()
    const locale = searchParams.get('locale') as Locale
    const standardMessages = useGetTranslationMessages(locale);
    console.log("messages", standardMessages)

    const getCustomMessages = () => {
        switch (locale) {
            case Locale.enGB:
                return enGB;
            case Locale.nlNL:
                return nlNL;
            default:
                return enGB;
        }
    };

    const onError = (error: { code: IntlErrorCode }) => {
        if (
            error &&
            error.code &&
            error.code !== IntlErrorCode.MISSING_MESSAGE &&
            error.code !== IntlErrorCode.INSUFFICIENT_PATH
        ) {
            // Missing translations are expected and normal in the context of the
            // forms module (see UserInputForm.tsx) so we silently discard them
            // TODO: Think of a place to better log missing translations keys that shouldn't be missing
            console.error(error);
        }
    };

    const messages = merge(standardMessages, getCustomMessages());

    return (
        <NextIntlClientProvider
            locale={locale || Locale.enGB}
            messages={messages}
            onError={onError}
        >
            {children}
        </NextIntlClientProvider>
    );
};
