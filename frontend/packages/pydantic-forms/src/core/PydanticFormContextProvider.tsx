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
    PydanticFormFieldType,
    PydanticFormSchemaRawJson,
    PydanticFormValidationErrorDetails,
    PydanticFormsContextConfig,
} from '@/types';
import { getHashForArray } from '@/utils';

export const PydanticFormContext =
    createContext<PydanticFormContextProps | null>(null);

export interface PydanticFormContextProviderProps {
    children: (props: PydanticFormContextProps) => React.ReactNode;
    config: PydanticFormsContextConfig;
    formKey: string;
    onCancel?: () => void;
    onSuccess?: (fieldValues: FieldValues, response: object) => void;
    title?: string;
}

function PydanticFormContextProvider({
    children,
    config,
    formKey,
    onCancel,
    onSuccess,
    title,
}: PydanticFormContextProviderProps) {
    const {
        apiProvider,
        componentMatcherExtender,
        customDataProvider,
        customDataProviderCacheKey,
        labelProvider,
        locale,
    } = config;

    const [formInputHistory, setFormInputHistory] = useState(
        new Map<string, object>(),
    );
    const [formInputData, setFormInputData] = useState<object[]>([]);

    const formRef = useRef<string>(formKey);

    const updateHistory = useCallback(
        async (formInput: object, previousSteps: object[]) => {
            const hashOfPreviousSteps = await getHashForArray(previousSteps);
            setFormInputHistory((prevState) =>
                prevState.set(hashOfPreviousSteps, formInput),
            );
        },
        [],
    );

    const goToPreviousStep = (formInput: object) => {
        setFormInputData((prevState) => {
            updateHistory(formInput, prevState);
            return prevState.slice(0, -1);
        });
    };

    const [errorDetails, setErrorDetails] =
        useState<PydanticFormValidationErrorDetails>();

    const [isFullFilled, setIsFullFilled] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // fetch the labels of the form, can also contain default values
    const { data: formLabels, isLoading: isLoadingFormLabels } =
        useLabelProvider(labelProvider, formKey);

    // fetch custom data
    const { data: customData, isLoading: isLoadingCustomData } =
        useCustomDataProvider(
            customDataProviderCacheKey ?? 100,
            customDataProvider,
        );

    // fetch API response with form definition
    const {
        data: apiResponse,
        isLoading: isLoadingSchema,
        error,
    } = useApiProvider(formKey, formInputData, apiProvider);

    const emptyRawSchema: PydanticFormSchemaRawJson = useMemo(
        () => ({
            type: PydanticFormFieldType.OBJECT,
            properties: {},
        }),
        [],
    );

    const [rawSchema, setRawSchema] =
        useState<PydanticFormSchemaRawJson>(emptyRawSchema);
    const [hasNext, setHasNext] = useState<boolean>(false);

    // extract the JSON schema to a more usable custom schema
    const { pydanticFormSchema, isLoading: isParsingSchema } =
        usePydanticFormParser(rawSchema, formLabels?.labels);

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
    const reactHookForm = useForm({
        resolver: zodResolver(zodSchema),
        mode: 'all',
        defaultValues: initialData,
        values: initialData,
    });

    const awaitReset = useCallback(
        async (payLoad?: FieldValues) => {
            getHashForArray(formInputData).then(async (hash) => {
                let resetPayload = {};

                if (payLoad) {
                    resetPayload = { ...payLoad };
                } else {
                    const currentStepFromHistory = formInputHistory.get(hash);

                    if (currentStepFromHistory) {
                        resetPayload = { ...currentStepFromHistory };
                    }
                }
                reactHookForm.reset(resetPayload);
                await new Promise((resolve) => setTimeout(resolve, 0)); // wait one tick
            });
        },

        [formInputData, formInputHistory, reactHookForm],
    );

    const addFormInputData = useCallback(
        (formInput: object, replaceInsteadOfAdd = false) => {
            setFormInputData((currentInputs) => {
                const data = replaceInsteadOfAdd
                    ? currentInputs.slice(0, -1)
                    : currentInputs;
                updateHistory(formInput, data);
                return [...data, { ...formInput }];
            });
            awaitReset();
        },
        [awaitReset, setFormInputData, updateHistory],
    );

    const submitFormFn = useCallback(() => {
        setIsSending(true);
        const reactHookFormValues = _.cloneDeep(reactHookForm.getValues());
        awaitReset();
        // Note. If we don't use cloneDeep here we are adding a reference to the reactHookFormValues
        // that changes on every change in the form and triggering effects before we want to.
        addFormInputData(reactHookFormValues, !!errorDetails);
        window.scrollTo(0, 0);
    }, [
        reactHookForm,
        errorDetails,
        addFormInputData,
        awaitReset,
        setIsSending,
    ]);

    const onClientSideError = useCallback(
        (data?: FieldValues) => {
            // TODO implement save with errors toggle
            if (data) {
                reactHookForm.clearErrors();
                submitFormFn();
            }
        },
        [reactHookForm, submitFormFn],
    );

    const submitForm = reactHookForm.handleSubmit(
        submitFormFn,
        onClientSideError,
    );

    const resetForm = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setErrorDetails(undefined);
            awaitReset();
            reactHookForm.trigger();
        },
        [awaitReset, reactHookForm],
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
        setRawSchema(emptyRawSchema);
        setHasNext(false);
    }, [emptyRawSchema]);

    const fieldDataStorageRef = useRef<Map<string, Map<string, unknown>>>(
        new Map(),
    );

    const fieldDataStorage = useMemo(
        () => ({
            has: (fieldId: string, key: string | number) => {
                if (
                    fieldDataStorageRef.current &&
                    fieldDataStorageRef.current.has(fieldId)
                ) {
                    const fieldStorage =
                        fieldDataStorageRef.current.get(fieldId);
                    return fieldStorage?.has(key.toString()) ?? false;
                }
                return false;
            },
            get: (fieldId: string, key: string | number) => {
                const fieldData = fieldDataStorageRef?.current?.get(fieldId);
                return fieldData?.get(key.toString());
            },
            set: (fieldId: string, key: string | number, value: unknown) => {
                fieldDataStorageRef.current.set(
                    fieldId,
                    new Map([[key.toString(), value]]),
                );
            },
            delete: (fieldId: string) => {
                if (fieldDataStorageRef.current?.has(fieldId)) {
                    fieldDataStorageRef.current.delete(fieldId);
                }
            },
        }),
        [],
    );

    const PydanticFormContextState = {
        // to prevent an issue where the sending state hangs
        // we check both the SWR hook state as our manual state
        clearForm,
        config,
        customDataProvider,
        errorDetails,
        fieldDataStorage,
        formInputData,
        formKey,
        hasNext,
        initialData,
        isFullFilled,
        isLoading,
        isSending: isSending && isLoadingSchema,
        onCancel,
        onPrevious: () => goToPreviousStep(reactHookForm?.getValues()),
        pydanticFormSchema,
        reactHookForm,
        resetErrorDetails,
        resetForm,
        submitForm,
        title,
    };

    // useEffect to handle API responses
    useEffect(() => {
        if (!apiResponse) {
            return;
        }
        // when we receive errors, we append to the scheme
        if (apiResponse?.validation_errors) {
            // Restore the data we got the error with
            const errorPayload = [...formInputData].pop();
            awaitReset(errorPayload);
            setErrorDetails(getErrorDetailsFromResponse(apiResponse));
            return;
        }

        awaitReset();
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

        setIsSending(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiResponse]); // Avoid completing the dependencies array here to avoid unwanted resetFormData calls

    // Useeffect to the form input data if the formKey changes
    useEffect(() => {
        if (formKey !== formRef.current) {
            setFormInputData([]);
            setFormInputHistory(new Map<string, object>());
            awaitReset({});
            formRef.current = formKey;
        }
    }, [awaitReset, formKey]);

    // UseEffect to handle successfull submits
    useEffect(() => {
        if (!isFullFilled) {
            return;
        }

        if (onSuccess) {
            const values = reactHookForm.getValues();
            onSuccess(values, apiResponse || {});
        }

        setFormInputHistory(new Map<string, object>());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiResponse, isFullFilled]); // Avoid completing the dependencies array here to avoid unwanted resetFormData calls

    // UseEffect to handles errors throws by the useApiProvider call
    // for instance unexpected 500 errors
    useEffect(() => {
        if (!error) {
            return;
        }

        setErrorDetails({
            detail: 'Something unexpected went wrong',
            source: [],
            mapped: {},
        });
    }, [error]);

    // UseEffect to handle locale change
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
