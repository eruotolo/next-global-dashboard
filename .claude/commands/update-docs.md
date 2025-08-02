---
description: 'Actualiza automáticamente todos los archivos de documentación del proyecto'
allowed-tools: ['Read', 'Write', 'Edit', 'Glob', 'Bash', 'LS', 'MultiEdit']
argument-hint: '[opcional: claude|readme|components|all]'
---

# 🔄 Actualizador Automático de Documentación

Analiza el proyecto y actualiza automáticamente CLAUDE.md, README.md y documentación de componentes.

## 🎯 Uso

```bash
/update-docs              # Actualizar toda la documentación
/update-docs claude       # Solo CLAUDE.md
/update-docs readme       # Solo README.md
/update-docs components   # Solo docs de componentes
/update-docs all          # Todo (explícito)
```

## 🚀 Proceso automático

1. **Análisis del proyecto**

    - Escanea package.json para comandos y dependencias
    - Analiza estructura de src/ y componentes
    - Revisa configuraciones (prisma, biome, next.config)

2. **Actualización inteligente**

    - Genera contenido basado en código actual
    - Preserva contenido personalizado
    - Mantiene formato y estructura

3. **Validación**
    - Verifica sintaxis y enlaces
    - Comprueba que ejemplos funcionen
    - Reporta cambios realizados

## 📋 Implementación

El comando ejecutará la siguiente lógica según `$ARGUMENTS`:

### Para `claude` o sin argumentos (incluye CLAUDE.md):

```typescript
// 1. Leer configuraciones actuales
const packageJson = await Read('package.json');
const prismaSchema = await Read('prisma/schema.prisma');
const nextConfig = await Read('next.config.ts');
const biomeConfig = await Read('biome.json');

// 2. Analizar estructura del proyecto
const srcStructure = await Glob('src/**/*');
const componentsStructure = await Glob('src/components/**/*');

// 3. Extraer comandos de desarrollo
const devCommands = extractScriptsFromPackageJson(packageJson);
const prismaCommands = extractPrismaInfo(prismaSchema);

// 4. Actualizar CLAUDE.md
const claudeContent = generateClaudeContent({
    devCommands,
    architecture: analyzeProjectStructure(srcStructure),
    technologies: extractTechnologies(packageJson),
    database: extractDatabaseInfo(prismaSchema),
    environment: extractEnvVars(),
    patterns: analyzeCodePatterns(componentsStructure),
});

await Edit('CLAUDE.md', oldContent, claudeContent);
```

### Para `readme` o sin argumentos (incluye README.md):

```typescript
// 1. Analizar funcionalidades del proyecto
const features = await analyzeProjectFeatures();
const installation = await generateInstallationSteps();
const configuration = await extractConfiguration();

// 2. Generar README actualizado
const readmeContent = generateReadmeContent({
    projectName: extractProjectName(),
    description: generateDescription(features),
    installation,
    configuration,
    usage: generateUsageExamples(),
    technologies: extractTechStack(),
});

await Edit('README.md', oldContent, readmeContent);
```

### Para `components` o sin argumentos (incluye docs de componentes):

```typescript
// 1. Escanear todos los componentes
const components = await Glob('src/components/**/README.md');
const componentConfigs = await Glob('src/components/**/config.ts');

// 2. Actualizar documentación de cada componente
for (const componentPath of components) {
    const componentDir = path.dirname(componentPath);
    const componentFiles = await Glob(`${componentDir}/**/*.{ts,tsx}`);

    const updatedDocs = await generateComponentDocs({
        path: componentPath,
        files: componentFiles,
        examples: extractExamples(componentFiles),
        interfaces: extractInterfaces(componentFiles),
    });

    await Edit(componentPath, oldContent, updatedDocs);
}
```

## 🔍 Validaciones automáticas

- ✅ Comandos en package.json funcionan
- ✅ URLs y rutas existen
- ✅ Ejemplos de código son válidos
- ✅ Interfaces están actualizadas
- ✅ Enlaces internos funcionan

## 📊 Reporte de cambios

Al finalizar, el comando mostrará:

```
🔄 Documentación actualizada exitosamente

✅ Archivos actualizados:
  - CLAUDE.md (comandos, arquitectura)
  - README.md (instalación, configuración)
  - src/components/Table/docs/README.md (ejemplos)

⚠️  Requieren revisión manual:
  - docs/architecture/database.md (cambios en schema)

📊 Estadísticas:
  - 15 archivos analizados
  - 3 archivos actualizados
  - 0 errores encontrados
  - 2 minutos de ejecución
```

---

**Argumento**: `$ARGUMENTS` (claude|readme|components|all o vacío para todo)
