/**
 * Dynamic Forms
 *
 * The main context of a dynamic form
 *
 * This will fetch the jsonScheme, parse it, and handle form state and validation
 */
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Subscription } from 'react-hook-form/dist/utils/createSubject';

import i18next from 'i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';

import { zodResolver } from '@hookform/resolvers/zod';

import {
    getErrorDetailsFromResponse,
    getFormValuesFromFieldOrLabels,
} from '@/core/helper';
import {
    usePydanticForm,
    usePydanticFormParser,
    useRefParser,
} from '@/core/hooks';
import useCustomDataProvider from '@/core/hooks/useCustomDataProvider';
import useCustomZodValidation from '@/core/hooks/useCustomZodValidator';
import { useLabelProvider } from '@/core/hooks/useLabelProvider';
import {
    PydanticFormContextProps,
    PydanticFormData,
    PydanticFormInitialContextProps,
    PydanticFormLayout,
    PydanticFormValidationErrorDetails,
} from '@/types';

import translation from './translations/nl.json';

// lng and resources key depend on your locale.
i18next.init({
    lng: 'nl',
    resources: {
        nl: {
            zod: translation,
        },
    },
});
z.setErrorMap(zodI18nMap);

export const PydanticFormContext =
    createContext<PydanticFormContextProps | null>(null);

function PydanticFormContextProvider({
    formKey,
    formIdKey,
    metaData,
    title,
    sendLabel,
    headerComponent,
    formLayout = PydanticFormLayout.TWO_COL,
    footerComponent,
    successNotice,
    onSuccess,
    onCancel,
    onChange,
    children,
    hasCardWrapper = true,
    config,
}: PydanticFormInitialContextProps) {
    const {
        customDataProvider: dataProvider,
        labelProvider,
        formProvider,
        fieldDetailProvider,
        onFieldChangeHandler,
        dataProviderCacheKey,
        resetButtonAlternative,
        footerCtaPrimaryVariant = 'purple',
        customValidationRules,
        layoutColumnProvider,
        allowUntouchedSubmit,
        skipSuccessNotice,
        disableSaveProgress,
        formStructureMutator,
        cancelButton,
    } = config;

    // option to enable the debug mode on the fly in the browser
    // by setting localStorage.setItem("dynamicFormsDebugMode", "true")
    // reload is required
    const debugMode: boolean =
        window && localStorage
            ? localStorage.getItem('pydanticFormDebugMode') === '1'
            : false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formInputData, setFormInputData] = useState<any>([]);
    const [errorDetails, setErrorDetails] =
        useState<PydanticFormValidationErrorDetails>();
    const [isFullFilled, setIsFullFilled] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [saveToLeavePageInCurrentState, setSaveToLeavePageInCurrentState] =
        useState(false);

    console.log(saveToLeavePageInCurrentState); // Used to se hasUnsavedData

    // fetch the labels of the form, but can also include the current form values
    const { data: formLabels, isLoading: isLoadingFormLabels } =
        useLabelProvider(labelProvider, formKey, formIdKey);

    const { data: customData, isLoading: isCustomDataLoading } =
        useCustomDataProvider(dataProviderCacheKey ?? 100, dataProvider);

    // fetch the form definition using SWR hook
    const {
        data: apiErrorResp,
        isLoading: isLoadingSchema,
        error,
    } = usePydanticForm(formKey, formInputData, formProvider, metaData);

    // we cache the form scheme so when there is an error, we still have the form
    // the form is not in the error response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rawSchema, setRawSchema] = useState<any>({});

    // parse the raw scheme refs so all data is where it should be in the schema
    const { data: schema } = useRefParser('form', rawSchema);

    // extract the JSON schema to a more usable custom schema
    const formDataParsed = usePydanticFormParser(
        schema,
        formLabels?.labels,
        fieldDetailProvider,
        layoutColumnProvider,
    );
    const formData = formStructureMutator
        ? formStructureMutator(formDataParsed) // What are the use cases here, will this be solved by a layout provider?
        : formDataParsed;

    const rhfRef = useRef<ReturnType<typeof useForm>>();

    // build validation rules based on custom schema
    const resolver = useCustomZodValidation(
        formData,
        rhfRef.current,
        customValidationRules,
    );

    // initialize the react-hook-form
    const rhf = useForm({
        resolver: zodResolver(resolver),
        mode: 'all',
    });

    useEffect(() => {
        const sub = rhf.watch((values) => {
            setSaveToLeavePageInCurrentState(false);
            onChange?.(values);
        });

        return () => sub.unsubscribe();
    }, [rhf, onChange]);

    rhfRef.current = rhf;

    /* TODO: implement this
    // prevent user from navigating away when there are unsaved changes
    const hasUnsavedData =
        !saveToLeavePageInCurrentState &&
        !isFullFilled &&
        rhf.formState.isDirty;

    /* TODO: implement this
    useLeavePageConfirm(
        hasUnsavedData,
        'Er zijn aanpassingen in het formulier. \nWeet je zeker dat je de pagina wilt verlaten?',
    );
    */
    // handle successfull submits
    useEffect(() => {
        if (!isFullFilled || !onSuccess) {
            return;
        }
        const values = rhf.getValues();
        const pydanticFormData = formData as PydanticFormData;

        const summaryData = pydanticFormData.sections.map((section) => {
            return {
                ...section,
                fields: section.fields.reduce((acc, fieldId) => {
                    const field = pydanticFormData?.fields.find(({ id }) => {
                        const i = id as string;
                        const i2 = fieldId.id as string;
                        return i === i2;
                    });
                    let val = values[fieldId.id];

                    // If array of enums
                    if (Array.isArray(val)) {
                        val = values[fieldId.id].map((v: string) => {
                            return field?.options.find(
                                ({ value }) => value === v,
                            )?.label;
                        });
                    }

                    acc[fieldId.id] = {
                        label: field?.title ?? '',
                        format: field?.format,
                        value:
                            field?.options.find(({ value }) => value === val)
                                ?.label ?? val,
                        options: field?.options,
                    };

                    return acc;
                }, {} as Record<string, object>),
            };
        });

        if (skipSuccessNotice) {
            onSuccess(values, summaryData);
        } else {
            setTimeout(() => {
                onSuccess?.(values, summaryData);
            }, 1500);
        }
    }, [isFullFilled, skipSuccessNotice, onSuccess, rhf, formData]);

    // a useeffect for whenever the error response updates
    // sometimes we need to update the form,
    // some we need to update the errors
    useEffect(() => {
        if (apiErrorResp?.success) {
            setIsFullFilled(true);
            return;
        }

        // when we receive a form from the JSON, we fully reset the scheme
        if (apiErrorResp?.form) {
            setRawSchema(apiErrorResp.form);
            setErrorDetails(undefined);
        }

        // when we receive errors, we append to the scheme
        if (apiErrorResp?.validation_errors) {
            setErrorDetails(getErrorDetailsFromResponse(apiErrorResp));
        }

        setIsSending(false);
    }, [apiErrorResp, onSuccess, rhf, skipSuccessNotice]);

    const resetFormData = useCallback(() => {
        if (!formData) {
            return;
        }

        const initialData = getFormValuesFromFieldOrLabels(formData.fields, {
            ...formLabels?.data,
            ...customData,
        });

        rhf.reset(initialData);
    }, [rhf, formData, formLabels?.data, customData]);

    // a useeffect for filling data whenever formdefinition or labels update
    useEffect(() => {
        // this makes sure default values are set.
        resetFormData();
    }, [resetFormData]);

    // this is to show an error whenever there is an unexpected error from the backend
    // for instance a 500
    useEffect(() => {
        if (!error) {
            return;
        }

        setErrorDetails({
            detail: 'Er is iets misgegaan bij het verzenden.',
            source: [],
            mapped: {},
        });
    }, [error]);

    const submitFormFn = useCallback(() => {
        setIsSending(true);
        setFormInputData([rhf?.getValues()]);

        window.scrollTo(0, 0);
    }, [rhf]);

    const onClientSideError = useCallback(
        (data?: FieldValues) => {
            // TODO implement savewith errors toggle
            if (data) {
                rhf.clearErrors();
                submitFormFn();
            }
        },
        [rhf, submitFormFn],
    );

    const submitForm = rhf.handleSubmit(submitFormFn, onClientSideError);

    const resetForm = useCallback(
        (e: MouseEvent) => {
            e.preventDefault();
            resetFormData();
            setErrorDetails(undefined);
            rhf.trigger();
        },
        [resetFormData, rhf],
    );

    // with this we have the possiblity to have listeners for specific fields
    // this could be used to trigger validations of related fields, casting changes to elsewhere, etc.
    useEffect(() => {
        let sub: Subscription;

        if (onFieldChangeHandler) {
            sub = rhf.watch((value, { name, type }) => {
                onFieldChangeHandler(
                    {
                        name,
                        type,
                        value,
                    },
                    rhf,
                );
            });
        }

        return () => {
            if (sub) {
                return sub.unsubscribe();
            }
        };
    }, [rhf, onFieldChangeHandler]);

    const isLoading =
        isLoadingFormLabels ||
        isLoadingSchema ||
        (dataProvider ? isCustomDataLoading : false);

    const PydanticFormContextState = {
        // to prevent an issue where the sending state hangs
        // we check both the SWR hook state as our manual state
        isSending: isSending && isLoadingSchema,
        isLoading,
        rhf,
        formData: formData || undefined,
        headerComponent,
        footerComponent,
        onCancel,
        title,
        sendLabel,
        debugMode,
        isFullFilled,
        dataProvider,
        errorDetails,
        formLayout,
        successNotice,
        footerCtaPrimaryVariant,
        submitForm,
        resetForm,
        cancelButton,
        skipSuccessNotice,
        allowUntouchedSubmit,
        disableSaveProgress,
        resetButtonAlternative,
        config,
        hasCardWrapper,
        setSaveToLeavePageInCurrentState,
    };

    if (debugMode) {
        // eslint-disable-next-line no-console
        console.log('New context cycle', {
            resolver,
            DynamicFormsContextState: PydanticFormContextState,
        });

        const fieldWatcher = rhf.watch();
        // eslint-disable-next-line no-console
        console.log({ fieldWatcher });
    }

    return (
        <PydanticFormContext.Provider value={PydanticFormContextState}>
            {children(PydanticFormContextState)}
        </PydanticFormContext.Provider>
    );
}

export function usePydanticFormContext() {
    const context = useContext(PydanticFormContext);

    if (!context) {
        throw new Error(
            'usePydanticFormContext must be used within a PydanticFormProvider',
        );
    }

    return context;
}

export default PydanticFormContextProvider;
