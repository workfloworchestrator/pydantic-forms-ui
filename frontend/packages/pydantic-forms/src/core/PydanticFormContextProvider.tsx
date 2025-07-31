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

    const awaitReset = async (payLoad: FieldValues = {}) => {
        rhf.reset(payLoad);
        await new Promise((resolve) => setTimeout(resolve, 0)); // wait one tick
    };

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

    const emptyRawSchema: PydanticFormSchemaRawJson = {
        type: PydanticFormFieldType.OBJECT,
        properties: {},
    };
    const [rawSchema, setRawSchema] =
        useState<PydanticFormSchemaRawJson>(emptyRawSchema);
    const [hasNext, setHasNext] = useState<boolean>(false);

    // extract the JSON schema to a more usable custom schema
    const { pydanticFormSchema, isLoading: isParsingSchema } =
        usePydanticFormParser(rawSchema, formKey, formLabels?.labels);

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
    });

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
        const rhfValues = _.cloneDeep(rhf.getValues());
        awaitReset();
        // Note. If we don't use cloneDeep here we are adding a reference to the rhfValues
        // that changes on every change in the form and triggering effects before we want to.
        addFormInputData(rhfValues, !!errorDetails);
        window.scrollTo(0, 0);
    }, [rhf, errorDetails, addFormInputData, awaitReset, setIsSending]);

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
            awaitReset();
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
        setRawSchema(emptyRawSchema);
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

    // a useeffect for whenever the error response updates
    // sometimes we need to update the form,
    // some we need to update the errors
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
    // a useeffect for filling data whenever formdefinition or labels update
    return (
        <PydanticFormContext.Provider value={PydanticFormContextState}>
            {children(PydanticFormContextState)}
        </PydanticFormContext.Provider>
    );
}

export default PydanticFormContextProvider;
