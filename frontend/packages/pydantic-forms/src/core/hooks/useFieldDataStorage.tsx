import { useContext } from 'react';

import { PydanticFormFieldDataStorageContext } from '../PydanticFieldDataStorageProvider';

export const useGetFieldDataStorage = () => {
    const fieldDataStorage = useContext(PydanticFormFieldDataStorageContext);
    return fieldDataStorage;
};
