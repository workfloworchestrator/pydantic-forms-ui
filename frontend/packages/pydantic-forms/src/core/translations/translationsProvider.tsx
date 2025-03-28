import React from 'react';
import type { ReactNode } from 'react';

import { merge } from 'lodash';
import {IntlErrorCode, NextIntlClientProvider} from 'next-intl';
import nlNL from '../../messages/nl-NL.json';
import enGB from '../../messages/en-GB.json';
import {TranslationsJSON} from "@/types";

export enum Locale {
    enGB = 'en-GB',
    nlNL = 'nl-NL',
}

interface TranslationsProviderProps {
    translations: TranslationsJSON | undefined;
    children: ReactNode;
}

export const TranslationsProvider = ({
    translations,
    children,
}: TranslationsProviderProps) => {

    const locale: Locale = Locale.nlNL; // TODO: get locale from router
    const getCustomMessages = (translations: TranslationsJSON | undefined) => {
        return translations;
    }
    const getLocalMessages = (locale: Locale) => {
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
            // Missing translations are expected and normal in the context of the
            // forms module (see UserInputForm.tsx) so we silently discard them
            // TODO: Think of a place to better log missing translations keys that shouldn't be missing
            console.error(error);
        }
    };

    const messages = merge(localMessages, getCustomMessages(translations));

    return (
        <NextIntlClientProvider
            locale={locale || Locale.enGB}
            messages={messages}
            timeZone={'Europe/Amsterdam'}
            onError={onError}
        >
            {children}
        </NextIntlClientProvider>
    );
};
