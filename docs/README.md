# 📚 Sistema de Documentación Automática

Este directorio contiene el sistema completo de actualización automática de documentación para el proyecto.

## 🎯 Propósito

El sistema `/update-docs` mantiene automáticamente sincronizada toda la documentación del proyecto con el código actual, incluyendo:

- **CLAUDE.md**: Instrucciones para Claude Code
- **README.md**: Documentación principal del proyecto  
- **Component docs**: READMEs de componentes individuales
- **Architecture docs**: Documentación técnica

## 📁 Estructura

```
docs/
├── README.md                          # Este archivo
├── claude-commands/                   # Comandos de Claude Code
│   └── update-docs.md                # Documentación detallada del comando
├── templates/                         # Templates para generación
│   ├── claude-template.md            # Template para CLAUDE.md
│   ├── readme-template.md            # Template para README.md
│   └── component-docs-template.md    # Template para docs de componentes
├── architecture/                      # Documentación técnica
│   └── project-analyzer.md          # Lógica de análisis del proyecto
└── guides/                           # Guías de uso
    └── usage-guide.md               # Cómo usar el comando /update-docs
```

## 🚀 Inicio Rápido

### 1. Ejecutar el comando
```bash
/update-docs
```

### 2. Comandos específicos
```bash
/update-docs claude       # Solo CLAUDE.md
/update-docs readme       # Solo README.md
/update-docs components   # Solo docs de componentes
/update-docs all          # Todo (explícito)
```

## 🔧 Cómo Funciona

### Análisis Automático

El sistema analiza automáticamente:

1. **package.json** → Comandos de desarrollo y dependencias
2. **prisma/schema.prisma** → Configuración de base de datos
3. **src/** → Estructura del proyecto y componentes
4. **Configuraciones** → next.config.ts, biome.json, etc.

### Generación Inteligente

Usando templates dinámicos, genera:

1. **Contenido actualizado** basado en el código actual
2. **Preservación de secciones personalizadas** marcadas
3. **Validación de enlaces** y referencias
4. **Ejemplos funcionales** extraídos del código

### Validación Continua

Verifica automáticamente:

- ✅ Comandos en package.json funcionan
- ✅ URLs y rutas existen
- ✅ Ejemplos de código son válidos
- ✅ Interfaces están actualizadas

## 📖 Documentación Detallada

### Para Usuarios
- **[Guía de Uso](guides/usage-guide.md)** - Cómo usar el comando paso a paso
- **[Comando /update-docs](claude-commands/update-docs.md)** - Documentación completa del comando

### Para Desarrolladores
- **[Analizador de Proyecto](architecture/project-analyzer.md)** - Lógica interna del sistema
- **[Templates](templates/)** - Cómo funcionan los generadores de contenido

## 🎨 Personalización

### Secciones Personalizadas

Para preservar contenido personalizado:

```markdown
<!-- CUSTOM_SECTION_START: mi-seccion -->
Este contenido no se sobrescribirá
<!-- CUSTOM_SECTION_END: mi-seccion -->
```

### Configuración Avanzada

Crea `docs/config/update-docs.json`:

```json
{
  "analyzers": {
    "enabled": ["package", "structure", "components"],
    "disabled": ["analytics"]
  },
  "validation": {
    "strict": true,
    "validateLinks": true
  },
  "preservation": {
    "customSections": true,
    "userComments": true
  }
}
```

### Exclusión de Archivos

Crea `.update-docs-ignore`:

```
src/components/Legacy/**
docs/manual/**
**/*.temp.md
```

## 🔄 Flujo de Trabajo

### Desarrollo Regular

1. **Hacer cambios en el código**
2. **Ejecutar `/update-docs`**
3. **Revisar cambios generados**
4. **Commit de documentación actualizada**

### Automatización

```bash
# Git hook para actualización automática
echo "/update-docs" > .git/hooks/post-commit
chmod +x .git/hooks/post-commit
```

## 📊 Beneficios

### Para el Equipo
- 📖 Documentación siempre actualizada
- 🔄 Sincronización automática código-docs
- ⚡ Menos tiempo manteniendo docs manualmente
- 🎯 Ejemplos que realmente funcionan

### Para Claude Code
- 🧠 Mejor comprensión del proyecto
- 📋 Comandos y patrones actualizados
- 🔍 Arquitectura clara y correcta
- 💡 Contexto actualizado para asistencia

### Para Nuevos Desarrolladores
- 🚀 Onboarding más rápido
- 📚 Documentación confiable
- 🛠️ Ejemplos funcionales
- 🗺️ Mapeo claro del proyecto

## 🐛 Troubleshooting

### Problemas Comunes

**Error: "Command not found"**
```bash
# Verificar instalación de Claude Code
claude-code --version
ls .claude/commands/
```

**Documentación inconsistente**
```bash
# Limpiar caché y regenerar
rm -rf .claude/cache/
/update-docs all --force-refresh
```

**Permisos insuficientes**
```bash
chmod +w CLAUDE.md README.md
chmod -R +w src/components/*/README.md
```

### Logs y Debugging

Los logs se guardan en `docs/logs/update-docs.log`:

```bash
# Ver últimos logs
tail -f docs/logs/update-docs.log

# Ejecutar en modo verbose
/update-docs --verbose
```

## 🤝 Contribuir

### Mejorar Templates

1. Edita archivos en `docs/templates/`
2. Prueba con `/update-docs --dry-run`
3. Verifica que la salida sea correcta
4. Commit de los cambios

### Agregar Nuevos Analizadores

1. Revisa `docs/architecture/project-analyzer.md`
2. Implementa nuevo analizador
3. Agrega al sistema de templates
4. Actualiza documentación

### Reportar Issues

1. Incluye logs completos
2. Describe el comportamiento esperado vs actual
3. Proporciona ejemplo de reproducción
4. Especifica versión de Claude Code

## 📞 Soporte

- **Documentación**: Revisa los archivos en `docs/guides/`
- **Issues**: Reporta problemas en el repositorio
- **Logs**: Consulta `docs/logs/` para debugging
- **Configuración**: Revisa `docs/config/` para personalización

---

**🎯 Objetivo**: Mantener la documentación del proyecto siempre actualizada, precisa y útil para todos los desarrolladores y para Claude Code.

**⚡ Resultado**: Un proyecto autodocumentado que se mantiene sincronizado automáticamente con cada cambio en el código.