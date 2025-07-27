# CLAUDE.md Template Generator

Este template genera automáticamente el contenido de CLAUDE.md basado en el análisis del proyecto.

## 🔧 Variables disponibles

```typescript
interface ClaudeTemplateData {
  projectName: string;
  devCommands: {
    npm: Record<string, string>;
    bun: Record<string, string>;
    prisma: string[];
  };
  architecture: {
    framework: string;
    database: string;
    auth: string;
    styling: string;
    stateManagement: string;
    linting: string;
  };
  projectStructure: {
    appRouter: string[];
    components: string[];
    actions: string[];
    hooks: string[];
    stores: string[];
  };
  technologies: {
    core: string[];
    ui: string[];
    dev: string[];
  };
  environmentVars: {
    required: string[];
    optional: string[];
    database: string[];
    auth: string[];
    analytics: string[];
  };
  patterns: {
    serverActions: boolean;
    roleBasedAuth: boolean;
    componentFirst: boolean;
    typeScript: boolean;
  };
}
```

## 📝 Template Structure

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### With npm
{{#each devCommands.npm}}
- `npm run {{@key}}` - {{this}}
{{/each}}

### With Bun (preferred)
{{#each devCommands.bun}}
- `bun run {{@key}}` - {{this}}
{{/each}}

### Database (Prisma)
{{#each devCommands.prisma}}
- `{{this}}`
{{/each}}

## Architecture Overview

### Core Technologies

- **Framework**: {{architecture.framework}}
- **Database**: {{architecture.database}}
- **Authentication**: {{architecture.auth}}
- **State Management**: {{architecture.stateManagement}}
- **Styling**: {{architecture.styling}}
- **Linting**: {{architecture.linting}}
{{#if architecture.richText}}
- **Rich Text**: {{architecture.richText}}
{{/if}}
{{#if architecture.analytics}}
- **Analytics**: {{architecture.analytics}}
{{/if}}

### Project Structure

#### App Router Layout
{{#each projectStructure.appRouter}}
- `{{this}}`
{{/each}}

#### Authentication & Authorization
{{#if patterns.roleBasedAuth}}
- **Role-based permission system** with granular page access control
- **User-Role-Permission hierarchy**: Users → UserRoles → Roles → PermissionRole → Permissions
- **Page-level access control**: PageRole table maps roles to specific pages
- **Audit logging**: All auth events tracked in AuditLog table
- **Session management**: JWT with 30-day expiry, 24-hour refresh
{{/if}}

#### Database Schema (Prisma)

Key entities:
{{#each database.entities}}
- `{{this.name}}` - {{this.description}}
{{/each}}

#### State Management
{{#each projectStructure.stores}}
- `{{this.name}}` - {{this.description}}
{{/each}}

#### Component Architecture

- **Modular design** with feature-based organization
- **Reusable UI components** in `/ui` folder using {{architecture.uiLibrary}} primitives
- **Modal system** for CRUD operations
- **Data tables** with sorting, filtering, and pagination
- **Form handling** with react-hook-form integration

### Key Implementation Details

#### Authentication Flow
{{#if patterns.roleBasedAuth}}
1. Credentials validated against database with bcrypt
2. User roles and permissions loaded from relational tables
3. JWT token contains user data, roles, and permissions
4. Middleware protects routes, ProtectedRoute handles page-level permissions
5. All auth events logged to audit table
{{/if}}

{{#if architecture.analytics}}
#### Analytics Integration

- {{architecture.analytics}} integration
- Real-time metrics with 5-minute refresh intervals
- Comprehensive dashboard with charts (Recharts)
- Service Account authentication
- Configuration via environment variables
{{/if}}

#### Development Workflow

- **{{architecture.linting}}** for linting and formatting (configured in `{{lintingConfig}}`)
- **Turbopack** for fast development builds
- **Prisma** handles all database operations
- **TypeScript** strict mode enabled
- **Component-first development** with reusable patterns

#### Security Features

- Password hashing with bcrypt
- JWT session management with secure expiry
- Role-based page access control
- Complete audit logging for compliance
- Input validation and sanitization
- Protected API routes with middleware

### Environment Variables Required

```
{{#each environmentVars.database}}
{{this}}
{{/each}}
{{#each environmentVars.auth}}
{{this}}
{{/each}}
{{#each environmentVars.analytics}}
{{this}}
{{/each}}
{{#each environmentVars.required}}
{{this}}
{{/each}}
```

### Common Patterns

{{#if patterns.serverActions}}
- Server Actions in `/actions` for database operations
{{/if}}
- Custom hooks in `/hooks` for reusable logic
- Type definitions in `/types` organized by feature
- Utility functions in `/lib` with feature separation
- Modular components with co-located styles and logic

### Development Notes

- Use Bun for faster package management and builds when possible
{{#if patterns.roleBasedAuth}}
- Follow role-based access patterns when adding new pages
{{/if}}
- All database changes require Prisma migrations
{{#if patterns.auditLogging}}
- Audit logging should be implemented for sensitive operations
{{/if}}
- Use existing UI components before creating new ones
{{#if patterns.typeScript}}
- Follow the established TypeScript patterns for type safety
{{/if}}
```

## 🎨 Sections Generator Functions

### Development Commands Section
```typescript
function generateDevCommands(packageJson: any): string {
  const scripts = packageJson.scripts || {};
  
  const npmCommands = Object.entries(scripts)
    .filter(([key]) => !key.startsWith('bun:'))
    .map(([key, value]) => `- \`npm run ${key}\` - ${getCommandDescription(key, value)}`)
    .join('\n');
    
  const bunCommands = Object.entries(scripts)
    .filter(([key]) => key.startsWith('bun:'))
    .map(([key, value]) => `- \`bun run ${key}\` - ${getCommandDescription(key, value)}`)
    .join('\n');
    
  const prismaCommands = [
    '- `npx prisma migrate dev --name migration_name` - Create and apply migration',
    '- `npx prisma migrate deploy` - Deploy migrations (production)',
    '- `npx prisma studio` - Open Prisma Studio',
    '- `npx prisma db seed` - Run seed file',
    '- `npx prisma generate` - Generate Prisma client'
  ].join('\n');
  
  return `### With npm\n\n${npmCommands}\n\n### With Bun (preferred)\n\n${bunCommands}\n\n### Database (Prisma)\n\n${prismaCommands}`;
}
```

### Architecture Section
```typescript
function generateArchitectureSection(projectAnalysis: ProjectAnalysis): string {
  const { dependencies, structure, configs } = projectAnalysis;
  
  const coreStack = extractCoreStack(dependencies);
  const features = analyzeFeatures(structure);
  
  return generateFromTemplate('architecture-template', {
    framework: coreStack.framework,
    database: coreStack.database,
    auth: coreStack.auth,
    styling: coreStack.styling,
    features,
    patterns: extractPatterns(structure)
  });
}
```

### Environment Variables Section
```typescript
function generateEnvironmentVars(codeFiles: string[]): string {
  const envVars = extractEnvReferences(codeFiles);
  
  const sections = {
    database: envVars.filter(v => v.category === 'database'),
    auth: envVars.filter(v => v.category === 'auth'),
    analytics: envVars.filter(v => v.category === 'analytics'),
    required: envVars.filter(v => v.required && !['database', 'auth', 'analytics'].includes(v.category))
  };
  
  return Object.entries(sections)
    .map(([category, vars]) => vars.map(v => `${v.name}="${v.example}"`).join('\n'))
    .join('\n');
}
```

## 🔧 Utility Functions

### Command Description Generator
```typescript
function getCommandDescription(key: string, command: string): string {
  const descriptions = {
    'dev': 'Start development server',
    'build': 'Build the application',
    'start': 'Start production server',
    'lint': 'Run linter',
    'test': 'Run tests',
    'format': 'Format code',
    'type-check': 'Run TypeScript type checking',
    'clean': 'Clean build artifacts'
  };
  
  return descriptions[key] || command;
}
```

### Technology Stack Extractor
```typescript
function extractCoreStack(dependencies: Record<string, string>): TechStack {
  return {
    framework: detectFramework(dependencies),
    database: detectDatabase(dependencies),
    auth: detectAuthLibrary(dependencies),
    styling: detectStylingLibrary(dependencies),
    stateManagement: detectStateManagement(dependencies),
    linting: detectLinting(dependencies)
  };
}
```

## 📋 Validation Rules

### Content Validation
```typescript
const validationRules = {
  commands: (content: string) => {
    // Verificar que todos los comandos listados existan en package.json
    const commands = extractCommandsFromContent(content);
    return commands.every(cmd => commandExists(cmd));
  },
  
  dependencies: (content: string) => {
    // Verificar que las tecnologías listadas estén en las dependencias
    const technologies = extractTechnologiesFromContent(content);
    return technologies.every(tech => dependencyExists(tech));
  },
  
  structure: (content: string) => {
    // Verificar que las rutas mencionadas existan
    const paths = extractPathsFromContent(content);
    return paths.every(path => pathExists(path));
  }
};
```

## 🎯 Custom Sections

Para agregar secciones personalizadas que no se sobrescriban:

```markdown
<!-- CUSTOM_SECTION_START: nombre-seccion -->
Contenido personalizado que se preservará
<!-- CUSTOM_SECTION_END: nombre-seccion -->
```

Estas secciones se mantendrán intactas durante las actualizaciones automáticas.