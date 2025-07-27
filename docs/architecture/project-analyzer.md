# 🔍 Analizador de Proyecto - Lógica del Sistema

Este documento describe la lógica de análisis automático que utiliza el comando `/update-docs`.

## 📊 Análisis de Dependencias

### Extracción desde package.json
```typescript
interface PackageAnalysis {
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  engines: Record<string, string>;
}

function extractPackageInfo(packageJson: string): PackageAnalysis {
  const pkg = JSON.parse(packageJson);
  return {
    scripts: pkg.scripts || {},
    dependencies: pkg.dependencies || {},
    devDependencies: pkg.devDependencies || {},
    engines: pkg.engines || {}
  };
}
```

### Comandos de desarrollo detectados
- **Bun scripts**: Identifica comandos que usan `bun run`
- **NPM scripts**: Extrae todos los scripts disponibles
- **Prisma commands**: Detecta comandos relacionados con base de datos

## 🏗️ Análisis de Arquitectura

### Estructura del proyecto
```typescript
interface ProjectStructure {
  appRouter: string[];
  components: ComponentInfo[];
  actions: string[];
  hooks: string[];
  stores: string[];
  types: string[];
}

function analyzeProjectStructure(files: string[]): ProjectStructure {
  return {
    appRouter: files.filter(f => f.includes('src/app/')),
    components: analyzeComponents(files.filter(f => f.includes('src/components/'))),
    actions: files.filter(f => f.includes('src/actions/')),
    hooks: files.filter(f => f.includes('src/hooks/')),
    stores: files.filter(f => f.includes('src/store/')),
    types: files.filter(f => f.includes('src/types/'))
  };
}
```

### Detección de patrones
- **App Router layout**: Detecta `(public)`, `(auth)`, `(admin)`
- **Componentes modulares**: Analiza estructura de componentes
- **State management**: Identifica stores de Zustand
- **Server Actions**: Encuentra archivos de acciones

## 🔧 Análisis de Configuraciones

### Prisma Schema
```typescript
interface DatabaseInfo {
  provider: string;
  entities: string[];
  relations: string[];
  features: string[];
}

function extractDatabaseInfo(schema: string): DatabaseInfo {
  const models = schema.match(/model\s+(\w+)/g) || [];
  const provider = schema.match(/provider\s*=\s*"(\w+)"/)?.[1] || 'unknown';
  
  return {
    provider,
    entities: models.map(m => m.replace('model ', '')),
    relations: extractRelations(schema),
    features: extractPrismaFeatures(schema)
  };
}
```

### Next.js Configuration
```typescript
interface NextConfig {
  experimental: string[];
  plugins: string[];
  redirects: any[];
  rewrites: any[];
}

function analyzeNextConfig(configContent: string): NextConfig {
  // Analiza next.config.ts para extraer configuraciones
  return {
    experimental: extractExperimentalFeatures(configContent),
    plugins: extractPlugins(configContent),
    redirects: extractRedirects(configContent),
    rewrites: extractRewrites(configContent)
  };
}
```

## 🎨 Análisis de Componentes

### Extracción de interfaces
```typescript
interface ComponentInfo {
  name: string;
  path: string;
  exports: string[];
  imports: string[];
  interfaces: TypeInfo[];
  examples: string[];
}

function analyzeComponent(filePath: string, content: string): ComponentInfo {
  return {
    name: extractComponentName(filePath),
    path: filePath,
    exports: extractExports(content),
    imports: extractImports(content),
    interfaces: extractInterfaces(content),
    examples: extractJSDocExamples(content)
  };
}
```

### Detección de patrones de uso
- **Props interfaces**: Extrae interfaces de props
- **Hook usage**: Detecta hooks utilizados
- **Server Actions**: Identifica acciones del servidor usadas
- **Dependencies**: Analiza dependencias entre componentes

## 🔍 Análisis de Variables de Entorno

### Extracción desde código
```typescript
interface EnvironmentVars {
  required: string[];
  optional: string[];
  database: string[];
  auth: string[];
  analytics: string[];
}

function extractEnvVars(codeFiles: string[]): EnvironmentVars {
  const envRefs = extractEnvReferences(codeFiles);
  
  return {
    required: envRefs.filter(ref => ref.required),
    optional: envRefs.filter(ref => !ref.required),
    database: envRefs.filter(ref => ref.category === 'database'),
    auth: envRefs.filter(ref => ref.category === 'auth'),
    analytics: envRefs.filter(ref => ref.category === 'analytics')
  };
}
```

## 📝 Generación de Contenido

### Templates dinámicos
```typescript
interface ContentTemplate {
  section: string;
  generator: (data: any) => string;
  validator: (content: string) => boolean;
}

const claudeTemplates: ContentTemplate[] = [
  {
    section: 'development-commands',
    generator: generateDevCommands,
    validator: validateCommandsExist
  },
  {
    section: 'architecture',
    generator: generateArchitecture,
    validator: validateArchitectureAccuracy
  },
  {
    section: 'environment-vars',
    generator: generateEnvVars,
    validator: validateEnvVars
  }
];
```

### Preservación de contenido personalizado
```typescript
function preserveCustomContent(originalContent: string, newContent: string): string {
  // Identifica secciones marcadas como personalizadas
  const customSections = extractCustomSections(originalContent);
  
  // Integra contenido personalizado en el nuevo contenido
  return integrateCustomSections(newContent, customSections);
}
```

## ⚡ Optimizaciones

### Cache de análisis
- Guarda resultados de análisis por timestamp de archivos
- Reutiliza análisis si no hay cambios
- Análisis incremental solo de archivos modificados

### Análisis paralelo
```typescript
async function analyzeProject(): Promise<ProjectAnalysis> {
  const [packageInfo, structure, configs, components] = await Promise.all([
    analyzePackageJson(),
    analyzeProjectStructure(),
    analyzeConfigurations(),
    analyzeComponents()
  ]);
  
  return {
    package: packageInfo,
    structure,
    configs,
    components
  };
}
```

## 🔧 Extensibilidad

### Agregar nuevos analizadores
```typescript
interface Analyzer {
  name: string;
  patterns: string[];
  analyze: (files: string[]) => any;
  generateDocs: (analysis: any) => string;
}

const customAnalyzers: Analyzer[] = [
  // Agregar nuevos analizadores aquí
];
```

### Configuración personalizada
```typescript
// docs/config/analyzer-config.json
{
  "analyzers": {
    "enabled": ["package", "structure", "components"],
    "disabled": ["analytics"],
    "custom": ["my-custom-analyzer"]
  },
  "templates": {
    "claude": "custom-claude-template.md",
    "readme": "custom-readme-template.md"
  },
  "validation": {
    "strict": true,
    "skipPatterns": ["node_modules/**"]
  }
}
```