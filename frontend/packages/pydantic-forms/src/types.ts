import React from 'react';
import type { Dispatch, FormEventHandler, SetStateAction } from 'react';
import type {
    ControllerRenderProps,
    FieldValues,
    useForm,
} from 'react-hook-form';

import { z } from 'zod';

/****** Pydantic forms renamed types ******/
export type PydanticFormMetaData = {
    [key: string | number]: PydanticFormFieldValue;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PydanticFormFieldValue = any;

export interface PydanticFormInitialContextProps {
    formKey: string;
    formIdKey?: string;
    title?: string | boolean;
    sendLabel?: string;
    metaData?: PydanticFormMetaData;
    successNotice?: React.ReactNode;
    onSuccess?: (fieldValues: FieldValues, response: object) => void;
    onCancel?: () => void;
    onChange?: (fieldValues: FieldValues) => void;
    children: (props: PydanticFormContextProps) => React.ReactNode;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    hasCardWrapper?: boolean;

    config: PydanticFormsContextConfig;
}

export type PydanticFormElementProps = {
    pydanticFormField: PydanticFormField;
    rhf: ReturnType<typeof useForm>;
};

export type PydanticFormElement =
    React.JSXElementConstructor<PydanticFormElementProps>;

export type PydanticFormControlledElementProps = ControllerRenderProps &
    PydanticFormElementProps;

export type PydanticFormControlledElement =
    React.JSXElementConstructor<PydanticFormControlledElementProps>;

export interface PydanticFormContextProps {
    isLoading: boolean;
    isSending: boolean;
    isFullFilled: boolean;
    rhf: ReturnType<typeof useForm>;
    errorDetails?: PydanticFormValidationErrorDetails;
    formData?: PydanticFormData;
    debugMode?: boolean;
    title?: string | boolean;
    sendLabel?: string;
    onCancel?: () => void;
    cancelButton?: React.ReactNode;
    resetButtonAlternative?: React.ReactNode;
    disableSaveProgress?: boolean;
    submitForm: FormEventHandler<HTMLFormElement>;
    resetForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    successNotice?: React.ReactNode;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    allowUntouchedSubmit?: boolean;
    skipSuccessNotice?: boolean;
    footerCtaPrimaryVariant?: string;
    setSaveToLeavePageInCurrentState: Dispatch<SetStateAction<boolean>>;
    hasCardWrapper?: boolean;
    config?: PydanticFormsContextConfig;
}

export interface PydanticFormData {
    title: string;
    description: string;
    state: PydanticFormState;
    fields: PydanticFormField[];
}

export enum PydanticFormState {
    NEW = 'new',
    IN_PROGRESS = 'in-progress',
    FINISHED = 'finished',
}

export interface PydanticFormField {
    id: string;
    title: string;
    description: string;
    type: PydanticFormFieldType;
    format: PydanticFormFieldFormat;
    options: PydanticFormFieldOption[];
    disabledOptions?: string[];
    default?: PydanticFormFieldValue;
    columns: number;
    required: boolean;
    isEnumField: boolean;
    schemaField: PydanticFormApiResponsePropertyResolved;
    validation: PydanticFormFieldValidation;
    attributes: PydanticFormFieldAttributes;
    componentMatch?: PydanticComponentMatcher;
}

export interface PydanticFormFieldSection {
    id: string;
    title: string;
    fields: PydanticFormField[];
}

export enum PydanticFormFieldType {
    // Primitive types https://json-schema.org/understanding-json-schema/reference/type
    STRING = 'string',
    INTEGER = 'integer',
    NUMBER = 'number',
    ENUM = 'enum',
    CONST = 'const',
    BOOLEAN = 'boolean',
    ARRAY = 'array',
    OBJECT = 'object',
    NULL = 'null',

    // Complex types
    OPTGROUP = 'optGroup',
    SKIP = 'skip',
    LONG = 'long',
    HIDDEN = 'hidden',

    SUMMARY = 'summary',
    ACCEPT = 'accept',
    DATE = 'date',
    DATETIME = 'date-time',
    TIMESTAMP = 'timestamp',
    LIST = 'list',
    DEFINED_LIST = 'defined-list',
    DEFINED_MULTI_LIST = 'defined-multi-list',
    TWO_OPTION_LIST = 'two-options-list',
}

export enum PydanticFormFieldFormat {
    DATE = 'date',
    HIDDEN = 'hidden',
    DATETIME = 'date-time',
    SKIP = 'skip',
    TIMESTAMP = 'timestamp',

    DEFAULT = 'text',
    DROPDOWN = 'dropdown',
    BOOLFIELD = 'boolfield',
    SELECT = 'select',
    MULTISELECT = 'multiselect',
    CHECKBOX = 'checkbox',
    RADIO = 'radio',
    SWITCH = 'switch',
    DATEPICKER = 'datepicker',
    NUMBER = 'number',
    LIST = 'list',
    LABEL = 'label',
    LONG = 'long',
    FILE = 'file',
    MARKDOWN = 'markdown',
    DIVIDER = 'divider',
}

export interface PydanticFormFieldOption {
    value: string;
    label: string;
}

export interface PydanticFormApiResponsePropertyResolved
    extends PydanticFormFieldValidation {
    type: PydanticFormFieldType;

    anyOf?: PydanticFormFieldAnyOfResolved[];
    oneOf?: PydanticFormFieldAnyOfResolved[];
    allOf?: PydanticFormFieldAnyOfResolved[];

    items?: PydanticFormFieldAnyOfResolvedItems;
    enum?: string[];
    options?: {
        [id: string]: string;
    };

    default?: string | null;
    title: string;
    format: PydanticFormFieldFormat;

    uniforms?: {
        disabled: boolean;
        sensitive: boolean;
        password: boolean;
    };
}

export interface PydanticFormFieldValidation {
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    isNullable?: boolean;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    multipleOf?: number;
}

export interface PydanticFormFieldAttributes
    extends PydanticFormFieldValidation {
    disabled?: boolean;
    sensitive?: boolean;
    password?: boolean;
    isAgreeField?: {
        label?: string;
    };
}

export interface PydanticFormFieldAnyOfResolved
    extends PydanticFormFieldValidation {
    items?: PydanticFormFieldAnyOfResolvedItems;
    enum?: string[];
    options?: {
        [id: string]: string;
    };
    format?: 'date' | 'date-time';
    type: PydanticFormListFieldType;
}
export interface PydanticFormFieldAnyOfResolvedItems
    extends PydanticFormFieldValidation {
    enum: string[];
    options?: {
        [id: string]: string;
    };
    title: string;
    type: PydanticFormListFieldType;
}

export type PydanticFormListFieldType =
    | PydanticFormFieldType.STRING
    | PydanticFormFieldType.DATE
    | PydanticFormFieldType.NUMBER
    | PydanticFormFieldType.NULL;

export interface PydanticFormValidationErrorDetails {
    detail: string;
    source: PydanticFormApiValidationError[];
    mapped: {
        [fieldId: string]: {
            value: string;
            msg: string;
        };
    };
}

export interface PydanticFormApiValidationError {
    input: string;
    loc: string[];
    msg: string;
    type: string;
    url: string; //"https://errors.pydantic.dev/2.4/v/extra_forbidden"
}

export interface PydanticComponentMatcher {
    id: string;
    ElementMatch: ElementMatch | ControlledElementMatch;
    validator?: PydanticFormZodValidationFn;
    matcher: (field: PydanticFormField) => boolean;
}

type ElementMatch = {
    Element: PydanticFormElement;
    isControlledElement: false;
};

type ControlledElementMatch = {
    Element: PydanticFormControlledElement;
    isControlledElement: true;
};

export interface PydanticFormInputFieldProps {
    field: PydanticFormField;
}
export type PydanticFormZodValidationFn = (
    field: PydanticFormField,
    rhf?: ReturnType<typeof useForm>,
) => z.ZodTypeAny;

export interface PydanticFormZodValidationPresets {
    [type: string]: PydanticFormZodValidationFn;
}

export interface PydanticFormsContextConfig {
    // use a custom method for providing the form definition
    apiProvider: PydanticFormApiProvider;

    // use custom method for providing labels and data
    labelProvider?: PydanticFormLabelProvider;

    // use custom method to provide data for the form. This overwrites data fetched from labels endpoint
    customDataProvider?: PydanticFormCustomDataProvider;
    customDataProviderCacheKey?: number;

    // whenever a fieldvalue changes, do something
    onFieldChangeHandler?: onPydanticFormFieldChangeHandlerFn;

    // provide custom validation rules for fields
    customValidationRules?: CustomValidationRule;

    // whether to skip the short 'successfull send notice'
    skipSuccessNotice?: boolean;

    // wheter we allow submitting the form without any changes
    allowUntouchedSubmit?: boolean;

    cancelButton?: React.ReactNode;

    resetButtonAlternative?: React.ReactNode;

    componentMatcher?: (
        currentMatchers: PydanticComponentMatcher[],
    ) => PydanticComponentMatcher[];

    formRenderer?: FormRenderer;

    // Extend field definitions
    fieldDetailProvider?: PydanticFormFieldDetailProvider;

    // have an option to change the layout columns of fields
    layoutColumnProvider?: PydanticFormLayoutColumnProvider;

    // have an option to change the layout columns of fields
    formStructureMutator?: PydanticFormStructureMutator;
}

export type FormRenderer = React.JSXElementConstructor<{
    pydanticFormData: PydanticFormData;
}>;

export type PydanticFormCustomDataProvider = () => Promise<PydanticFormLabels>;

export interface PydanticFormLabels {
    [key: string]: string[] | number[] | string | number | null;
}

export type PydanticFormLabelProvider = ({
    formKey,
    id,
}: {
    formKey: string;
    id?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => Promise<Record<string, any>>;

// will return column
export type PydanticFormLayoutColumnProvider = (fieldId: string) => number;

export type PydanticFormStructureMutator = (
    formData: PydanticFormData | false,
) => PydanticFormData | false;

export type PydanticFormApiProvider = ({
    formKey,
    requestBody,
}: {
    formKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestBody: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => Promise<Record<string, any>>;

export interface PydanticFormFieldDetailProvider {
    [fieldId: string]: Partial<PydanticFormField>;
}

export type onPydanticFormFieldChangeHandlerFn = (
    field: onPydanticFormFieldChangeHandlerFnFieldProp,
    rhf: ReturnType<typeof useForm>,
) => void;

export type onPydanticFormFieldChangeHandlerFnFieldProp = {
    name?: string;
    type?: string;
    value: PydanticFormFieldValue;
};

export type PydanticFormCustomValidationRuleFn = (
    fieldConfig: PydanticFormField,
    rhf?: ReturnType<typeof useForm>,
) => Zod.ZodTypeAny | undefined;

export interface PydanticFormApiResponse {
    detail?: string;
    status: number;
    form: PydanticFormSchema;
    success?: boolean;
    validation_errors: PydanticFormApiValidationError[];
}

export interface PydanticFormSchema extends PydanticFormSchemaBase {
    properties: {
        [propId: string]: PydanticFormApiResponseProperty;
    };
}
export interface PydanticFormSchemaBase {
    title: string;
    description: string;
    additionalProperties: boolean;
    type: 'object';
    required?: string[];
    $defs?: {
        [definitionId: string]: {
            enum: string[];
            title: string;
            type: PydanticFormFieldType;
        };
    };
}

export interface PydanticFormApiResponseProperty {
    type: PydanticFormFieldType;
    anyOf?: PydanticFormFieldAnyOfDef[];
    default?: string | null;
    title: string;
}

export interface PydanticFormFieldAnyOfDef {
    items?: JsonSchemaRef;
    type: 'null' | 'array';
}

export interface JsonSchemaRef {
    $ref: string;
}

export interface PydanticFormApiRefResolved extends PydanticFormSchemaBase {
    properties: {
        [propId: string]: PydanticFormApiResponsePropertyResolved;
    };
}

export type CustomValidationRule = (
    fieldConfig: PydanticFormField,
    rhf?: ReturnType<typeof useForm>,
) => Zod.ZodTypeAny | undefined;

/****** // Pydantic forms renamed types ******/
