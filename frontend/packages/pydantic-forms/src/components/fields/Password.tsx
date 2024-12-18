/**
 * Dynamic Forms
 *
 * Text component
 */

import { Controller } from "react-hook-form"

import { DhfCtrldSensitive } from "~/dynamicForms/components/fields/Sensitive"
import { zodValidationPresets } from "~/dynamicForms/components/zodValidations"
import { useDynamicFormsContext } from "~/dynamicForms/core"
import {
	FormComponent,
	FormZodValidationFn,
	IDFInputFieldProps,
	IDynamicFormField,
} from "~/dynamicForms/types"

const getConfirmationFieldId = (field: IDynamicFormField) => {
	return field.id + "_INTERNAL_confirmation"
}

const incorrectPasswordMessage = "De invoer komt niet overeen"

const zodValidationRule: FormZodValidationFn = (field, rhf) => {
	const confirmationFieldId = getConfirmationFieldId(field)

	return zodValidationPresets.string(field).refine(
		(password) => {
			const confFieldValue = rhf?.getValues()[confirmationFieldId]

			const isValid = password === confFieldValue

			if (isValid) {
				rhf?.clearErrors(confirmationFieldId)
			} else {
				rhf?.setError(confirmationFieldId, {
					message: incorrectPasswordMessage,
				})
			}

			return isValid
		},
		{
			message: incorrectPasswordMessage,
		},
	)
}

const DFPasswordWithRepeat: FormComponent = {
	Element: function DFFieldControllerWrap({
		field: pwFieldConfig,
	}: IDFInputFieldProps) {
		const { rhf } = useDynamicFormsContext()

		const fieldConfirmationId = getConfirmationFieldId(pwFieldConfig)

		rhf.register(fieldConfirmationId, {
			required: pwFieldConfig.required,
			deps: [pwFieldConfig.id],
		})

		const configFieldConfig = {
			...pwFieldConfig,
			id: fieldConfirmationId,
			title: `Herhaal ${pwFieldConfig.title.toLowerCase()}`,
		}

		return (
			<>
				<Controller
					name={pwFieldConfig.id}
					control={rhf.control}
					render={DhfCtrldSensitive(pwFieldConfig)}
				/>
				<div className="mt-4">
					<Controller
						name={configFieldConfig.id}
						control={rhf.control}
						render={DhfCtrldSensitive(configFieldConfig)}
					/>
				</div>
			</>
		)
	},
	validator: zodValidationRule,
}

export default DFPasswordWithRepeat
