'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { FormState } from './types/form';

const FormStateContext = createContext<FormState | null>(null);

export function FormStateProvider({ state, children }: { state: FormState; children: ReactNode }) {
    return <FormStateContext.Provider value={state}>{children}</FormStateContext.Provider>;
}

export function useFormStateContext() {
    const context = useContext(FormStateContext);
    if (!context) {
        throw new Error('useFormStateContext must be used within FormStateProvider');
    }
    return context;
}
