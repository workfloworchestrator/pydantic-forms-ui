import {Locale, TranslationsJSON} from "pydantic-forms";
import enGB from "../../../messages/en-GB.json";
import nlNL from "../../../messages/nl-NL.json";
import {hasLocale} from "next-intl";
import {routing} from "@/i18n/routing";
import {notFound} from "next/navigation";
import {ParamValue} from "next/dist/server/request/params";

export const handleInvalidLocale = (locale: ParamValue) => {
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    return locale;
}

export const useGetTranslationMessages = (locale: string | undefined): TranslationsJSON => {

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
