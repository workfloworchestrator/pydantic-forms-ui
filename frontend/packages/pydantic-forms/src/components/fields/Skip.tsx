/**
 * Dynamic Forms
 *
 * Skip component
 *
 * Used to visually break the grid so we can have an empty area.
 * All the fields are span6, so this will ensure there will be only 1 field
 * on a specific row
 */

import { FormComponent } from "~/dynamicForms/types"

const DFSkipField: FormComponent = {
	Element() {
		return <div></div>
	},
}

export default DFSkipField
