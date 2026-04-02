import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { PydanticFormElementProps } from 'pydantic-forms';

type Variant = 'info' | 'warning' | 'error' | 'success';

type HelpBannerSchema = {
    message: string;
    variant?: Variant;
};

const variantConfig: Record<Variant, { styles: string; Icon: typeof Info }> = {
    info: {
        styles: 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300',
        Icon: Info,
    },
    warning: {
        styles: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300',
        Icon: AlertTriangle,
    },
    error: {
        styles: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300',
        Icon: AlertCircle,
    },
    success: {
        styles: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300',
        Icon: CheckCircle,
    },
};

export const HelpBanner = ({
    pydanticFormField,
}: PydanticFormElementProps<HelpBannerSchema>) => {
    const { message, variant = 'info' } = pydanticFormField.schema;
    const { styles, Icon } = variantConfig[variant];
    return (
        <div
            className={`flex items-start my-5 gap-2.5 rounded-lg border px-4 py-3 text-sm ${styles}`}
        >
            <Icon className="mt-0.5 size-4 shrink-0" />
            <span>{message}</span>
        </div>
    );
};
