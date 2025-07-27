# README.md Template Generator

Template para generar automáticamente el README.md principal del proyecto.

## 🔧 Variables del Template

```typescript
interface ReadmeTemplateData {
  projectName: string;
  description: string;
  features: {
    core: string[];
    auth: string[];
    ui: string[];
    database: string[];
    analytics?: string[];
  };
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    tools: string[];
  };
  installation: {
    prerequisites: string[];
    steps: string[];
    environment: EnvironmentVar[];
  };
  usage: {
    development: string[];
    production: string[];
    testing: string[];
  };
  structure: {
    main: DirectoryInfo[];
    components: DirectoryInfo[];
  };
  configuration: {
    database: ConfigSection;
    authentication: ConfigSection;
    environment: ConfigSection;
  };
}
```

## 📝 Template Structure

```markdown
# {{projectName}}

{{description}}

## ✨ Características Principales

### 🔐 Autenticación y Autorización
{{#each features.auth}}
- {{this}}
{{/each}}

### 🎨 Interfaz de Usuario
{{#each features.ui}}
- {{this}}
{{/each}}

### 💾 Base de Datos
{{#each features.database}}
- {{this}}
{{/each}}

{{#if features.analytics}}
### 📊 Analytics
{{#each features.analytics}}
- {{this}}
{{/each}}
{{/if}}

### ⚡ Funcionalidades Core
{{#each features.core}}
- {{this}}
{{/each}}

## 🛠️ Stack Tecnológico

### Frontend
{{#each techStack.frontend}}
- **{{this.name}}** - {{this.description}}
{{/each}}

### Backend
{{#each techStack.backend}}
- **{{this.name}}** - {{this.description}}
{{/each}}

### Base de Datos
{{#each techStack.database}}
- **{{this.name}}** - {{this.description}}
{{/each}}

### Herramientas de Desarrollo
{{#each techStack.tools}}
- **{{this.name}}** - {{this.description}}
{{/each}}

## 🚀 Instalación

### Prerrequisitos
{{#each installation.prerequisites}}
- {{this}}
{{/each}}

### Pasos de Instalación

{{#each installation.steps}}
{{@index}}. {{this}}
{{/each}}

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
{{#each installation.environment}}
{{this.name}}={{this.example}}{{#if this.description}} # {{this.description}}{{/if}}
{{/each}}
```

## 💻 Uso

### Desarrollo
```bash
{{#each usage.development}}
{{this}}
{{/each}}
```

### Producción
```bash
{{#each usage.production}}
{{this}}
{{/each}}
```

{{#if usage.testing}}
### Testing
```bash
{{#each usage.testing}}
{{this}}
{{/each}}
```
{{/if}}

## 📁 Estructura del Proyecto

```
{{projectName}}/
{{#each structure.main}}
├── {{this.path}}/{{#if this.description}} # {{this.description}}{{/if}}
{{#each this.children}}
│   ├── {{this.name}}{{#if this.description}} # {{this.description}}{{/if}}
{{/each}}
{{/each}}
```

### Componentes Principales

{{#each structure.components}}
#### {{this.name}}
{{this.description}}

```
{{this.path}}/
{{#each this.files}}
├── {{this.name}}{{#if this.description}} # {{this.description}}{{/if}}
{{/each}}
```
{{/each}}

## ⚙️ Configuración

### Base de Datos
{{configuration.database.description}}

```bash
{{#each configuration.database.commands}}
{{this}}
{{/each}}
```

### Autenticación
{{configuration.authentication.description}}

{{#each configuration.authentication.features}}
- {{this}}
{{/each}}

### Variables de Entorno
{{configuration.environment.description}}

| Variable | Descripción | Requerida | Ejemplo |
|----------|-------------|-----------|---------|
{{#each configuration.environment.variables}}
| `{{this.name}}` | {{this.description}} | {{#if this.required}}✅{{else}}❌{{/if}} | `{{this.example}}` |
{{/each}}

## 🔧 Scripts Disponibles

| Script | Descripción | Comando |
|--------|-------------|---------|
{{#each usage.scripts}}
| `{{this.name}}` | {{this.description}} | `{{this.command}}` |
{{/each}}

## 📚 Documentación Adicional

{{#each documentation}}
- [{{this.title}}]({{this.path}}) - {{this.description}}
{{/each}}

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia {{license}}. Ver el archivo `LICENSE` para más detalles.

## 🙋‍♂️ Soporte

Si tienes preguntas o necesitas ayuda:

{{#each support}}
- {{this.method}}: {{this.contact}}
{{/each}}

---

**Desarrollado con ❤️ usando {{mainTech}}**
```

## 🎨 Generators Functions

### Features Extractor
```typescript
function extractFeatures(projectAnalysis: ProjectAnalysis): Features {
  const { dependencies, structure, configs } = projectAnalysis;
  
  return {
    core: extractCoreFeatures(structure),
    auth: extractAuthFeatures(dependencies, structure),
    ui: extractUIFeatures(dependencies, structure),
    database: extractDatabaseFeatures(configs.prisma),
    analytics: extractAnalyticsFeatures(dependencies, structure)
  };
}

function extractCoreFeatures(structure: ProjectStructure): string[] {
  const features = [];
  
  if (structure.components.some(c => c.includes('Table'))) {
    features.push('Sistema de tablas genérico con búsqueda, ordenamiento y paginación');
  }
  
  if (structure.actions.length > 0) {
    features.push('Server Actions para operaciones de base de datos');
  }
  
  if (structure.hooks.length > 0) {
    features.push('Custom hooks para lógica reutilizable');
  }
  
  if (structure.stores.length > 0) {
    features.push('Gestión de estado con Zustand');
  }
  
  return features;
}
```

### Tech Stack Generator
```typescript
function generateTechStack(dependencies: Record<string, string>): TechStack {
  const frontend = [];
  const backend = [];
  const database = [];
  const tools = [];
  
  // Frontend
  if (dependencies['next']) {
    frontend.push({
      name: 'Next.js 15',
      description: 'Framework React con App Router y Turbopack'
    });
  }
  
  if (dependencies['react']) {
    frontend.push({
      name: 'React 18',
      description: 'Biblioteca para interfaces de usuario'
    });
  }
  
  if (dependencies['tailwindcss']) {
    frontend.push({
      name: 'Tailwind CSS',
      description: 'Framework CSS utility-first'
    });
  }
  
  if (dependencies['@radix-ui/react-dialog']) {
    frontend.push({
      name: 'Radix UI',
      description: 'Componentes accesibles sin estilos'
    });
  }
  
  // Backend
  if (dependencies['next-auth']) {
    backend.push({
      name: 'NextAuth.js',
      description: 'Autenticación completa para Next.js'
    });
  }
  
  if (dependencies['prisma']) {
    backend.push({
      name: 'Prisma ORM',
      description: 'ORM moderno para TypeScript'
    });
  }
  
  // Database
  if (dependencies['@prisma/client']) {
    database.push({
      name: 'PostgreSQL',
      description: 'Base de datos relacional robusta'
    });
  }
  
  // Tools
  if (dependencies['@biomejs/biome']) {
    tools.push({
      name: 'Biome',
      description: 'Linter y formateador rápido'
    });
  }
  
  if (dependencies['typescript']) {
    tools.push({
      name: 'TypeScript',
      description: 'JavaScript con tipos estáticos'
    });
  }
  
  return { frontend, backend, database, tools };
}
```

### Installation Steps Generator
```typescript
function generateInstallationSteps(packageManager: string): string[] {
  const steps = [
    'Clona el repositorio:',
    '```bash',
    'git clone [repository-url]',
    'cd [project-name]',
    '```',
    '',
    'Instala las dependencias:',
    '```bash'
  ];
  
  if (packageManager === 'bun') {
    steps.push('bun install');
  } else {
    steps.push('npm install');
  }
  
  steps.push(
    '```',
    '',
    'Configura la base de datos:',
    '```bash',
    'npx prisma migrate dev',
    'npx prisma db seed',
    '```',
    '',
    'Inicia el servidor de desarrollo:',
    '```bash'
  );
  
  if (packageManager === 'bun') {
    steps.push('bun run bun:dev');
  } else {
    steps.push('npm run dev');
  }
  
  steps.push(
    '```',
    '',
    'Abre [http://localhost:3000](http://localhost:3000) en tu navegador.'
  );
  
  return steps;
}
```

### Project Structure Generator
```typescript
function generateProjectStructure(structure: ProjectStructure): DirectoryInfo[] {
  return [
    {
      path: 'src/app',
      description: 'App Router de Next.js',
      children: [
        { name: '(public)', description: 'Páginas públicas' },
        { name: '(auth)', description: 'Páginas de autenticación' },
        { name: '(admin)', description: 'Dashboard administrativo' }
      ]
    },
    {
      path: 'src/components',
      description: 'Componentes reutilizables',
      children: structure.components.map(c => ({
        name: path.basename(c),
        description: getComponentDescription(c)
      }))
    },
    {
      path: 'src/actions',
      description: 'Server Actions',
      children: structure.actions.map(a => ({
        name: path.basename(a),
        description: 'Operaciones del servidor'
      }))
    },
    {
      path: 'src/store',
      description: 'Gestión de estado Zustand',
      children: structure.stores.map(s => ({
        name: path.basename(s),
        description: getStoreDescription(s)
      }))
    }
  ];
}
```

## 🔧 Utility Functions

### Environment Variables Extractor
```typescript
function extractEnvironmentVars(codeFiles: string[]): EnvironmentVar[] {
  const envVars = [];
  const envRegex = /process\.env\.([A-Z_]+)/g;
  
  codeFiles.forEach(file => {
    const content = readFileSync(file, 'utf-8');
    const matches = content.match(envRegex) || [];
    
    matches.forEach(match => {
      const varName = match.replace('process.env.', '');
      if (!envVars.find(v => v.name === varName)) {
        envVars.push({
          name: varName,
          description: getEnvDescription(varName),
          required: isEnvRequired(varName, content),
          example: getEnvExample(varName)
        });
      }
    });
  });
  
  return envVars.sort((a, b) => {
    if (a.required && !b.required) return -1;
    if (!a.required && b.required) return 1;
    return a.name.localeCompare(b.name);
  });
}
```

### Scripts Extractor
```typescript
function extractScripts(packageJson: any): ScriptInfo[] {
  const scripts = packageJson.scripts || {};
  
  return Object.entries(scripts).map(([name, command]) => ({
    name,
    command: typeof command === 'string' ? command : '',
    description: getScriptDescription(name, command)
  }));
}

function getScriptDescription(name: string, command: string): string {
  const descriptions = {
    'dev': 'Inicia el servidor de desarrollo',
    'build': 'Construye la aplicación para producción',
    'start': 'Inicia el servidor en modo producción',
    'lint': 'Ejecuta el linter para revisar código',
    'test': 'Ejecuta las pruebas',
    'format': 'Formatea el código',
    'clean': 'Limpia archivos temporales'
  };
  
  return descriptions[name] || `Ejecuta: ${command}`;
}
```

## 📋 Validation Rules

```typescript
const readmeValidationRules = {
  links: (content: string) => {
    const links = extractLinksFromContent(content);
    return links.every(link => linkIsValid(link));
  },
  
  commands: (content: string) => {
    const commands = extractCommandsFromContent(content);
    return commands.every(cmd => commandExists(cmd));
  },
  
  structure: (content: string) => {
    const paths = extractFilePathsFromContent(content);
    return paths.every(path => fileExists(path));
  },
  
  dependencies: (content: string) => {
    const deps = extractDependenciesFromContent(content);
    return deps.every(dep => dependencyExists(dep));
  }
};
```

## 🎯 Custom Sections Support

Para agregar secciones que se preserven entre actualizaciones:

```markdown
<!-- CUSTOM_README_SECTION_START: deployment -->
## 🚀 Deployment

Instrucciones específicas de deployment que no se sobrescriben.
<!-- CUSTOM_README_SECTION_END: deployment -->
```