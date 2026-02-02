import React from 'react'
import { PydanticFormElementProps } from 'pydantic-forms'

export const DividerField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    return <hr data-testid={pydanticFormField.id} />
}
