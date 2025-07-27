# Component Documentation Template Generator

Template para generar automáticamente la documentación de componentes.

## 🔧 Variables del Template

```typescript
interface ComponentDocData {
  componentName: string;
  componentPath: string;
  description: string;
  purpose: string;
  exports: ExportInfo[];
  imports: ImportInfo[];
  interfaces: InterfaceInfo[];
  examples: ExampleInfo[];
  configuration: ConfigInfo;
  usage: UsageInfo[];
  migration?: MigrationInfo;
  troubleshooting: TroubleshootingInfo[];
}

interface ExportInfo {
  name: string;
  type: 'component' | 'hook' | 'utility' | 'type' | 'config';
  description: string;
  signature?: string;
}

interface InterfaceInfo {
  name: string;
  properties: PropertyInfo[];
  description: string;
  example: string;
}

interface ExampleInfo {
  title: string;
  description: string;
  code: string;
  result?: string;
}
```

## 📝 Template Structure

```markdown
# 📊 {{componentName}} - {{description}}

## 🎯 ¿Qué es {{componentName}}?

{{purpose}}

## 🚀 Inicio Rápido ({{quickStartTime}} minutos)

### Paso 1: {{examples.0.title}}
\`\`\`{{examples.0.language}}
{{examples.0.code}}
\`\`\`

### Paso 2: {{examples.1.title}}
\`\`\`{{examples.1.language}}
{{examples.1.code}}
\`\`\`

### Paso 3: {{examples.2.title}}
\`\`\`{{examples.2.language}}
{{examples.2.code}}
\`\`\`

{{#if examples.3}}
### Paso 4: {{examples.3.title}}
\`\`\`{{examples.3.language}}
{{examples.3.code}}
\`\`\`
{{/if}}

¡Y listo! Ya tienes {{componentName}} funcionando.

## 📚 API Reference

### Exports Principales

{{#each exports}}
#### {{this.name}}
{{this.description}}

{{#if this.signature}}
\`\`\`typescript
{{this.signature}}
\`\`\`
{{/if}}

**Tipo**: {{this.type}}
{{#if this.example}}

**Ejemplo**:
\`\`\`typescript
{{this.example}}
\`\`\`
{{/if}}

{{/each}}

### Interfaces

{{#each interfaces}}
#### {{this.name}}
{{this.description}}

\`\`\`typescript
interface {{this.name}} {
{{#each this.properties}}
  {{this.name}}{{#unless this.required}}?{{/unless}}: {{this.type}};{{#if this.description}} // {{this.description}}{{/if}}
{{/each}}
}
\`\`\`

**Ejemplo de uso**:
\`\`\`typescript
{{this.example}}
\`\`\`

{{/each}}

## ⚙️ Configuración

{{#if configuration}}
### {{configuration.title}}
{{configuration.description}}

\`\`\`typescript
{{configuration.example}}
\`\`\`

{{#each configuration.options}}
#### {{this.name}}
{{this.description}}

- **Tipo**: \`{{this.type}}\`
- **Por defecto**: \`{{this.default}}\`
{{#if this.required}}
- **Requerido**: ✅
{{else}}
- **Requerido**: ❌
{{/if}}

{{#if this.example}}
**Ejemplo**:
\`\`\`typescript
{{this.example}}
\`\`\`
{{/if}}

{{/each}}
{{/if}}

## 📖 Guías de Uso

{{#each usage}}
### {{this.title}}
{{this.description}}

{{#if this.steps}}
{{#each this.steps}}
{{@index}}. {{this}}
{{/each}}
{{/if}}

{{#if this.code}}
\`\`\`{{this.language}}
{{this.code}}
\`\`\`
{{/if}}

{{#if this.result}}
**Resultado**:
{{this.result}}
{{/if}}

{{/each}}

## 🔄 Ejemplos Completos

{{#each examples}}
### {{this.title}}
{{this.description}}

\`\`\`{{this.language}}
{{this.code}}
\`\`\`

{{#if this.explanation}}
**Explicación**:
{{this.explanation}}
{{/if}}

{{#if this.result}}
**Resultado**:
{{this.result}}
{{/if}}

---

{{/each}}

{{#if migration}}
## 🔄 Guía de Migración

{{migration.description}}

### Desde {{migration.from}} a {{migration.to}}

{{#each migration.steps}}
{{@index}}. {{this.description}}

{{#if this.before}}
**Antes**:
\`\`\`{{this.language}}
{{this.before}}
\`\`\`
{{/if}}

**Después**:
\`\`\`{{this.language}}
{{this.after}}
\`\`\`

{{/each}}

### Cambios importantes

{{#each migration.breaking}}
- ⚠️ **{{this.title}}**: {{this.description}}
{{/each}}

{{/if}}

## 🐛 Troubleshooting

{{#each troubleshooting}}
### {{this.problem}}

**Síntomas**: {{this.symptoms}}

**Solución**:
{{this.solution}}

{{#if this.code}}
\`\`\`{{this.language}}
{{this.code}}
\`\`\`
{{/if}}

---

{{/each}}

## 📂 Estructura de Archivos

\`\`\`
{{componentPath}}/
{{#each fileStructure}}
├── {{this.name}}{{#if this.description}} # {{this.description}}{{/if}}
{{/each}}
\`\`\`

{{#each fileStructure}}
{{#if this.important}}
### {{this.name}}
{{this.description}}

{{#if this.keyPoints}}
**Puntos clave**:
{{#each this.keyPoints}}
- {{this}}
{{/each}}
{{/if}}
{{/if}}
{{/each}}

## 🎨 Personalización

{{#if customization}}
### Estilos

{{customization.styles.description}}

\`\`\`{{customization.styles.language}}
{{customization.styles.code}}
\`\`\`

### Comportamiento

{{customization.behavior.description}}

\`\`\`{{customization.behavior.language}}
{{customization.behavior.code}}
\`\`\`

{{#if customization.advanced}}
### Personalización Avanzada

{{customization.advanced.description}}

\`\`\`{{customization.advanced.language}}
{{customization.advanced.code}}
\`\`\`
{{/if}}
{{/if}}

## 🔗 Referencias

{{#each references}}
- [{{this.title}}]({{this.url}}) - {{this.description}}
{{/each}}

## 🤝 Contribuir

Para contribuir a {{componentName}}:

1. Revisa los [patrones establecidos](../../guides/patterns.md)
2. Sigue las [convenciones de código](../../guides/coding-standards.md)
3. Actualiza la documentación si es necesario
4. Ejecuta las pruebas: \`npm run test\`
5. Asegúrate de que el linting pase: \`npm run lint\`

---

**Documentación generada automáticamente** - Última actualización: {{lastUpdate}}
```

## 🎨 Generator Functions

### Component Analyzer
```typescript
function analyzeComponent(componentPath: string): ComponentDocData {
  const files = glob(`${componentPath}/**/*.{ts,tsx}`);
  const mainFile = findMainComponentFile(files);
  const content = readFileSync(mainFile, 'utf-8');
  
  return {
    componentName: extractComponentName(componentPath),
    componentPath,
    description: extractDescription(content),
    purpose: extractPurpose(content),
    exports: extractExports(content),
    imports: extractImports(content),
    interfaces: extractInterfaces(content),
    examples: extractExamples(content),
    configuration: extractConfiguration(files),
    usage: generateUsageGuides(content),
    troubleshooting: extractTroubleshooting(componentPath)
  };
}
```

### Interface Extractor
```typescript
function extractInterfaces(content: string): InterfaceInfo[] {
  const interfaceRegex = /interface\s+(\w+)\s*{([^}]+)}/g;
  const interfaces = [];
  let match;
  
  while ((match = interfaceRegex.exec(content)) !== null) {
    const [, name, body] = match;
    const properties = extractProperties(body);
    
    interfaces.push({
      name,
      properties,
      description: extractInterfaceDescription(content, name),
      example: generateInterfaceExample(name, properties)
    });
  }
  
  return interfaces;
}

function extractProperties(interfaceBody: string): PropertyInfo[] {
  const propRegex = /(\w+)(\?)?:\s*([^;]+);/g;
  const properties = [];
  let match;
  
  while ((match = propRegex.exec(interfaceBody)) !== null) {
    const [, name, optional, type] = match;
    properties.push({
      name,
      type: type.trim(),
      required: !optional,
      description: extractPropertyDescription(interfaceBody, name)
    });
  }
  
  return properties;
}
```

### Example Extractor
```typescript
function extractExamples(content: string): ExampleInfo[] {
  const examples = [];
  
  // Buscar ejemplos en JSDoc
  const jsdocExamples = extractJSDocExamples(content);
  examples.push(...jsdocExamples);
  
  // Buscar ejemplos en comentarios
  const commentExamples = extractCommentExamples(content);
  examples.push(...commentExamples);
  
  // Generar ejemplos básicos si no hay
  if (examples.length === 0) {
    examples.push(...generateBasicExamples(content));
  }
  
  return examples;
}

function extractJSDocExamples(content: string): ExampleInfo[] {
  const exampleRegex = /\*\s*@example\s*([^*]*(?:\*(?!\/).*)*)/g;
  const examples = [];
  let match;
  
  while ((match = exampleRegex.exec(content)) !== null) {
    const exampleContent = match[1]
      .replace(/\s*\*/g, '')
      .trim();
      
    examples.push({
      title: 'Ejemplo de uso',
      description: 'Ejemplo extraído de la documentación',
      code: exampleContent,
      language: detectLanguage(exampleContent)
    });
  }
  
  return examples;
}
```

### Usage Guide Generator
```typescript
function generateUsageGuides(content: string): UsageInfo[] {
  const componentName = extractComponentName(content);
  const props = extractProps(content);
  const hooks = extractUsedHooks(content);
  
  const guides = [];
  
  // Guía básica
  guides.push({
    title: 'Uso Básico',
    description: `Cómo usar ${componentName} en su forma más simple`,
    code: generateBasicUsage(componentName, props),
    language: 'tsx'
  });
  
  // Guía con configuración
  if (props.length > 0) {
    guides.push({
      title: 'Con Configuración',
      description: `${componentName} con todas las opciones de configuración`,
      code: generateAdvancedUsage(componentName, props),
      language: 'tsx'
    });
  }
  
  // Guía con hooks
  if (hooks.length > 0) {
    guides.push({
      title: 'Integración con Hooks',
      description: `Usando ${componentName} con hooks personalizados`,
      code: generateHookIntegration(componentName, hooks),
      language: 'tsx'
    });
  }
  
  return guides;
}
```

### Configuration Analyzer
```typescript
function extractConfiguration(files: string[]): ConfigInfo {
  const configFiles = files.filter(f => 
    f.includes('config') || 
    f.includes('Config') ||
    f.endsWith('config.ts') ||
    f.endsWith('config.tsx')
  );
  
  if (configFiles.length === 0) return null;
  
  const configFile = configFiles[0];
  const content = readFileSync(configFile, 'utf-8');
  
  return {
    title: 'Configuración del Componente',
    description: extractConfigDescription(content),
    example: extractConfigExample(content),
    options: extractConfigOptions(content)
  };
}
```

### Migration Guide Generator
```typescript
function generateMigrationGuide(componentPath: string): MigrationInfo | null {
  const migrationFiles = glob(`${componentPath}/**/README_MIGRATION.md`);
  
  if (migrationFiles.length === 0) return null;
  
  const migrationContent = readFileSync(migrationFiles[0], 'utf-8');
  
  return {
    description: extractMigrationDescription(migrationContent),
    from: extractFromVersion(migrationContent),
    to: extractToVersion(migrationContent),
    steps: extractMigrationSteps(migrationContent),
    breaking: extractBreakingChanges(migrationContent)
  };
}
```

## 🔧 Utility Functions

### File Structure Analyzer
```typescript
function analyzeFileStructure(componentPath: string): FileInfo[] {
  const files = glob(`${componentPath}/**/*`);
  
  return files.map(file => ({
    name: path.relative(componentPath, file),
    description: getFileDescription(file),
    important: isImportantFile(file)
  })).sort((a, b) => {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return a.name.localeCompare(b.name);
  });
}

function getFileDescription(filePath: string): string {
  const basename = path.basename(filePath);
  const ext = path.extname(filePath);
  
  const descriptions = {
    'index.ts': 'Punto de entrada principal',
    'index.tsx': 'Componente principal',
    'config.ts': 'Configuración del componente',
    'types.ts': 'Definiciones de tipos',
    'utils.ts': 'Utilidades y helpers',
    'hooks.ts': 'Custom hooks',
    'README.md': 'Documentación',
    'test.ts': 'Archivos de prueba',
    'stories.tsx': 'Historias de Storybook'
  };
  
  return descriptions[basename] || 
         descriptions[ext] || 
         'Archivo del componente';
}
```

### Troubleshooting Extractor
```typescript
function extractTroubleshooting(componentPath: string): TroubleshootingInfo[] {
  // Buscar archivos de troubleshooting
  const troubleshootingFiles = glob(`${componentPath}/**/TROUBLESHOOTING.md`);
  
  if (troubleshootingFiles.length > 0) {
    return extractFromTroubleshootingFile(troubleshootingFiles[0]);
  }
  
  // Generar troubleshooting básico
  return generateBasicTroubleshooting(componentPath);
}

function generateBasicTroubleshooting(componentPath: string): TroubleshootingInfo[] {
  const componentName = path.basename(componentPath);
  
  return [
    {
      problem: `${componentName} no se renderiza`,
      symptoms: 'El componente no aparece en pantalla o muestra errores en consola',
      solution: `Verifica que todas las props requeridas estén siendo pasadas y que las dependencias estén instaladas.`
    },
    {
      problem: 'Errores de TypeScript',
      symptoms: 'El IDE muestra errores de tipos',
      solution: 'Asegúrate de que las interfaces estén correctamente importadas y que los tipos coincidan.',
      code: `import type { ${componentName}Props } from './${componentName}';`
    },
    {
      problem: 'Estilos no se aplican',
      symptoms: 'El componente se renderiza pero sin estilos',
      solution: 'Verifica que Tailwind CSS esté configurado correctamente y que las clases estén incluidas en el bundle.'
    }
  ];
}
```

## 📋 Validation Rules

```typescript
const componentDocValidationRules = {
  examples: (examples: ExampleInfo[]) => {
    return examples.every(example => {
      // Verificar que el código sea válido
      try {
        // Para TypeScript/TSX
        if (example.language === 'tsx' || example.language === 'typescript') {
          return validateTSXCode(example.code);
        }
        return true;
      } catch {
        return false;
      }
    });
  },
  
  interfaces: (interfaces: InterfaceInfo[]) => {
    return interfaces.every(iface => {
      // Verificar que la interfaz sea válida
      return validateInterface(iface);
    });
  },
  
  imports: (imports: ImportInfo[]) => {
    return imports.every(imp => {
      // Verificar que las importaciones existan
      return moduleExists(imp.from);
    });
  }
};
```

## 🎯 Auto-Update Triggers

```typescript
const componentUpdateTriggers = {
  // Actualizar cuando cambie el componente principal
  onComponentChange: (componentPath: string) => {
    const mainFiles = glob(`${componentPath}/*.{ts,tsx}`);
    return mainFiles.some(file => hasRecentChanges(file, '24h'));
  },
  
  // Actualizar cuando cambien las interfaces
  onInterfaceChange: (componentPath: string) => {
    const typeFiles = glob(`${componentPath}/**/*types.ts`);
    return typeFiles.some(file => hasRecentChanges(file, '1h'));
  },
  
  // Actualizar cuando se agreguen ejemplos
  onExampleChange: (componentPath: string) => {
    const exampleFiles = glob(`${componentPath}/**/*example*`);
    return exampleFiles.some(file => hasRecentChanges(file, '1h'));
  }
};
```