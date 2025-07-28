'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useUserRoleStore } from '@/store/userroleStore';
import { getAllUsers } from '@/actions/Settings/Users';
import { getAllRoles } from '@/actions/Settings/Roles';
import { getAllTickets } from '@/actions/Settings/Tickets/queries';
import type { DataSourceConfig } from '../types/TableConfig';

// Registro de stores Zustand disponibles
const ZUSTAND_STORES = {
    useUserRoleStore,
    // Agregar más stores aquí según sea necesario
};

// Registro de server actions disponibles
const SERVER_ACTIONS = {
    getAllUsers,
    getAllRoles,
    getAllTickets,
    // Agregar más server actions aquí según sea necesario
};

// Log de depuración para verificar que las funciones están disponibles
console.log('SERVER_ACTIONS disponibles:', Object.keys(SERVER_ACTIONS));
console.log('getAllTickets disponible:', typeof getAllTickets);

// Hook para manejar datos desde Zustand store
const useZustandData = (storeConfig: any) => {
    const store = ZUSTAND_STORES[storeConfig.storeName as keyof typeof ZUSTAND_STORES];

    if (!store) {
        throw new Error(`Store ${storeConfig.storeName} no encontrado`);
    }

    const state = store();

    const data = useMemo(() => {
        if (storeConfig.dataSelector) {
            return storeConfig.dataSelector(state);
        }
        return [];
    }, [state, storeConfig.dataSelector]);

    const loading = useMemo(() => {
        if (storeConfig.loadingSelector) {
            return storeConfig.loadingSelector(state);
        }
        return false;
    }, [state, storeConfig.loadingSelector]);

    const refresh = useCallback(async () => {
        if (storeConfig.refreshAction) {
            await storeConfig.refreshAction(state);
        }
    }, [state, storeConfig.refreshAction]);

    return { data, loading, refresh };
};

// Hook para manejar datos desde server actions
const useServerActionData = <T>(actionConfig: any) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    console.log('useServerActionData - actionConfig:', actionConfig);
    console.log('useServerActionData - actionName:', actionConfig.actionName);
    console.log('useServerActionData - action:', actionConfig.action);
    console.log('useServerActionData - SERVER_ACTIONS keys:', Object.keys(SERVER_ACTIONS));

    // Normalizar: usar actionName, pero si viene como 'action', mapearlo
    const actionName = actionConfig.actionName || actionConfig.action;
    const serverAction = SERVER_ACTIONS[actionName as keyof typeof SERVER_ACTIONS];

    console.log('useServerActionData - serverAction encontrado:', typeof serverAction);

    if (!serverAction) {
        throw new Error(`Server action ${actionName} no encontrado`);
    }

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await serverAction();

            // Aplicar transformación si está configurada
            const transformedData = actionConfig.transform
                ? result.map(actionConfig.transform)
                : result;

            setData(transformedData as T[]);
        } catch (err) {
            console.error(`Error fetching data with ${actionName}:`, err);
            setError('Error al obtener los datos');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [serverAction, actionConfig.transform, actionName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    console.log('useServerActionData - fetchData type:', typeof fetchData);
    console.log('useServerActionData - fetchData:', fetchData);

    return { data, loading, error, refresh: fetchData };
};

// Hook para manejar datos desde hook personalizado
const useCustomData = <T>(customHook: () => any) => {
    return customHook();
};

// Hook principal que detecta automáticamente el tipo de fuente de datos
const useAutoData = <T>(entity: string, config?: Partial<DataSourceConfig<T>>) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Si se proporciona configuración específica, usarla
    if (config && config.type !== 'auto') {
        switch (config.type) {
            case 'zustand':
                return useZustandData(config);
            case 'server-action':
                return useServerActionData<T>(config);
            case 'local':
                if (config.customHook) {
                    return useCustomData<T>(config.customHook);
                }
                break;
        }
    }

    // Auto-detección basada en convenciones
    const autoConfig = detectDataSourceForEntity(entity);

    if (autoConfig) {
        switch (autoConfig.type) {
            case 'zustand':
                return useZustandData(autoConfig.config);
            case 'server-action':
                return useServerActionData<T>(autoConfig.config);
            default:
                // Fallback a estado local vacío
                return {
                    data: [] as T[],
                    loading: false,
                    error: null,
                    refresh: async () => {},
                };
        }
    }

    // Fallback final
    return {
        data: [] as T[],
        loading: false,
        error: null,
        refresh: async () => {},
    };
};

// Función para detectar automáticamente la fuente de datos basada en el entity
const detectDataSourceForEntity = (entity: string) => {
    const entityLower = entity.toLowerCase();

    // Detectar si debe usar Zustand (para entidades que comparten vista)
    if (entityLower === 'user' || entityLower === 'role') {
        return {
            type: 'zustand',
            config: {
                storeName: 'useUserRoleStore',
                dataSelector: (state: any) =>
                    entityLower === 'user' ? state.userData : state.rolesData,
                loadingSelector: (state: any) =>
                    entityLower === 'user' ? state.isLoadingUsers : state.isLoadingRoles,
                refreshAction: (state: any) =>
                    entityLower === 'user' ? state.fetchUsers() : state.fetchRoles(),
            },
        };
    }

    // Detectar server actions disponibles
    const serverActionMap: Record<string, any> = {
        ticket: {
            actionName: 'getAllTickets',
            transform: (ticket: any) => ({
                id: ticket.id,
                code: ticket.code,
                title: ticket.title,
                userName: ticket.userName,
                userLastName: ticket.userLastName,
                status: ticket.status,
                priority: ticket.priority,
            }),
        },
        permission: {
            actionName: 'getAllPermissions',
        },
    };

    if (serverActionMap[entityLower]) {
        return {
            type: 'server-action',
            config: serverActionMap[entityLower],
        };
    }

    // Fallback a local
    return {
        type: 'local',
        config: {},
    };
};

// Función utilitaria para registrar nuevos stores o server actions
const registerDataSource = (type: 'store' | 'action', name: string, implementation: any) => {
    if (type === 'store') {
        (ZUSTAND_STORES as any)[name] = implementation;
    } else if (type === 'action') {
        (SERVER_ACTIONS as any)[name] = implementation;
    }
};

// Hook especializado para User data (ejemplo de uso específico)
const useUserData = () => {
    return useZustandData({
        storeName: 'useUserRoleStore',
        dataSelector: (state: any) => state.userData,
        loadingSelector: (state: any) => state.isLoadingUsers,
        refreshAction: (state: any) => state.fetchUsers(),
    });
};

// Hook especializado para Role data (ejemplo de uso específico)
const useRoleData = () => {
    return useZustandData({
        storeName: 'useUserRoleStore',
        dataSelector: (state: any) => state.rolesData,
        loadingSelector: (state: any) => state.isLoadingRoles,
        refreshAction: (state: any) => state.fetchRoles(),
    });
};

// Hook especializado para Ticket data (ejemplo de uso específico)
const useTicketData = () => {
    return useServerActionData({
        actionName: 'getAllTickets',
        transform: (ticket: any) => ({
            id: ticket.id,
            code: ticket.code,
            title: ticket.title,
            userName: ticket.userName,
            userLastName: ticket.userLastName,
            status: ticket.status,
            priority: ticket.priority,
        }),
    });
};

export {
    useAutoData,
    useZustandData,
    useServerActionData,
    useCustomData,
    useUserData,
    useRoleData,
    useTicketData,
    registerDataSource,
    detectDataSourceForEntity,
};
