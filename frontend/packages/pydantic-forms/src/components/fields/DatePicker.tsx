/**
 * Dynamic Forms
 *
 * Datepicker of rijkshuisstijl
 */

import dayjs from "dayjs"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { z } from "zod"

import { DatePicker } from "@lib/rijkshuisstijl"
import DfFieldWrap from "~/dynamicForms/components/fields/Wrap"
import { DFFieldController } from "~/dynamicForms/components/render/DfFieldController"
import { FormComponent, IDynamicFormField } from "~/dynamicForms/types"

const dateDisplayFormat = "dd-MM-yyyy"
const dateBackendFormat = "YYYY-MM-DD"

function DhfCtrldDFDatePicker(dfFieldConfig: IDynamicFormField) {
	return function TextInput({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		const changeHandle = function (value: Date) {
			try {
				field.onChange(dayjs(value, dateBackendFormat).format("YYYY-MM-DD"))
			} catch (error) {
				console.error(error)
			}
		}

		return (
			<DfFieldWrap field={dfFieldConfig}>
				<DatePicker
					dateFormat={dateDisplayFormat}
					disabled={!!dfFieldConfig.attributes.disabled}
					selected={
						field.value ? dayjs(field.value, dateBackendFormat).toDate() : null
					}
					onChange={changeHandle}
				/>
			</DfFieldWrap>
		)
	}
}

const DFDatePicker: FormComponent = {
	Element: DFFieldController(DhfCtrldDFDatePicker),
	validator: () => {
		return z.string()
	},
}

export default DFDatePicker
