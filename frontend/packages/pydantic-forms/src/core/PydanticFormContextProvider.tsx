/**
 * Pydantic Forms
 *
 * The main context of a Pydantic form
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
    useApiProvider,
    usePydanticFormParser,
    useRefParser,
} from '@/core/hooks';
import useCustomDataProvider from '@/core/hooks/useCustomDataProvider';
import useCustomZodValidation from '@/core/hooks/useCustomZodValidator';
import { useLabelProvider } from '@/core/hooks/useLabelProvider';
import {
    PydanticFormContextProps,
    PydanticFormInitialContextProps,
    PydanticFormRawSchema,
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
    footerComponent,
    successNotice,
    onSuccess,
    onCancel,
    onChange,
    children,
    config,
}: PydanticFormInitialContextProps) {
    const {
        apiProvider,
        labelProvider,
        customDataProvider,
        customDataProviderCacheKey,

        onFieldChangeHandler,
        resetButtonAlternative,
        customValidationRules,
        allowUntouchedSubmit,
        skipSuccessNotice,

        cancelButton,
        componentMatcher,

        formStructureMutator,
        layoutColumnProvider,
        fieldDetailProvider,
    } = config;

    // TODO: Fix this again
    // option to enable the debug mode on the fly in the browser
    // by setting localStorage.setItem("pydanticFormsDebugMode", "true")
    // reload is required
    const debugMode = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formInputData, setFormInputData] = useState<object[]>([]);

    const addFormInputData = (formInput: object) => {
        setFormInputData((currentInputs) => {
            return [...currentInputs, formInput];
        });
    };

    const [errorDetails, setErrorDetails] =
        useState<PydanticFormValidationErrorDetails>();
    const [isFullFilled, setIsFullFilled] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // TODO: Fix leave confirmation functionality
    const [, setSaveToLeavePageInCurrentState] = useState(false);

    // fetch the labels of the form, but can also include the current form values
    const { data: formLabels, isLoading: isLoadingFormLabels } =
        useLabelProvider(labelProvider, formKey, formIdKey);

    const { data: customData, isLoading: isLoadingCustomData } =
        useCustomDataProvider(
            customDataProviderCacheKey ?? 100,
            customDataProvider,
        );

    // fetch the form definition using SWR hook
    const {
        data: apiResponse,
        isLoading: isLoadingSchema,
        error,
    } = useApiProvider(formKey, formInputData, apiProvider, metaData);

    // we cache the form scheme so when there is an error, we still have the form
    // the form is not in the error response
    const [rawSchema, setRawSchema] = useState<PydanticFormRawSchema>();

    // parse the raw scheme refs so all data is where it should be in the schema
    const { data: schema } = useRefParser('form', rawSchema);

    // extract the JSON schema to a more usable custom schema
    const formDataParsed = usePydanticFormParser(
        schema,
        formLabels?.labels,
        fieldDetailProvider,
        layoutColumnProvider,
        componentMatcher,
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

    /* TODO: Reimplement
    // prevent user from navigating away when there are unsaved changes
    const hasUnsavedData =
        !saveToLeavePageInCurrentState &&
        !isFullFilled &&
        rhf.formState.isDirty;

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

        if (skipSuccessNotice) {
            onSuccess(values, apiResponse || {});
        } else {
            setTimeout(() => {
                onSuccess?.(values, apiResponse || {});
            }, 1500); // Delay to allow notice to show first
        }
    }, [
        isFullFilled,
        skipSuccessNotice,
        onSuccess,
        rhf,
        formData,
        apiResponse,
    ]);

    // a useeffect for whenever the error response updates
    // sometimes we need to update the form,
    // some we need to update the errors
    useEffect(() => {
        if (apiResponse?.success) {
            setIsFullFilled(true);
            return;
        }

        // when we receive a form from the JSON, we fully reset the scheme
        if (apiResponse?.form) {
            setRawSchema(apiResponse.form);
            setErrorDetails(undefined);
        }

        // when we receive errors, we append to the scheme
        if (apiResponse?.validation_errors) {
            setErrorDetails(getErrorDetailsFromResponse(apiResponse));
        }

        setIsSending(false);
    }, [apiResponse, onSuccess, rhf, skipSuccessNotice]);

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
        addFormInputData(rhf?.getValues());

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
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            resetFormData();
            setErrorDetails(undefined);
            rhf.trigger();
        },
        [resetFormData, rhf],
    );

    // with this we have the possibility to have listeners for specific fields
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
        isLoadingSchema ||
        (customDataProvider ? isLoadingCustomData : false);

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
        customDataProvider,
        errorDetails,
        successNotice,
        submitForm,
        resetForm,
        cancelButton,
        skipSuccessNotice,
        allowUntouchedSubmit,
        resetButtonAlternative,
        config,
        setSaveToLeavePageInCurrentState,
    };

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
