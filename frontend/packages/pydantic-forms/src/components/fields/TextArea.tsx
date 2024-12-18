/**
 * Dynamic Forms
 *
 * Text component
 */

import { Controller, ControllerRenderProps, FieldValues } from "react-hook-form"

import { TextArea } from "@lib/rijkshuisstijl"
import DfFieldWrap from "~/dynamicForms/components/fields/Wrap"
import { zodValidationPresets } from "~/dynamicForms/components/zodValidations"
import { useDynamicFormsContext } from "~/dynamicForms/core"
import {
	FormComponent,
	IDFInputFieldProps,
	IDynamicFormField,
} from "~/dynamicForms/types"

function DhfCtrldTextArea(dfFieldConfig: IDynamicFormField) {
	const { rhf } = useDynamicFormsContext()

	return function TextInput({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		const changeHandle = (val: string) => {
			field.onChange(val)

			// it seems we need this because the 2nd error would get stale..
			// https://github.com/react-hook-form/react-hook-form/issues/8170
			// https://github.com/react-hook-form/react-hook-form/issues/10832
			rhf.trigger(field.name)
		}

		return (
			<DfFieldWrap field={dfFieldConfig}>
				<TextArea
					value={field.value ?? ""}
					onChange={changeHandle}
					onBlur={field.onBlur}
					disabled={!!dfFieldConfig.attributes.disabled}
				/>
			</DfFieldWrap>
		)
	}
}

const DFTextArea: FormComponent = {
	Element: function DFFieldControllerWrap({ field }: IDFInputFieldProps) {
		const { rhf } = useDynamicFormsContext()

		return (
			<Controller
				name={field.id}
				control={rhf.control}
				render={DhfCtrldTextArea(field)}
			/>
		)
	},
	validator: zodValidationPresets.string,
}

export default DFTextArea
