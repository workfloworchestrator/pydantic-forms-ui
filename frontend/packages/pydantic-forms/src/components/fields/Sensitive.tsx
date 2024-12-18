import { Controller, ControllerRenderProps, FieldValues } from "react-hook-form"

import DfFieldWrap from "~/dynamicForms/components/fields/Wrap"
import { zodValidationPresets } from "~/dynamicForms/components/zodValidations"
import { useDynamicFormsContext } from "~/dynamicForms/core"
import { rhfTriggerValidationsOnChange } from "~/dynamicForms/core/helper"
import {
	FormComponent,
	IDFInputFieldProps,
	IDynamicFormField,
} from "~/dynamicForms/types"
import PasswordField from "~/components/form/PasswordField"

export function DhfCtrldSensitive(dfFieldConfig: IDynamicFormField) {
	const { rhf } = useDynamicFormsContext()

	return function TextInput({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		return (
			<DfFieldWrap field={dfFieldConfig}>
				<PasswordField
					value={field.value ?? ""}
					onChangeValue={rhfTriggerValidationsOnChange(rhf, field)}
					onBlur={field.onBlur}
					disabled={!!dfFieldConfig.attributes.disabled}
				/>
			</DfFieldWrap>
		)
	}
}

const DFSensitive: FormComponent = {
	Element: function DFFieldControllerWrap({ field }: IDFInputFieldProps) {
		const { rhf } = useDynamicFormsContext()

		return (
			<Controller
				name={field.id}
				control={rhf.control}
				render={DhfCtrldSensitive(field)}
			/>
		)
	},
	validator: zodValidationPresets.string,
}

export default DFSensitive
