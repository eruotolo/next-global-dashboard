import { createContext, useContext } from 'react';

interface TableContextProps {
    refreshData: () => Promise<void> | void;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

export const TableContextProvider = TableContext.Provider;

export const useTableContext = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTableContext debe ser usado dentro de un TableContextProvider');
    }
    return context;
};
