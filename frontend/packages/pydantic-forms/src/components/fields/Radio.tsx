/**
 * Dynamic Forms
 *
 * Radio component
 *
 * Generates a list of radio options based on the options in the field config
 */

import { ChangeEvent, useRef } from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { z } from "zod"

import { Radio } from "@lib/rijkshuisstijl"
import DfFieldWrap from "~/dynamicForms/components/fields/Wrap"
import { DFFieldController } from "~/dynamicForms/components/render/DfFieldController"
import { FormComponent, IDynamicFormField } from "~/dynamicForms/types"

function DhfCtrldDFRadioField(dfFieldConfig: IDynamicFormField) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fieldValueRef = useRef<any[]>([])

	return function TextInput({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		if (field.value) fieldValueRef.current = field.value

		function changeHandler(e: ChangeEvent<HTMLInputElement>) {
			field.onChange(e.target.value)
		}

		return (
			<DfFieldWrap field={dfFieldConfig}>
				{dfFieldConfig.options.map((option) => (
					<Radio
						key={dfFieldConfig.id + option.value}
						label={option.label}
						checked={field.value === option.value}
						value={option.value}
						onChange={changeHandler}
						name={dfFieldConfig.id}
					/>
				))}
			</DfFieldWrap>
		)
	}
}

const DFRadioField: FormComponent = {
	Element: DFFieldController(DhfCtrldDFRadioField),
	validator: () => z.string(),
}

export default DFRadioField
