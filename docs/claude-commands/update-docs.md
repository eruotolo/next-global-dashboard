---
description: "Actualiza automáticamente todos los archivos de documentación del proyecto"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Bash", "LS"]
argument-hint: "[optional: específica qué documentos actualizar - 'claude', 'readme', 'components', 'all']"
---

# 🔄 Actualizador Automático de Documentación

Este comando analiza el estado actual del proyecto y actualiza automáticamente toda la documentación para mantenerla sincronizada con el código.

## 🎯 ¿Qué actualiza?

### Por defecto (sin argumentos):
- **CLAUDE.md**: Comandos de desarrollo, arquitectura, patrones
- **README.md**: Instrucciones de instalación y funcionalidades
- **Documentación de componentes**: READMEs en src/components/
- **Guías técnicas**: Documentación en docs/

### Con argumentos específicos:
- `claude`: Solo CLAUDE.md
- `readme`: Solo README.md principal
- `components`: Solo documentación de componentes
- `all`: Toda la documentación (equivale a sin argumentos)

## 🚀 Proceso de actualización

### 1. Análisis del proyecto
- Escanea la estructura actual del proyecto
- Detecta cambios en dependencias (package.json)
- Analiza configuraciones (prisma, biome, next.config)
- Revisa componentes y su documentación

### 2. Sincronización de CLAUDE.md
- Actualiza comandos de desarrollo desde package.json
- Refrescha sección de arquitectura según estructura actual
- Sincroniza variables de entorno requeridas
- Actualiza patrones de desarrollo basados en el código

### 3. Regeneración de README.md
- Actualiza instrucciones de instalación
- Sincroniza descripción de funcionalidades
- Refrescha ejemplos de uso
- Actualiza sección de configuración

### 4. Documentación de componentes
- Revisa todos los READMEs en src/components/
- Actualiza ejemplos de uso según código actual
- Sincroniza interfaces y tipos
- Regenera guías de migración si es necesario

## 📋 Ejecución

```bash
# Actualizar toda la documentación
/update-docs

# Actualizar solo CLAUDE.md
/update-docs claude

# Actualizar solo README principal
/update-docs readme

# Actualizar solo documentación de componentes
/update-docs components

# Actualizar todo explícitamente
/update-docs all
```

## 🔍 Validaciones incluidas

- Verifica que los comandos en CLAUDE.md funcionen
- Valida que las URLs y rutas existan
- Comprueba que los ejemplos de código sean válidos
- Asegura consistencia entre documentos

## ⚡ Triggers automáticos

Este comando se puede ejecutar automáticamente después de:
- Cambios exitosos en la estructura del proyecto
- Actualizaciones de dependencias
- Modificaciones en componentes principales
- Cambios en configuraciones del proyecto

---

**Uso del comando**: `$ARGUMENTS` será reemplazado por el argumento proporcionado (claude/readme/components/all)

## 🔧 Implementación técnica

El comando ejecuta los siguientes pasos:

1. **Análisis inicial**:
   - Lee package.json para comandos y dependencias
   - Escanea estructura de src/ para componentes
   - Revisa configuraciones de herramientas

2. **Generación de contenido**:
   - Usa templates para cada tipo de documento
   - Extrae información actual del código
   - Mantiene formato y estructura existente

3. **Validación y actualización**:
   - Compara contenido actual vs generado
   - Solo actualiza si hay cambios significativos
   - Preserva contenido personalizado marcado

4. **Verificación final**:
   - Valida sintaxis de archivos actualizados
   - Comprueba enlaces y referencias
   - Reporta cambios realizados

## 📝 Personalización

Para personalizar el comportamiento:

- Edita los templates en `docs/templates/`
- Modifica la lógica en `docs/claude-commands/update-docs.md`
- Ajusta las validaciones según necesidades del proyecto

## 🎨 Formato de salida

El comando genera un reporte mostrando:
- ✅ Archivos actualizados exitosamente
- ⚠️ Archivos que requieren revisión manual
- ❌ Errores encontrados durante la actualización
- 📊 Estadísticas de cambios realizados