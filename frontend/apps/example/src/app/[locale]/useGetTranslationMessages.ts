import { hasLocale } from 'next-intl';
import { ParamValue } from 'next/dist/server/request/params';
import { notFound } from 'next/navigation';
import { Locale, TranslationsJSON } from 'pydantic-forms';

import { routing } from '@/i18n/routing';

import enGB from '../../../messages/en-GB.json';
import nlNL from '../../../messages/nl-NL.json';

export const handleInvalidLocale = (locale: ParamValue) => {
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    return locale;
};

export const useGetTranslationMessages = (
    locale: string | undefined,
): TranslationsJSON => {
    const getLocalMessages = () => {
        switch (locale) {
            case Locale.enGB:
                return enGB;
            case Locale.nlNL:
                return nlNL;
            default:
                return enGB;
        }
    };

    const localMessages = getLocalMessages();

    return {
        ...localMessages,
    };
};
