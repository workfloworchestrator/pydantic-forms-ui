/**
 * Dynamic Forms
 *
 * A simple text field with type number
 */

import { useRef } from "react"
import { MDXEditorMethods } from "@mdxeditor/editor"
import { Controller, ControllerRenderProps, FieldValues } from "react-hook-form"

import DfFieldWrap from "~/dynamicForms/components/fields/Wrap"
import { zodValidationPresets } from "~/dynamicForms/components/zodValidations"
import { useDynamicFormsContext } from "~/dynamicForms/core"
import {
	FormComponent,
	IDFInputFieldProps,
	IDynamicFormField,
} from "~/dynamicForms/types"
import MarkdownEditor from "~/components/form/MarkdownEditor"

function DhfCtrldMarkdownField(dfFieldConfig: IDynamicFormField) {
	return function TextInput({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		const mdxEditorRef = useRef<MDXEditorMethods>(null)
		mdxEditorRef.current?.setMarkdown(field.value ?? "")

		return (
			<DfFieldWrap field={dfFieldConfig}>
				{!!dfFieldConfig.attributes.disabled ? (
					<div>{field.value}</div>
				) : (
					<MarkdownEditor
						ref={mdxEditorRef}
						markdown={field.value ?? ""}
						onChange={field.onChange}
					/>
				)}
			</DfFieldWrap>
		)
	}
}

function DfMarkdownWrap({ field }: IDFInputFieldProps) {
	const { rhf } = useDynamicFormsContext()

	return (
		<Controller
			control={rhf.control}
			name={field.id}
			render={DhfCtrldMarkdownField(field)}
		/>
	)
}

const DFMarkdownField: FormComponent = {
	Element: DfMarkdownWrap,
	validator: zodValidationPresets.string,
}

export default DFMarkdownField
