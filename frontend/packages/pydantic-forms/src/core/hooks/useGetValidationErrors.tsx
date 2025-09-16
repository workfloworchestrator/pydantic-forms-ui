import { useContext } from 'react';

import { PydanticFormValidationErrorContext } from '@/PydanticForm';

export const useGetValidationErrors = () => {
    const context = useContext(PydanticFormValidationErrorContext);
    return context;
};
