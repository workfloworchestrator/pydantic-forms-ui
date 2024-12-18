/**
 * Dynamic Forms
 *
 * A hidden input component
 */

import { z } from "zod"

import { useDynamicFormsContext } from "~/dynamicForms/core"
import { FormComponent, IDFInputFieldProps } from "~/dynamicForms/types"

function DFHiddenFieldWrap({ field }: IDFInputFieldProps) {
	const { rhf } = useDynamicFormsContext()

	return <input type="hidden" {...rhf.register(field.id)} />
}

const DFHiddenField: FormComponent = {
	Element: DFHiddenFieldWrap,
	validator: () => z.string(),
}

export default DFHiddenField
