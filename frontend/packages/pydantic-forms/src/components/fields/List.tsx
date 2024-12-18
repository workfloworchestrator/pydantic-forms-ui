/**
 * Dynamic Forms
 *
 * A list component, currently only supports string children
 *
 * to enable more types we need to store the required type in schemaToFieldTypes,
 * and use the correct sub component here based on the definition in field
 */

import { useRef } from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { z } from "zod"

import { Button, TextField } from "@lib/rijkshuisstijl"
import DfFieldWrap from "~/dynamicForms/components/fields/Wrap"
import { DFFieldController } from "~/dynamicForms/components/render/DfFieldController"
import { zodValidationPresets } from "~/dynamicForms/components/zodValidations"
import { getFieldAllOfAnyOfEntry } from "~/dynamicForms/core/helper"
import {
	DfFieldTypes,
	FormComponent,
	IDynamicFormField,
	ListFieldType,
} from "~/dynamicForms/types"

const getFieldDefaultValueByType = (type: DfFieldTypes) => {
	switch (type) {
		case DfFieldTypes.STRING:
			return ""
		case DfFieldTypes.DATE:
			return new Date()
		case DfFieldTypes.NUMBER:
			return 0
	}
}

const getListFieldType = (dfFieldConfig: IDynamicFormField): ListFieldType => {
	// this is pretty dirty bit where we dive into the original field.
	// we do this because the type key is used at the top level as array,
	// but also at the lower level. Since we check these by ?? we dont have the lower
	// level type. But for this field, that is actually where the field type lives

	const getOptionsEntry = getFieldAllOfAnyOfEntry(dfFieldConfig.schemaField)

	const listFieldType = getOptionsEntry?.[0]?.items?.type

	return listFieldType ?? DfFieldTypes.STRING
}

function DhfCtrldDFListField(dfFieldConfig: IDynamicFormField) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const fieldValueRef = useRef<any[]>([])

	return function TextInput({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		if (field.value) fieldValueRef.current = field.value

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const fieldval = (field.value ?? []) as any[]
		const fieldType = getListFieldType(dfFieldConfig)

		function listChange(index: number) {
			return (value: string) => {
				fieldValueRef.current[index] = value
				field.onChange(fieldValueRef.current)
			}
		}

		function addItem(index: number) {
			return () => {
				const targetIndex = Math.max(0, index + 1)
				fieldValueRef.current.splice(
					targetIndex,
					0,
					getFieldDefaultValueByType(fieldType),
				)
				field.onChange(fieldValueRef.current)
			}
		}

		function removeItem(index: number) {
			return () => {
				field.onChange(
					fieldValueRef.current.filter(
						(item: unknown, ind: number) => ind !== index,
					),
				)
			}
		}

		return (
			<DfFieldWrap field={dfFieldConfig}>
				{fieldval.length ? (
					fieldval.map((fieldValue, fieldIndex) => (
						<div
							// eslint-disable-next-line react/no-array-index-key
							key={`field-${dfFieldConfig.id}-${fieldIndex}`}
							className="d-flex mv-2"
						>
							{fieldType === DfFieldTypes.STRING && (
								<TextField
									value={fieldValue}
									onChangeValue={listChange(fieldIndex)}
								/>
							)}

							{fieldType === DfFieldTypes.NUMBER && (
								<TextField
									value={fieldValue}
									type="number"
									onChangeValue={listChange(fieldIndex)}
								/>
							)}

							{fieldType === DfFieldTypes.DATE && (
								<TextField
									value={fieldValue}
									type="date"
									onChangeValue={listChange(fieldIndex)}
								/>
							)}

							<div className="d-flex ml-2">
								<Button onClick={addItem(fieldIndex)} type="button">
									+
								</Button>
								<Button
									onClick={removeItem(fieldIndex)}
									className="ml-1"
									type="button"
								>
									-
								</Button>
							</div>
						</div>
					))
				) : (
					<div>
						Nog geen rijen.{" "}
						<Button type="button" onClick={addItem(0)}>
							Rij toevoegen
						</Button>
					</div>
				)}
			</DfFieldWrap>
		)
	}
}

const DFListField: FormComponent = {
	Element: DFFieldController(DhfCtrldDFListField),
	validator: (field) => z.array(zodValidationPresets.string(field)),
}

export default DFListField
