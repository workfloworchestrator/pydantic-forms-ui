/**
 * Dynamic Forms
 *
 * Checkbox component
 *
 * Generates a list of checkbox options based on the options in the field config
 */

import { ChangeEvent } from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { z } from "zod"

import DfFieldWrap from "~/dynamicForms/components/fields/Wrap"
import { DFFieldController } from "~/dynamicForms/components/render/DfFieldController"
import { FormComponent, IDynamicFormField } from "~/dynamicForms/types"
import AgreeFieldCheckbox from "~/components/form/AgreeFieldCheckbox"

function DhfCtrldDFAgreeField(dfFieldConfig: IDynamicFormField) {
	const onLabel = dfFieldConfig.options?.[0]
	const offLabel = dfFieldConfig.options?.[1]

	const getActualValue = (state: boolean) => {
		if (typeof onLabel === undefined || typeof offLabel === undefined) {
			return state
		}

		return state ? onLabel.value : offLabel.value
	}

	return function AgreeField({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
			// if the values are strings, they should be stored as strings
			field.onChange(getActualValue(e.target.checked))
		}

		// switch requires a boolean as checked value
		const isChecked = field.value === onLabel.value

		return (
			<div className="agree-field">
				<DfFieldWrap field={dfFieldConfig}>
					<AgreeFieldCheckbox
						key={`${dfFieldConfig.id}-field`}
						label={
							dfFieldConfig.attributes.isAgreeField?.label ?? "Ik ga akkoord"
						}
						checked={isChecked}
						value={onLabel.value ?? "Ja"}
						onChange={onChangeHandler}
						disabled={!!dfFieldConfig.attributes.disabled}
						name={dfFieldConfig.id}
					/>
				</DfFieldWrap>
			</div>
		)
	}
}

const DFAgreeField: FormComponent = {
	Element: DFFieldController(DhfCtrldDFAgreeField),
	validator: () => z.string(),
}

export default DFAgreeField
