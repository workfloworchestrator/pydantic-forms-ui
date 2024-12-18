/**
 * Dynamic Forms
 *
 * DateTime component, actually simple input element with type "datetime"
 * So uses browser component
 */

import { ChangeEvent } from "react"
import dayjs from "dayjs"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { z } from "zod"

import { TextField } from "@lib/rijkshuisstijl"
import DfFieldWrap from "~/dynamicForms/components/fields/Wrap"
import { DFFieldController } from "~/dynamicForms/components/render/DfFieldController"
import {
	DfFieldTypes,
	FormComponent,
	IDynamicFormField,
} from "~/dynamicForms/types"

function DhfCtrldDFDateTime(dfFieldConfig: IDynamicFormField) {
	const isTimestamp = dfFieldConfig.type === DfFieldTypes.NUMBER

	return function TextInput({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		function onchange(e?: ChangeEvent<HTMLInputElement>) {
			if (isTimestamp) {
				field.onChange(dayjs(e?.target.value).unix())
			} else {
				field.onChange(e?.target.value)
			}
		}

		let fieldValue = field.value

		if (isTimestamp && field.value) {
			fieldValue = dayjs.unix(field.value).format("YYYY-MM-DDTHH:mm:ss")
		}

		return (
			<DfFieldWrap field={dfFieldConfig}>
				<TextField
					disabled={!!dfFieldConfig.attributes.disabled}
					value={fieldValue ?? ""}
					onChange={onchange}
					type="datetime-local"
				/>
			</DfFieldWrap>
		)
	}
}

const DFDateTime: FormComponent = {
	Element: DFFieldController(DhfCtrldDFDateTime),
	validator: (field) => {
		if (field.type === DfFieldTypes.NUMBER) {
			return z.number()
		}

		return z.string()
	},
}

export default DFDateTime
