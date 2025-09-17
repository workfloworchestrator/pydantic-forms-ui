import { useContext } from 'react';

import { PydanticFormConfigContext } from '@/PydanticForm';

export const useGetConfig = () => {
    const context = useContext(PydanticFormConfigContext);
    if (!context) {
        throw new Error(
            'useGetConfig must be used within a PydanticFormConfigContext.Provider',
        );
    }
    return context;
};
