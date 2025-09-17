import { useContext } from 'react';

import { PydanticFormValidationErrorContext } from '@/PydanticForm';

export const useGetValidationErrors = () => {
    return useContext(PydanticFormValidationErrorContext);
};
