import React from 'react';
import type { ReactNode } from 'react';

import { merge } from 'lodash';
import { IntlErrorCode, NextIntlClientProvider } from 'next-intl';

import { TranslationsJSON } from '@/types';

import enGB from './en-GB.json';
import nlNL from './nl-NL.json';

export enum Locale {
    enGB = 'en-GB',
    nlNL = 'nl-NL',
}

const DEFAULT_TIMEZONE = 'Europe/Amsterdam';

interface TranslationsProviderProps {
    customTranslations: TranslationsJSON | undefined;
    locale?: string;
    children: ReactNode;
}

export const TranslationsProvider = ({
    customTranslations,
    locale = Locale.enGB,
    children,
}: TranslationsProviderProps) => {
    const getLocalMessages = (locale: string) => {
        switch (locale) {
            case Locale.enGB:
                return enGB;
            case Locale.nlNL:
                return nlNL;
            default:
                return enGB;
        }
    };
    const localMessages = getLocalMessages(locale);

    const onError = (error: { code: IntlErrorCode }) => {
        if (
            error &&
            error.code &&
            error.code !== IntlErrorCode.MISSING_MESSAGE &&
            error.code !== IntlErrorCode.INSUFFICIENT_PATH
        ) {
            console.error(error);
        }
    };

    const messages = merge(localMessages, customTranslations);

    return (
        <NextIntlClientProvider
            locale={locale || Locale.enGB}
            messages={messages}
            timeZone={DEFAULT_TIMEZONE}
            onError={onError}
        >
            {children}
        </NextIntlClientProvider>
    );
};
