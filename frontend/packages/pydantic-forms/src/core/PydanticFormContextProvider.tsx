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
    getFormValuesFromFieldOrLabels,
    getValidationErrorDetailsFromResponse,
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
    PydanticFormApiResponseType,
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
        async (previousStepsData: object[], formInputData: object) => {
            const hashOfPreviousSteps = await getHashForArray(
                previousStepsData,
            );
            setFormInputHistory((currentState) =>
                currentState.set(hashOfPreviousSteps, formInputData),
            );
        },
        [],
    );

    const [validationErrorDetails, setValidationErrorDetails] =
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

    // fetch API response with form definition, validation errors or success
    const {
        data: apiResponse,
        isLoading: isLoadingSchema,
        error: apiError,
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

    /*
        This method resets the form and makes sure it waits for the reset to complete
        before proceeding. If it finds data in formHistory based on the hash of the previo
        us steps, it uses that data to prefill the form.
    */
    const awaitReset = useCallback(
        async (payLoad: FieldValues = {}) => {
            try {
                reactHookForm.reset(payLoad);

                // This is a workaround to we wait for the reset to complete
                // https://gemini.google.com/app/26d8662d603d6322?hl=nl
                return new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 0);
                });
            } catch (error) {
                console.error('Failed to reactHookFOrm', error);
            }
        },
        [reactHookForm],
    );

    const addFormInputData = useCallback(() => {
        setFormInputData((currentFormInputData) => {
            // Note. If we don't use cloneDeep here we are adding a reference to the reactHookFormValues
            // that changes on every change in the form and triggering effects before we want to.
            const reactHookFormValues = _.cloneDeep(reactHookForm.getValues());
            updateHistory(currentFormInputData, reactHookFormValues);
            // We call reset right after using the values to make sure
            // values in reactHookForm are cleared. This avoids some
            // race condition errors where reactHookForm data was still set where
            // we did not expect it to be.
            awaitReset();
            return [...currentFormInputData, { ...reactHookFormValues }];
        });
    }, []);

    const onSubmit = useCallback(() => {
        setIsSending(true);
        setValidationErrorDetails(undefined);
        addFormInputData();
        window.scrollTo(0, 0);
    }, []);

    const onClientSideError = useCallback(
        (data?: FieldValues) => {
            // TODO implement save with errors toggle
            if (data) {
                reactHookForm.clearErrors();
                onSubmit();
            }
        },
        [reactHookForm, onSubmit],
    );

    const goToPreviousStep = () => {
        setFormInputData((currentFormInputData) => {
            // Stores any data that is entered but not submitted yet to be
            // able to restore later
            const reactHookFormValues = _.cloneDeep(reactHookForm.getValues());
            updateHistory(currentFormInputData, reactHookFormValues);
            return currentFormInputData.slice(0, -1);
        });
    };

    const handleSubmit = reactHookForm.handleSubmit(
        onSubmit,
        onClientSideError,
    );

    const resetForm = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setValidationErrorDetails(undefined);
            awaitReset();
            reactHookForm.trigger();
        },
        [awaitReset, reactHookForm],
    );

    const isLoading =
        isLoadingFormLabels ||
        isLoadingSchema ||
        isParsingSchema ||
        (customDataProvider ? isLoadingCustomData : false);

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
        config,
        customDataProvider,
        validationErrorDetails,
        fieldDataStorage,
        formInputData,
        formKey,
        hasNext,
        initialData,
        isFullFilled,
        isLoading,
        isSending: isSending && isLoadingSchema,
        onCancel,
        onPrevious: () => goToPreviousStep(),
        pydanticFormSchema,
        reactHookForm,
        resetForm,
        handleSubmit,
        title,
        apiError,
    };

    // useEffect to handle API responses
    useEffect(() => {
        const restoreHistory = async () => {
            await getHashForArray(formInputData)
                .then((hash) => {
                    if (formInputHistory.has(hash)) {
                        awaitReset(formInputHistory.get(hash) as FieldValues);
                    } else {
                        awaitReset();
                    }
                })
                .catch(() => {
                    console.error('Failed to hash form input data');
                });
        };

        if (!apiResponse) {
            return;
        }

        if (
            apiResponse.type === PydanticFormApiResponseType.VALIDATION_ERRORS
        ) {
            // Restore the data we got the error with and remove it from
            // formInputData so we can add it again
            setFormInputData((currentData) => {
                const nextData = [...currentData];
                const errorPayload = nextData.pop();
                awaitReset(errorPayload);
                return nextData;
            });

            setValidationErrorDetails(
                getValidationErrorDetailsFromResponse(apiResponse),
            );
            return;
        }

        if (apiResponse.type === PydanticFormApiResponseType.SUCCESS) {
            setIsFullFilled(true);
            return;
        }

        if (
            apiResponse.type === PydanticFormApiResponseType.FORM_DEFINITION &&
            rawSchema !== apiResponse.form
        ) {
            setRawSchema(apiResponse.form);
            if (apiResponse.meta) {
                setHasNext(!!apiResponse.meta.hasNext);
            }
            restoreHistory();
        }

        setIsSending(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiResponse]); // Avoid completing the dependencies array here to avoid unwanted resetFormData calls

    // useEffect to the form input data if the formKey changes
    useEffect(() => {
        if (formKey !== formRef.current) {
            setFormInputData([]);
            setFormInputHistory(new Map<string, object>());
            setValidationErrorDetails(undefined);
            formRef.current = formKey;
        }
    }, [formKey]);

    // useEffect to handle successfull submits
    useEffect(() => {
        if (!isFullFilled) {
            return;
        }

        if (onSuccess) {
            const reactHookFormValues = _.cloneDeep(reactHookForm.getValues());
            onSuccess(reactHookFormValues, apiResponse || {});
        }

        setFormInputHistory(new Map<string, object>());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFullFilled]); // Avoid completing the dependencies array here to avoid unwanted resetFormData calls

    // useEffect to handle locale change
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
