import { useContext } from 'react';

import { PydanticFormContext } from '@/core/PydanticFormContextProvider';

export function usePydanticFormContext() {
    const context = useContext(PydanticFormContext);

    if (context === null || context === undefined) {
        throw new Error(
            'usePydanticFormContext must be used within a PydanticFormProvider',
        );
    }

    return context;
}
