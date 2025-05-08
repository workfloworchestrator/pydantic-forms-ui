// import { useTranslationsQuery } from '@/rtk/endpoints/translations';
import {Locale} from "@/core/translations/translationsProvider";
// import { Locale } from '@/types';
//
import enGB from './nl.json';
import nlNL from './en.json';

export const useGetTranslationMessages = async (locale: string | undefined) => {
    // const { data, isLoading } = useTranslationsQuery({ locale: locale ?? '' });

    // const backendMessages = isLoading ? {} : data?.forms?.fields || {};

    const getLocalMessages = async () => {
        switch (locale) {
            case Locale.enGB:
                return enGB;
            case Locale.nlNL:
                return nlNL;
            default:
                return enGB;
        }
    };

    const localMessages = await getLocalMessages();

    return {
        ...localMessages,
    };
};
