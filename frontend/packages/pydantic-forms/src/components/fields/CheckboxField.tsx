import { PydanticFormControlledElementProps } from '@/types';

export const CheckboxField = ({ 
  onChange, 
  onBlur, 
  value, 
  name,
  pydanticFormField
}: PydanticFormControlledElementProps) => {
  console.log(pydanticFormField);
  return (
    <input
      type="checkbox"
      checked={value}
      onChange={() => onChange(!value)}
      onBlur={onBlur}
      name={name}
    />
  );
};