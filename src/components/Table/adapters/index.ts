// Exportaciones principales de adaptadores
export { BaseAdapter, ConfigurableBaseAdapter } from './BaseAdapter';
export type { AdapterFactory, AdapterConfig } from './BaseAdapter';

export {
    ZustandAdapter,
    useZustandAdapter,
    ZustandAdapterFactory,
    ZustandAdapterDebug,
} from './ZustandAdapter';

export {
    ServerActionAdapter,
    useServerActionAdapter,
    ServerActionAdapterFactory,
    ServerActionAdapterDebug,
    useMultipleServerActions,
} from './ServerActionAdapter';
