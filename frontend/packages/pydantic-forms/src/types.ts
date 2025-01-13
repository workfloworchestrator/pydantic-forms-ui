import React from 'react';
import type { Dispatch, FormEventHandler, SetStateAction } from 'react';
import type { FieldValues, useForm } from 'react-hook-form';

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
    formLayout?: PydanticFormLayout;
    successNotice?: React.ReactNode;
    onSuccess?: (fieldValues: FieldValues, summaryData: object) => void;
    onCancel?: () => void;
    onChange?: (fieldValues: FieldValues) => void;
    children: (props: PydanticFormContextProps) => React.ReactNode;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    hasCardWrapper?: boolean;

    config: PydanticFormsContextConfig;
}

export enum PydanticFormLayout {
    TWO_COL = 'two-col',
    ONE_COL = 'one-col',
}

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
    formLayout: PydanticFormLayout;
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
    sections: PydanticFormFieldSection[];
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
    validator?: PydanticFormZodValidationFn;
    FormElement?: PydanticFormElement;
    matchedFieldResult?: PydanticFormFieldConfig;
}

export interface PydanticFormFieldSection {
    id: string;
    title: string;
    fields: PydanticFormField[];
}

export enum PydanticFormFieldType {
    OPTGROUP = 'optGroup',
    SKIP = 'skip',
    LONG = 'long',
    HIDDEN = 'hidden',
    LABEL = 'label',
    SUMMARY = 'summary',
    ACCEPT = 'accept',
    NULL = 'null',

    DATE = 'date',
    DATETIME = 'date-time',
    OBJECT = 'object',
    STRING = 'string',
    ARRAY = 'array',
    BOOLEAN = 'boolean',
    NUMBER = 'number',
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

    LONG = 'long',
    FILE = 'file',
    MARKDOWN = 'markdown',
}

export interface PydanticFormFieldOption {
    value: string;
    label: string;
}

export interface PydanticFormApiResponsePropertyResolved {
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

    // validation props
    maxLength?: number;
    minLength?: number;
    pattern?: string;
}

export interface PydanticFormFieldValidation {
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    isNullable?: boolean;
}

export interface PydanticFormFieldAttributes {
    disabled?: boolean;
    sensitive?: boolean;
    password?: boolean;
    isAgreeField?: {
        label?: string;
    };
}

export interface PydanticFormFieldAnyOfResolved {
    items?: PydanticFormFieldAnyOfResolvedItems;
    enum?: string[];
    options?: {
        [id: string]: string;
    };
    format?: 'date' | 'date-time';
    type: PydanticFormListFieldType;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
}

export interface PydanticFormFieldAnyOfResolvedItems {
    enum: string[];
    options?: {
        [id: string]: string;
    };
    title: string;
    type: PydanticFormListFieldType;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
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

export interface PydanticFormFieldConfig {
    id: string;
    Component: PydanticFormComponent;
    matcher?: (field: PydanticFormField) => boolean;
    preventColRender?: boolean;
}
export interface PydanticFormComponent {
    Element: PydanticFormElement;
    validator?: PydanticFormZodValidationFn;
}

export type PydanticFormElement = (
    props: PydanticFormInputFieldProps,
) => JSX.Element;

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
    // use custom method to provide data for the form. This overwrites data fetched from labels endpoint
    customDataProvider?: PydanticFormDataProvider;

    // use custom method for providing labels and data
    labelProvider?: PydanticFormLabelProvider;

    // have an option to change the layout columns of fields
    layoutColumnProvider?: PydanticFormLayoutColumnProvider;

    // have an option to change the layout columns of fields
    formStructureMutator?: PydanticFormStructureMutator;

    // use a custom method for providing the form definition
    formProvider: PydanticFormProvider;

    // Extend field definitions
    fieldDetailProvider?: PydanticFormFieldDetailProvider;

    // be able to refresh the provided data
    dataProviderCacheKey?: number;

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

    disableSaveProgress?: boolean;

    footerCtaPrimaryVariant?: string;
}

export type PydanticFormDataProvider = () => Promise<PydanticFormLabels>;

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

export type PydanticFormProvider = ({
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

export interface PydanticFormApiErrorResponse {
    detail?: string;
    status: number;
    form: PydanticFormApiResponse;
    success?: boolean;
    validation_errors: IDynamicFormApiValidationError[];
}

export interface PydanticFormApiResponse extends PydanticFormApiResponseBase {
    properties: {
        [propId: string]: PydanticFormApiResponseProperty;
    };
}
export interface PydanticFormApiResponseBase {
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

export interface PydanticFormApiRefResolved
    extends PydanticFormApiResponseBase {
    properties: {
        [propId: string]: PydanticFormApiResponsePropertyResolved;
    };
}

export type CustomValidationRule = (
    fieldConfig: PydanticFormField,
    rhf?: ReturnType<typeof useForm>,
) => Zod.ZodTypeAny | undefined;

/****** // Pydantic forms renamed types ******/

export type TDynamicFormFieldOptionsType = 'anyOf' | 'allOf';

export interface IDynamicFormFieldOption {
    value: string;
    label: string;
}

export enum DfFieldFormats {
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

    LONG = 'long',
    FILE = 'file',
    MARKDOWN = 'markdown',
}

export enum DfFieldTypes {
    OPTGROUP = 'optGroup',
    SKIP = 'skip',
    LONG = 'long',
    HIDDEN = 'hidden',
    LABEL = 'label',
    SUMMARY = 'summary',
    ACCEPT = 'accept',
    NULL = 'null',

    DATE = 'date',
    DATETIME = 'date-time',
    OBJECT = 'object',
    STRING = 'string',
    ARRAY = 'array',
    BOOLEAN = 'boolean',
    NUMBER = 'number',
    TIMESTAMP = 'timestamp',
    LIST = 'list',
    DEFINED_LIST = 'defined-list',
    DEFINED_MULTI_LIST = 'defined-multi-list',
    TWO_OPTION_LIST = 'two-options-list',
}

export enum DFFieldReturnType {
    STRING = 'string',
    NUMBER = 'number',
    DATETIME = 'date-time',
}
export interface IValidationErrorDetails {
    detail: string;
    source: IDynamicFormApiValidationError[];
    mapped: {
        [fieldId: string]: {
            value: string;
            msg: string;
        };
    };
}

export enum DynamicFormsFormLayout {
    TWO_COL = 'two-col',
    ONE_COL = 'one-col',
}

export interface IDynamicFormsContextProps {
    isLoading: boolean;
    isSending: boolean;
    isFullFilled: boolean;
    rhf: ReturnType<typeof useForm>;
    errorDetails?: IValidationErrorDetails;
    formData?: IDynamicForm;
    debugMode?: boolean;
    title?: string | boolean;
    sendLabel?: string;
    onCancel?: () => void;
    cancelButton?: React.ReactNode;
    resetButtonAlternative?: React.ReactNode;
    disableSaveProgress?: boolean;
    submitForm: FormEventHandler<HTMLFormElement>;
    resetForm: (e: MouseEvent) => void;
    successNotice?: React.ReactNode;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    allowUntouchedSubmit?: boolean;
    skipSuccessNotice?: boolean;
    formLayout: DynamicFormsFormLayout;
    footerCtaPrimaryVariant?: string;
    setSaveToLeavePageInCurrentState: Dispatch<SetStateAction<boolean>>;
    hasCardWrapper?: boolean;
    config?: IDynamicFormsContextConfig;
}

export type DynamicFormsMetaData = {
    [key: string | number]: DfFieldValue;
};

export type DfFormProvider = ({
    formKey,
    requestBody,
}: {
    formKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestBody: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => Promise<Record<string, any>>;

// will return column
export type DfLayoutColumnProvider = (fieldId: string) => number;

export type DfLabelProvider = ({
    formKey,
    id,
}: {
    formKey: string;
    id?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => Promise<Record<string, any>>;

export type DfDataProvider = () => Promise<IDynamicFormsLabels>;

export type CustomValidationRuleFn = (
    fieldConfig: IDynamicFormField,
    rhf?: ReturnType<typeof useForm>,
) => Zod.ZodTypeAny | undefined;

export interface IDynamicFormsContextConfig {
    // use custom method to provide data for the form. This overwrites data fetched from labels endpoint
    dataProvider: DfDataProvider;

    // use custom method for providing labels and data
    labelProvider: DfLabelProvider;

    // have an option to change the layout columns of fields
    layoutColumnProvider?: DfLayoutColumnProvider;

    // have an option to change the layout columns of fields
    formStructureMutator?: DfFormStructureMutator;

    // use a custom method for providing the form definition
    formProvider: DfFormProvider;

    // Extend field definitions
    fieldDetailProvider?: IFieldDefinitionProvider;

    // be able to refresh the provided data
    dataProviderCacheKey?: number;

    // whenever a fieldvalue changes, do something
    onFieldChangeHandler?: onFieldChangeHandlerFn;

    // provide custom validation rules for fields
    customValidationRules?: CustomValidationRuleFn;

    // This is a temp solution for 2 different Backend implementations of pydantic forms
    // we will remove this once the backends both work the same
    // Portal backend has a hack that is a leftover from previous implementation
    // So for only that backend, we should not send the data as a array
    tmp_pydanticFormsOriginalImplementation?: boolean;

    // whether to skip the short 'successfull send notice'
    skipSuccessNotice?: boolean;

    // wheter we allow submitting the form without any changes
    allowUntouchedSubmit?: boolean;

    cancelButton?: React.ReactNode;

    resetButtonAlternative?: React.ReactNode;

    disableSaveProgress?: boolean;

    footerCtaPrimaryVariant?: string;

    tmp_allowNullableFieldResets?: boolean;
}

export interface IDynamicFormsContextInitialProps {
    formKey: string;
    formIdKey?: string;
    title?: string | boolean;
    sendLabel?: string;
    metaData?: DynamicFormsMetaData;
    formLayout: DynamicFormsFormLayout;
    successNotice?: React.ReactNode;
    onSuccess?: (fieldValues: FieldValues, summaryData: object) => void;
    onCancel?: () => void;
    onChange?: (fieldValues: FieldValues) => void;
    children: (props: IDynamicFormsContextProps) => React.ReactNode;
    headerComponent?: React.ReactNode;
    footerComponent?: React.ReactNode;
    hasCardWrapper?: boolean;

    config: IDynamicFormsContextConfig;
}

export type DfFormStructureMutator = (
    formData: IDynamicForm | false,
) => IDynamicForm | false;

export interface IFieldDefinitionProvider {
    [fieldId: string]: Partial<IDynamicFormField>;
}

export type onFieldChangeHandlerFnFieldProp = {
    name?: string;
    type?: string;
    value: DfFieldValue;
};

export type onFieldChangeHandlerFn = (
    field: onFieldChangeHandlerFnFieldProp,
    rhf: ReturnType<typeof useForm>,
) => void;

export interface TJsonSchemaRef {
    $ref: string;
}

export interface TDynamicFormFieldAnyOfDef {
    items?: TJsonSchemaRef;
    type: 'null' | 'array';
}

export type ListFieldType =
    | DfFieldTypes.STRING
    | DfFieldTypes.DATE
    | DfFieldTypes.NUMBER
    | DfFieldTypes.NULL;

export interface ITDynamicFormFieldAnyOfResolvedItems {
    enum: string[];
    options?: {
        [id: string]: string;
    };
    title: string;
    type: ListFieldType;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
}

export interface TDynamicFormFieldAnyOfResolved {
    items?: ITDynamicFormFieldAnyOfResolvedItems;
    enum?: string[];
    options?: {
        [id: string]: string;
    };
    format?: 'date' | 'date-time';
    type: ListFieldType;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
}

export interface IDynamicFormApiResponseProperty {
    type: DfFieldTypes;
    anyOf?: TDynamicFormFieldAnyOfDef[];
    default?: string | null;
    title: string;
}

export interface IDynamicFormApiResponsePropertyResolved {
    type: DfFieldTypes;

    anyOf?: TDynamicFormFieldAnyOfResolved[];
    oneOf?: TDynamicFormFieldAnyOfResolved[];
    allOf?: TDynamicFormFieldAnyOfResolved[];

    items?: ITDynamicFormFieldAnyOfResolvedItems;
    enum?: string[];
    options?: {
        [id: string]: string;
    };

    default?: string | null;
    title: string;
    format: DfFieldFormats;

    uniforms?: {
        disabled: boolean;
        sensitive: boolean;
        password: boolean;
    };

    // validation props
    maxLength?: number;
    minLength?: number;
    pattern?: string;
}

export interface IDynamicFormApiResponseBase {
    title: string;
    description: string;
    additionalProperties: boolean;
    type: 'object';
    required?: string[];
    $defs?: {
        [definitionId: string]: {
            enum: string[];
            title: string;
            type: DfFieldTypes;
        };
    };
}

export interface IDynamicFormApiResponse extends IDynamicFormApiResponseBase {
    properties: {
        [propId: string]: IDynamicFormApiResponseProperty;
    };
}

export interface IDynamicFormApiErrorResponse {
    detail?: string;
    status: number;
    form: IDynamicFormApiResponse;
    success?: boolean;
    validation_errors: IDynamicFormApiValidationError[];
}

export interface IDynamicFormApiValidationError {
    input: string;
    loc: string[];
    msg: string;
    type: string;
    url: string; //"https://errors.pydantic.dev/2.4/v/extra_forbidden"
}

export interface IDynamicFormApiRefResolved
    extends IDynamicFormApiResponseBase {
    properties: {
        [propId: string]: IDynamicFormApiResponsePropertyResolved;
    };
}

export interface IDynamicFormsLabels {
    [key: string]: string[] | number[] | string | number | null;
}

export interface IDynamicFormsLabelResponse {
    labels: IDynamicFormsLabels;
}

export interface IDynamicFormFieldValidation {
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    isNullable?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DfFieldValue = any;

export interface IDynamicFormFieldAttributes {
    disabled?: boolean;
    sensitive?: boolean;
    password?: boolean;
    isAgreeField?: {
        label?: string;
    };
}

export interface IDynamicFormField {
    id: string;
    title: string;
    description: string;
    type: DfFieldTypes;
    format: DfFieldFormats;
    options: IDynamicFormFieldOption[];
    disabledOptions?: string[];
    default?: DfFieldValue;
    columns: number;
    required: boolean;
    isEnumField: boolean;
    schemaField: IDynamicFormApiResponsePropertyResolved;
    validation: IDynamicFormFieldValidation;
    attributes: IDynamicFormFieldAttributes;
    validator?: FormZodValidationFn;
    FormElement?: FormElementComponent;
    matchedFieldResult?: DfFieldConfig;
}

export interface IDynamicFormFieldSection {
    id: string;
    title: string;
    fields: IDynamicFormField[];
}

export enum IDynamicFormState {
    NEW = 'new',
    IN_PROGRESS = 'in-progress',
    FINISHED = 'finished',
}

export interface IDynamicForm {
    title: string;
    description: string;
    state: IDynamicFormState;
    fields: IDynamicFormField[];
    sections: IDynamicFormFieldSection[];
}

export type FormZodValidationFn = (
    field: IDynamicFormField,
    rhf?: ReturnType<typeof useForm>,
) => z.ZodTypeAny;

export type FormElementComponent = (props: IDFInputFieldProps) => JSX.Element;

export interface FormComponent {
    Element: FormElementComponent;
    validator?: FormZodValidationFn;
}

export interface DfFieldConfig {
    id: string;
    Component: FormComponent;
    matcher?: (field: IDynamicFormField) => boolean;
    preventColRender?: boolean;
}

export type DfFieldsConfig = DfFieldConfig[];

export interface IDFInputFieldProps {
    field: IDynamicFormField;
}

export interface IDFZodValidationPresets {
    [type: string]: FormZodValidationFn;
}
