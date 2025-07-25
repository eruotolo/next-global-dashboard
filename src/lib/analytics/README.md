# 📊 Google Analytics Data API v1 - Configuración

Esta carpeta contiene la implementación completa de Google Analytics Data API v1 para el dashboard del panel administrativo.

## 📁 Estructura de Archivos

```
/src/lib/analytics/
├── client.ts          # Cliente de Google Analytics Data API
├── utils.ts           # Utilidades para formateo y transformación
├── test.ts            # Funciones de testing y diagnóstico
└── README.md          # Esta documentación
```

## 🔧 Configuración Requerida

### 📖 Guía Completa de Configuración

**Para configuración paso a paso detallada, consultar:**

📋 **[docs/GOOGLE_ANALYTICS_API_SETUP.md](../../../docs/GOOGLE_ANALYTICS_API_SETUP.md)**

Esta guía incluye:

- Configuración detallada de Google Cloud Console
- Creación de Service Account paso a paso
- Configuración de permisos en Google Analytics
- Troubleshooting común
- Scripts de verificación

### ⚡ Configuración Rápida

**Variables de entorno (.env.local):**

```bash
# ID de la propiedad GA4 (solo números)
GOOGLE_ANALYTICS_PROPERTY_ID="497602966"

# Credenciales del Service Account (JSON completo)
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# Intervalo de actualización (5 minutos por defecto)
ANALYTICS_REFRESH_INTERVAL=300000
```

**Pasos esenciales:**

1. **Google Cloud**: Habilitar Analytics Data API v1 + Crear Service Account
2. **Google Analytics**: Obtener Property ID + Agregar Service Account como "Viewer"
3. **Next.js**: Configurar variables de entorno + Verificar conexión

## 🧪 Testing

### Scripts de verificación

```bash
# Verificación completa (recomendado)
node scripts/verify-analytics-setup.js

# Test básico de conexión
node scripts/test-analytics.js
```

### Desde código TypeScript

```typescript
import { runAnalyticsDiagnostics, getAnalyticsStatus } from '@/lib/analytics/test';

// Diagnóstico completo (incluye conexión a API)
const diagnostics = await runAnalyticsDiagnostics();

// Solo verificar configuración (sin conexión)
const status = getAnalyticsStatus();
```

## 📊 Uso de las Server Actions

### Importar funciones

```typescript
import {
    getAnalyticsDashboardData,
    getAnalyticsMetrics,
    getAnalyticsTrends,
    testAnalyticsConnection,
} from '@/actions/Analytics';
```

### Ejemplos de uso

```typescript
// Obtener datos completos del dashboard
const dashboardData = await getAnalyticsDashboardData();

// Obtener solo métricas
const metrics = await getAnalyticsMetrics('2024-01-01', '2024-01-31');

// Probar conexión
const test = await testAnalyticsConnection();
```

## 🛠️ Funciones Principales

### `client.ts`

- `getAnalyticsClient(): BetaAnalyticsDataClient` - Cliente singleton
- `getAnalyticsConfig()` - Configuración pública
- `validateAnalyticsConfig(): boolean` - Validar configuración

### `utils.ts`

- `getDateRanges()` - Rangos de fechas predefinidos
- `transformToTrendData()` - Transformar a datos de tendencias
- `formatNumber()` - Formatear números con separadores
- `calculatePercentageChange()` - Calcular cambios porcentuales

### `test.ts`

- `checkAnalyticsConfig()` - Verificar variables de entorno
- `runAnalyticsDiagnostics()` - Diagnóstico completo
- `getAnalyticsStatus()` - Estado actual de configuración

## 🚨 Troubleshooting

### Error: "Property ID not found"

- Verificar que `GOOGLE_ANALYTICS_PROPERTY_ID` sea solo números
- Confirmar que la propiedad GA4 existe

### Error: "Invalid credentials"

- Verificar que `GOOGLE_SERVICE_ACCOUNT_KEY` sea JSON válido
- Confirmar que el Service Account tiene permisos en GA4

### Error: "API not enabled"

- Habilitar Google Analytics Data API v1 en Google Cloud Console
- Esperar unos minutos para que se propague

### Error: "Quota exceeded"

- Google Analytics tiene límites de consultas por día
- Implementar cache o reducir frecuencia de consultas

## 📚 Referencias

- [Google Analytics Data API v1](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Service Account Setup](https://cloud.google.com/iam/docs/service-accounts)
- [GA4 Property ID](https://support.google.com/analytics/answer/7372977)

## 🎯 Próximos Pasos

1. **Configurar credenciales**: Seguir [guía completa](../../../docs/GOOGLE_ANALYTICS_API_SETUP.md)
2. **Verificar setup**: `node scripts/verify-analytics-setup.js`
3. **Probar dashboard**: Ir a `/admin/dashboard`
4. **Deploy a producción**: Configurar variables de entorno en hosting

🎉 **¡Dashboard Analytics completamente implementado!**

**Características incluidas:**

- ⚡ Métricas en tiempo real (GA4)
- 📈 Gráficos interactivos (Recharts)
- 🔄 Actualización automática (5 min)
- 📱 Diseño responsive completo
- ⚙️ Estados de carga/error profesionales
