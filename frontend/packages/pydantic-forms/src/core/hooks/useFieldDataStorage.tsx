import { useContext } from 'react';

import { PydanticFormFieldDataStorageContext } from '../PydanticFieldDataStorageProvider';

export const useGetFieldDataStorage = () => {
    return useContext(PydanticFormFieldDataStorageContext);
};
