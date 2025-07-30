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
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { FieldValues, useForm } from 'react-hook-form';

import _ from 'lodash';
import { z } from 'zod/v4';

import { zodResolver } from '@hookform/resolvers/zod';

import {
    getErrorDetailsFromResponse,
    getFormValuesFromFieldOrLabels,
} from '@/core/helper';
import {
    useApiProvider,
    useCustomDataProvider,
    useGetZodValidator,
    useLabelProvider,
    usePydanticFormParser,
} from '@/core/hooks';
import {
    Locale,
    PydanticFormContextProps,
    PydanticFormInitialContextProps,
    PydanticFormSchemaRawJson,
    PydanticFormValidationErrorDetails,
} from '@/types';
import { getHashForArray } from '@/utils';

export const PydanticFormContext =
    createContext<PydanticFormContextProps | null>(null);

function PydanticFormContextProvider({
    formKey,
    formIdKey,
    metaData,
    title,
    sendLabel,
    loadingComponent,
    successNotice,
    onSuccess,
    onCancel,
    children,
    config,
}: PydanticFormInitialContextProps) {
    const {
        apiProvider,
        labelProvider,
        customDataProvider,
        customDataProviderCacheKey,
        formStructureMutator,
        fieldDetailProvider,
        resetButtonAlternative,
        allowUntouchedSubmit,
        skipSuccessNotice,
        componentMatcherExtender,
        locale,
        cancelButton,
    } = config;

    const [formInputHistory, setFormInputHistory] = useState(
        new Map<string, object>(),
    );
    const [formInputData, setFormInputData] = useState<object[]>([]);

    const formRef = useRef<string>(formKey);

    const updateHistory = async (
        formInput: object,
        previousSteps: object[],
    ) => {
        const hashOfPreviousSteps = await getHashForArray(previousSteps);
        setFormInputHistory((prevState) =>
            prevState.set(hashOfPreviousSteps, formInput),
        );
    };

    const goToPreviousStep = (formInput: object) => {
        setFormInputData((prevState) => {
            updateHistory(formInput, prevState);
            return prevState.slice(0, -1);
        });
    };

    const addFormInputData = useCallback(
        (formInput: object, replaceInsteadOfAdd = false) => {
            setFormInputData((currentInputs) => {
                const data = replaceInsteadOfAdd
                    ? currentInputs.slice(0, -1)
                    : currentInputs;
                updateHistory(formInput, data);
                return [...data, formInput];
            });
        },
        [],
    );

    const [errorDetails, setErrorDetails] =
        useState<PydanticFormValidationErrorDetails>();
    const [isFullFilled, setIsFullFilled] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // fetch the labels of the form, can also contain default values
    const { data: formLabels, isLoading: isLoadingFormLabels } =
        useLabelProvider(labelProvider, formKey, formIdKey);

    const { data: customData, isLoading: isLoadingCustomData } =
        useCustomDataProvider(
            customDataProviderCacheKey ?? 100,
            customDataProvider,
        );

    const {
        data: apiResponse,
        isLoading: isLoadingSchema,
        error,
    } = useApiProvider(formKey, formInputData, apiProvider, metaData);

    const [rawSchema, setRawSchema] = useState<PydanticFormSchemaRawJson>();
    const [hasNext, setHasNext] = useState<boolean>(false);

    // extract the JSON schema to a more usable custom schema
    const { pydanticFormSchema, isLoading: isParsingSchema } =
        usePydanticFormParser(
            rawSchema,
            formLabels?.labels,
            fieldDetailProvider,
            formStructureMutator,
        );

    // build validation rules based on custom schema
    const zodSchema = useGetZodValidator(
        pydanticFormSchema,
        componentMatcherExtender,
    );

    const initialData = useMemo(() => {
        return getFormValuesFromFieldOrLabels(
            pydanticFormSchema?.properties,
            {
                ...formLabels?.data,
                ...customData,
            },
            componentMatcherExtender,
        );
    }, [
        componentMatcherExtender,
        customData,
        formLabels?.data,
        pydanticFormSchema?.properties,
    ]);

    // initialize the react-hook-form
    const rhf = useForm({
        resolver: zodResolver(zodSchema),
        mode: 'all',
        defaultValues: initialData,
        values: initialData,
        shouldUnregister: true,
    });

    const submitFormFn = useCallback(() => {
        setIsSending(true);
        const rhfValues = rhf.getValues();
        // Note. If we don't use cloneDeep here we are adding a reference to the rhfValues
        // that changes on every change in the form and triggering effects before we want to.
        addFormInputData(_.cloneDeep(rhfValues), !!errorDetails);
        window.scrollTo(0, 0);
    }, [rhf, errorDetails, addFormInputData]);

    const onClientSideError = useCallback(
        (data?: FieldValues) => {
            // TODO implement save with errors toggle
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
            setErrorDetails(undefined);
            rhf.reset();
            rhf.trigger();
        },
        [rhf],
    );

    const resetErrorDetails = useCallback(() => {
        setErrorDetails(undefined);
    }, []);

    const isLoading =
        isLoadingFormLabels ||
        isLoadingSchema ||
        isParsingSchema ||
        (customDataProvider ? isLoadingCustomData : false);

    const clearForm = useCallback(() => {
        setFormInputData([]);
        setIsFullFilled(false);
        setRawSchema(undefined);
        setHasNext(false);
    }, []);

    const PydanticFormContextState = {
        // to prevent an issue where the sending state hangs
        // we check both the SWR hook state as our manual state
        isSending: isSending && isLoadingSchema,
        isLoading,
        rhf,
        pydanticFormSchema,
        loadingComponent,
        onPrevious: () => goToPreviousStep(rhf?.getValues()),
        onCancel,
        title,
        sendLabel,
        isFullFilled,
        customDataProvider,
        errorDetails,
        resetErrorDetails,
        successNotice,
        submitForm,
        resetForm,
        cancelButton,
        skipSuccessNotice,
        allowUntouchedSubmit,
        resetButtonAlternative,
        config,
        formKey,
        formIdKey,
        clearForm,
        formInputData,
        hasNext,
        initialData,
    };

    /** UseEffects */
    useEffect(() => {
        if (formKey !== formRef.current) {
            // When the formKey changes we need to reset the form input data
            setFormInputData([]);
            setFormInputHistory(new Map<string, object>());
            formRef.current = formKey;
        }
    }, [formKey]);

    // handle successfull submits
    useEffect(() => {
        if (!isFullFilled) {
            return;
        }

        if (onSuccess) {
            const values = rhf.getValues();
            if (skipSuccessNotice) {
                onSuccess(values, apiResponse || {});
            } else {
                setTimeout(() => {
                    onSuccess?.(values, apiResponse || {});
                }, 1500); // Delay to allow notice to show first
            }
        }

        setFormInputHistory(new Map<string, object>());
    }, [apiResponse, isFullFilled, onSuccess, rhf, skipSuccessNotice]);

    // a useeffect for whenever the error response updates
    // sometimes we need to update the form,
    // some we need to update the errors
    useEffect(() => {
        if (apiResponse?.success) {
            setIsFullFilled(true);
            return;
        }

        // when we receive a new form from JSON, we fully reset the form
        if (apiResponse?.form && rawSchema !== apiResponse.form) {
            setRawSchema(apiResponse.form);
            if (apiResponse.meta) {
                setHasNext(!!apiResponse.meta.hasNext);
            }
            setErrorDetails(undefined);
        }

        // when we receive errors, we append to the scheme
        if (apiResponse?.validation_errors) {
            setErrorDetails(getErrorDetailsFromResponse(apiResponse));
        }

        setIsSending(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiResponse]); // Avoid completing the dependencies array here to avoid unwanted resetFormData calls
    // a useeffect for filling data whenever formdefinition or labels update

    useEffect(() => {
        getHashForArray(formInputData).then((hash) => {
            const currentStepFromHistory = formInputHistory.get(hash);

            if (currentStepFromHistory) {
                rhf.reset(currentStepFromHistory);
            }
        });
    }, [formInputData, formInputHistory, rhf]);

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

    useEffect(() => {
        const getLocale = () => {
            switch (locale) {
                case Locale.enGB:
                    return z.locales.en();
                case Locale.nlNL:
                    return z.locales.nl();
                default:
                    return z.locales.en();
            }
        };

        z.config(getLocale());
    }, [locale]);

    return (
        <PydanticFormContext.Provider value={PydanticFormContextState}>
            {children(PydanticFormContextState)}
        </PydanticFormContext.Provider>
    );
}

export default PydanticFormContextProvider;
