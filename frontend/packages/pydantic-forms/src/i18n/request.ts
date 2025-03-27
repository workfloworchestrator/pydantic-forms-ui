import {getRequestConfig} from 'next-intl/server';
import nlNL from '../messages/nl.json';


export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    const locale = 'nl';

    console.log("NLNL", nlNL);

    return {
        locale,
        messages: nlNL.footer
    };
});
