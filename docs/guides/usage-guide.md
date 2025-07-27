# 📖 Guía de Uso del Comando `/update-docs`

Esta guía explica cómo utilizar el comando de actualización automática de documentación.

## 🚀 Comando Básico

```bash
/update-docs
```

Este comando ejecutará una actualización completa de toda la documentación del proyecto.

## 🎯 Comandos Específicos

### Actualizar solo CLAUDE.md
```bash
/update-docs claude
```

**¿Cuándo usar?**
- Después de agregar nuevos comandos npm/bun
- Cuando cambies la arquitectura del proyecto
- Al actualizar dependencias principales
- Después de modificar configuraciones (prisma, biome, etc.)

**¿Qué actualiza?**
- Comandos de desarrollo desde package.json
- Sección de arquitectura y tecnologías
- Variables de entorno requeridas
- Patrones de desarrollo actuales

### Actualizar solo README.md
```bash
/update-docs readme
```

**¿Cuándo usar?**
- Después de agregar nuevas funcionalidades
- Cuando cambies las instrucciones de instalación
- Al modificar la configuración del proyecto
- Para actualizar ejemplos de uso

**¿Qué actualiza?**
- Descripción de funcionalidades
- Instrucciones de instalación
- Stack tecnológico
- Configuración de variables de entorno

### Actualizar documentación de componentes
```bash
/update-docs components
```

**¿Cuándo usar?**
- Después de crear nuevos componentes
- Cuando cambies interfaces o props
- Al agregar nuevos ejemplos
- Para sincronizar documentación con código

**¿Qué actualiza?**
- READMEs de componentes individuales
- Ejemplos de uso actualizados
- Interfaces y tipos
- Guías de migración

### Actualización completa explícita
```bash
/update-docs all
```

Equivale a ejecutar el comando sin argumentos, pero es más explícito.

## 📊 Proceso de Ejecución

### 1. Análisis Inicial
El comando ejecuta los siguientes pasos automáticamente:

```
🔍 Analizando proyecto...
├── 📦 Leyendo package.json
├── 🗄️  Analizando schema de Prisma  
├── 📁 Escaneando estructura src/
├── ⚙️  Revisando configuraciones
└── 🧩 Analizando componentes
```

### 2. Generación de Contenido
```
📝 Generando documentación...
├── 🎯 CLAUDE.md (comandos + arquitectura)
├── 📖 README.md (instalación + features)
├── 🧩 Docs de componentes (ejemplos + APIs)
└── 🔗 Verificando enlaces y referencias
```

### 3. Validación y Reporte
```
✅ Documentación actualizada exitosamente

📊 Resumen de cambios:
├── CLAUDE.md: ✅ Actualizado (comandos, env vars)
├── README.md: ✅ Actualizado (features, tech stack)
├── src/components/Table/docs/README.md: ✅ Actualizado
├── src/components/Modal/README.md: ⚠️  Requiere revisión
└── 15 archivos analizados, 3 actualizados, 0 errores

⏱️  Tiempo total: 45 segundos
```

## 🔧 Configuración Avanzada

### Variables de Entorno del Comando

Puedes configurar el comportamiento del comando creando un archivo `docs/config/update-docs.json`:

```json
{
  "analyzers": {
    "enabled": ["package", "structure", "components", "prisma"],
    "disabled": ["analytics"]
  },
  "templates": {
    "claude": "docs/templates/claude-template.md",
    "readme": "docs/templates/readme-template.md",
    "component": "docs/templates/component-docs-template.md"
  },
  "validation": {
    "strict": true,
    "skipPatterns": ["node_modules/**", "*.test.*"],
    "validateLinks": true,
    "validateCommands": true
  },
  "preservation": {
    "customSections": true,
    "userComments": true,
    "manualChanges": true
  },
  "output": {
    "verbose": false,
    "showDiff": true,
    "backupOriginal": true
  }
}
```

### Secciones Personalizadas

Para evitar que ciertas secciones se sobrescriban, márcalas así:

```markdown
<!-- CUSTOM_SECTION_START: deployment -->
## 🚀 Deployment Personalizado

Estas instrucciones específicas no se sobrescribirán.
<!-- CUSTOM_SECTION_END: deployment -->
```

### Exclusión de Archivos

Crea un archivo `.update-docs-ignore` para excluir archivos específicos:

```
# Ignorar componentes legacy
src/components/Legacy/**
src/components/Deprecated/**

# Ignorar documentación manual
docs/manual/**
CUSTOM_README.md

# Ignorar archivos temporales
**/*.temp.md
**/*.backup.md
```

## 🎯 Mejores Prácticas

### Cuándo Ejecutar

✅ **Ejecutar siempre después de:**
- Agregar nuevos componentes
- Cambiar dependencias principales
- Modificar configuraciones del proyecto
- Actualizar interfaces o tipos importantes
- Cambios en la estructura de carpetas

⚠️ **Considerar ejecutar después de:**
- Pequeños cambios en estilos
- Modificaciones menores en componentes
- Actualizar comentarios en código
- Cambios en archivos de prueba

❌ **No es necesario ejecutar después de:**
- Cambios puramente estéticos
- Modificar archivos de configuración del editor
- Actualizar dependencias de desarrollo menores

### Flujo de Trabajo Recomendado

1. **Desarrollo normal**
   ```bash
   # Hacer cambios en el código
   git add .
   git commit -m "feat: nuevo componente UserTable"
   ```

2. **Actualizar documentación**
   ```bash
   /update-docs
   ```

3. **Revisar cambios**
   ```bash
   git diff
   # Revisar que los cambios sean correctos
   ```

4. **Commit de documentación**
   ```bash
   git add .
   git commit -m "docs: actualizar documentación automáticamente"
   ```

### Automatización con Hooks

Para automatizar la actualización, puedes agregar un git hook:

```bash
# .git/hooks/post-commit
#!/bin/bash
echo "Actualizando documentación..."
claude-code /update-docs
```

## 🐛 Solución de Problemas

### Error: "Command not found"
```bash
# Verificar que Claude Code esté instalado
claude-code --version

# Verificar que el comando esté disponible
ls .claude/commands/
```

### Error: "Template not found"
```bash
# Verificar que los templates existan
ls docs/templates/

# Recrear templates si faltan
/update-docs --rebuild-templates
```

### Error: "Permission denied"
```bash
# Verificar permisos de archivos
chmod +w CLAUDE.md README.md
chmod -R +w src/components/*/README.md
```

### Documentación inconsistente

Si la documentación generada no refleja el código actual:

1. **Limpia la caché**:
   ```bash
   rm -rf .claude/cache/
   ```

2. **Ejecuta análisis completo**:
   ```bash
   /update-docs all --force-refresh
   ```

3. **Verifica dependencias**:
   ```bash
   npm ls
   # o
   bun pm ls
   ```

### Tiempo de ejecución lento

Para proyectos grandes, puedes optimizar:

```json
{
  "performance": {
    "parallelAnalysis": true,
    "cacheResults": true,
    "incrementalUpdates": true,
    "skipUnchangedFiles": true
  }
}
```

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs: `docs/logs/update-docs.log`
2. Verifica la configuración: `docs/config/update-docs.json`
3. Ejecuta en modo verbose: `/update-docs --verbose`
4. Reporta issues en el repositorio del proyecto

---

**💡 Tip**: Ejecuta `/update-docs` regularmente para mantener tu documentación siempre actualizada y sincronizada con el código.