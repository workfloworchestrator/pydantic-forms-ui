/**
 * Dynamic Forms
 *
 * Checkbox component
 *
 * Generates a list of checkbox options based on the options in the field config
 */

import { ChangeEvent, useRef } from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { z } from "zod"

import { CheckBox } from "@lib/rijkshuisstijl"
import DfFieldWrap from "~/dynamicForms/components/fields/Wrap"
import { DFFieldController } from "~/dynamicForms/components/render/DfFieldController"
import {
	FormComponent,
	IDynamicFormField,
	IDynamicFormFieldOption,
} from "~/dynamicForms/types"

function DhfCtrldDFCheckboxField(dfFieldConfig: IDynamicFormField) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fieldValueRef = useRef<any[]>([])

	return function TextInput({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		fieldValueRef.current = field.value ?? []

		function changeHandler(fieldValue: IDynamicFormFieldOption) {
			return (e: ChangeEvent<HTMLInputElement>) => {
				const curval = fieldValueRef.current ?? []

				if (e.target.checked) {
					field.onChange([...curval, fieldValue.value])
				} else {
					field.onChange(curval.filter((val) => val !== fieldValue.value))
				}
			}
		}

		return (
			<DfFieldWrap field={dfFieldConfig}>
				{dfFieldConfig.options.map((option) => (
					<CheckBox
						key={dfFieldConfig.id + option.value}
						label={option.label}
						checked={fieldValueRef.current.includes(option.value)}
						value={option}
						onChange={changeHandler(option)}
						disabled={!!dfFieldConfig.attributes.disabled}
						name={dfFieldConfig.id}
					/>
				))}
			</DfFieldWrap>
		)
	}
}

const DFCheckboxField: FormComponent = {
	Element: DFFieldController(DhfCtrldDFCheckboxField),
	validator: () => z.array(z.string()),
}

export default DFCheckboxField
