import { usePydanticFormContext } from '@/core';
import { mapFieldToComponent } from '@/core/mapFieldToComponent';
import { PydanticFormControlledElementProps } from '@/types';

export const ObjectField = ({
    onChange,
    onBlur,
    value,
    disabled,
    name,
    ref,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    const { options, id, title, type, description, format } = pydanticFormField;
    console.log(pydanticFormField);
    // const {  } = usePydanticFormContext();
    // const mapper = (fieldId: string) => {
    //     return mapFieldToComponent(
    //         fieldId,
    //         schema,
    //         formLabels,
    //         fieldDetailProvider,
    //         componentMatcher,
    //     );
    // };

    const childElements = for (let property of pydanticFormField.schemaField.properties) {
        
    }
    
    return (
        <div>
            <h1>{title}</h1>
            {childElements}
        </div>
    )
};
