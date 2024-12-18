/**
 * Dynamic Forms
 *
 * Text component
 */
import type { UploadedFileReference } from "~/components/form/FileUploadDetached"
import type {
	FormComponent,
	IDFInputFieldProps,
	IDynamicFormField,
} from "~/dynamicForms/types"

import { useCallback, useEffect, useState } from "react"
import { Controller, ControllerRenderProps, FieldValues } from "react-hook-form"
import z from "zod"
import { fileSizeConverter } from "~/utils"

import DfFieldWrap from "~/dynamicForms/components/fields/Wrap"
import { useDynamicFormsContext } from "~/dynamicForms/core"
import FileUploadDetached from "~/components/form/FileUploadDetached"

function DhfCtrldFileUpload(dfFieldConfig: IDynamicFormField) {
	const { rhf } = useDynamicFormsContext()
	const [loadingProgressPercentage, setLoadingProgressPercentage] = useState(0)
	const [uploadedFile, setUploadedFile] = useState<UploadedFileReference>()

	return function TextInput({
		field,
	}: {
		field: ControllerRenderProps<FieldValues, string>
	}) {
		const changeHandle = useCallback(
			(val: UploadedFileReference) => {
				field.onChange(JSON.stringify(val))
				setUploadedFile(val)
				// it seems we need this because the 2nd error would get stale..
				// https://github.com/react-hook-form/react-hook-form/issues/8170
				// https://github.com/react-hook-form/react-hook-form/issues/10832
				rhf.trigger(field.name)
			},
			[field],
		)

		useEffect(() => {
			if (field.value) {
				setUploadedFile(JSON.parse(field.value))
			}
		}, [field.value])

		const uploadFile = (file: File) =>
			new Promise((resolve, reject) => {
				const formData = new FormData()
				formData.append("file", file)

				const request = new XMLHttpRequest()

				request.open(
					"POST",
					"/api/gateway/wfo/api/external/nis2-incident/spooled-upload/",
				)

				request.upload.addEventListener("progress", (event) => {
					if (event.lengthComputable) {
						const percent = Math.round((event.loaded / event.total) * 100)
						setLoadingProgressPercentage(percent)
					}
				})

				request.send(formData)
				request.onload = () => {
					if (request.status >= 200 && request.status < 300) {
						const response = JSON.parse(request.responseText)
						changeHandle({
							name: file.name,
							size: file.size,
							type: file.type,
							url: response.url,
						})
						resolve(response)
					} else {
						reject(request.statusText)
					}
				}
			})

		const removeFile = useCallback(async () => {
			field.onChange("")
			setUploadedFile(undefined)

			return true
		}, [field])

		return (
			<DfFieldWrap field={dfFieldConfig}>
				<FileUploadDetached
					removeFile={removeFile}
					uploadFile={uploadFile}
					uploadedFile={uploadedFile}
					loadingProgressPercentage={loadingProgressPercentage}
					maxSize={fileSizeConverter.mb2bytes(10)}
				/>
			</DfFieldWrap>
		)
	}
}

const DFFileUpload: FormComponent = {
	Element: function DFFieldControllerWrap({ field }: IDFInputFieldProps) {
		const { rhf } = useDynamicFormsContext()

		return (
			<Controller
				name={field.id}
				control={rhf.control}
				render={DhfCtrldFileUpload(field)}
			/>
		)
	},
	validator: () => {
		return z.string({
			required_error:
				"Er moet een bestand geupload worden voor je verder kan gaan",
		})
	},
}

export default DFFileUpload
