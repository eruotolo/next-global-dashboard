# Casos de Uso Complejos

Ejemplos reales de implementación del sistema FormBuilder en diferentes escenarios.

## 🔐 Caso 1: Sistema de Autenticación

### Login Form

```tsx
// components/auth/LoginForm.tsx
'use client';

import { FormBuilder } from '@/components/Form';
import { loginSchema } from '@/components/Form/validation/schemas/userSchemas';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

export function LoginForm() {
  const handleLogin = async (formData: FormData): Promise<ActionResult> => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (res?.error) {
      return {
        success: false,
        error: res.error === 'CredentialsSignin' 
          ? 'Credenciales inválidas' 
          : res.error
      };
    }

    return { success: true, data: { email } };
  };

  return (
    <div className="max-w-md mx-auto">
      <FormBuilder
        schema={loginSchema}
        action={handleLogin}
        fields={[
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'tu@email.com',
            required: true,
            autoComplete: 'email',
            validation: 'realtime'
          },
          {
            name: 'password',
            type: 'password',
            label: 'Contraseña',
            required: true,
            autoComplete: 'current-password',
            showPasswordToggle: true
          }
        ]}
        submitLabel="Iniciar Sesión"
        onSuccess={() => {
          toast.success('¡Bienvenido!');
          window.location.href = '/dashboard';
        }}
        onError={(errors) => {
          toast.error('Error al iniciar sesión');
        }}
      />
    </div>
  );
}
```

### Registro con Validación Compleja

```tsx
// schemas/registrationSchema.ts
import { z } from 'zod';

const registrationSchema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener una mayúscula')
    .regex(/[0-9]/, 'Debe contener un número'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

// components/auth/RegistrationForm.tsx
export function RegistrationForm() {
  return (
    <FormBuilder
      schema={registrationSchema}
      action={handleRegistration}
      fields={[
        {
          name: 'firstName',
          type: 'text',
          label: 'Nombre',
          required: true,
          gridColumn: 1
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'Apellido',
          required: true,
          gridColumn: 1
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          required: true,
          validation: 'realtime'
        },
        {
          name: 'password',
          type: 'password',
          label: 'Contraseña',
          required: true,
          showPasswordToggle: true,
          validation: 'realtime',
          description: 'Mínimo 8 caracteres, una mayúscula y un número'
        },
        {
          name: 'confirmPassword',
          type: 'password',
          label: 'Confirmar Contraseña',
          required: true,
          validation: 'onBlur'
        },
        {
          name: 'acceptTerms',
          type: 'checkbox',
          label: 'Acepto los términos y condiciones',
          required: true
        }
      ]}
      layout={{ type: 'grid', columns: 2, gap: 4 }}
      submitLabel="Crear Cuenta"
    />
  );
}
```

## 👤 Caso 2: Gestión de Usuarios

### Formulario de Creación de Usuario

```tsx
// components/users/UserCreateForm.tsx
'use client';

import { FormBuilder } from '@/components/Form';
import { userCreateSchema } from '@/components/Form/validation/schemas/userSchemas';
import { createUser } from '@/actions/users';

export function UserCreateForm({ onSuccess }: { onSuccess?: () => void }) {
  return (
    <FormBuilder
      schema={userCreateSchema}
      action={createUser}
      fields={[
        {
          name: 'name',
          type: 'text',
          label: 'Nombre',
          required: true,
          gridColumn: 1,
          validation: 'realtime'
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'Apellido',
          required: true,
          gridColumn: 1,
          validation: 'realtime'
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          required: true,
          validation: 'realtime',
          description: 'Se enviará un email de confirmación'
        },
        {
          name: 'phone',
          type: 'phone',
          label: 'Teléfono',
          required: true,
          placeholder: '+52 55 1234 5678'
        },
        {
          name: 'birthdate',
          type: 'date',
          label: 'Fecha de nacimiento',
          required: true
        },
        {
          name: 'address',
          type: 'text',
          label: 'Dirección',
          required: true,
          maxLength: 200
        },
        {
          name: 'city',
          type: 'text',
          label: 'Ciudad',
          required: true,
          gridColumn: 1
        },
        {
          name: 'country',
          type: 'select',
          label: 'País',
          required: true,
          gridColumn: 1,
          options: [
            { value: 'mx', label: 'México' },
            { value: 'us', label: 'Estados Unidos' },
            { value: 'ca', label: 'Canadá' }
          ]
        },
        {
          name: 'password',
          type: 'password',
          label: 'Contraseña',
          required: true,
          showPasswordToggle: true,
          validation: 'realtime'
        },
        {
          name: 'image',
          type: 'file-upload',
          label: 'Foto de perfil',
          accept: 'image/*',
          maxSize: 1024000,
          preview: true,
          description: 'Opcional, máximo 1MB'
        }
      ]}
      layout={{
        type: 'grid',
        columns: 2,
        gap: 6
      }}
      options={{
        progressiveEnhancement: true,
        realTimeValidation: true,
        focusFirstError: true,
        resetOnSuccess: true
      }}
      submitLabel="Crear Usuario"
      onSuccess={onSuccess}
    />
  );
}
```

## 🎫 Caso 3: Sistema de Tickets

### Formulario de Ticket Complejo

```tsx
// schemas/ticketSchema.ts
const ticketSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(100),
  category: z.enum(['bug', 'feature', 'support', 'question']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  description: z.string().min(20, 'Describe el problema en detalle'),
  stepsToReproduce: z.string().optional(),
  expectedBehavior: z.string().optional(),
  actualBehavior: z.string().optional(),
  attachments: z.array(z.instanceof(File)).max(5, 'Máximo 5 archivos').optional(),
  assignedTo: z.string().optional(),
  tags: z.array(z.string()).max(10, 'Máximo 10 tags').optional(),
  isPublic: z.boolean().default(false)
});

// components/tickets/TicketForm.tsx
export function TicketForm() {
  const [category, setCategory] = useState('');
  
  const getConditionalFields = () => {
    const baseFields = [
      {
        name: 'title',
        type: 'text' as const,
        label: 'Título',
        required: true,
        maxLength: 100,
        validation: 'realtime' as const
      },
      {
        name: 'category',
        type: 'select' as const,
        label: 'Categoría',
        required: true,
        options: [
          { value: 'bug', label: '🐛 Bug Report' },
          { value: 'feature', label: '✨ Nueva Funcionalidad' },
          { value: 'support', label: '🆘 Soporte' },
          { value: 'question', label: '❓ Pregunta' }
        ]
      },
      {
        name: 'priority',
        type: 'select' as const,
        label: 'Prioridad',
        required: true,
        options: [
          { value: 'low', label: '🟢 Baja' },
          { value: 'medium', label: '🟡 Media' },
          { value: 'high', label: '🟠 Alta' },
          { value: 'urgent', label: '🔴 Urgente' }
        ]
      },
      {
        name: 'description',
        type: 'textarea' as const,
        label: 'Descripción',
        required: true,
        rows: 6,
        maxLength: 2000,
        showCharCount: true,
        placeholder: 'Describe el problema o solicitud en detalle...'
      }
    ];

    // Campos específicos para bugs
    if (category === 'bug') {
      baseFields.push(
        {
          name: 'stepsToReproduce',
          type: 'textarea' as const,
          label: 'Pasos para reproducir',
          rows: 4,
          placeholder: '1. Ir a...\n2. Hacer clic en...\n3. Ver error...'
        },
        {
          name: 'expectedBehavior',
          type: 'textarea' as const,
          label: 'Comportamiento esperado',
          rows: 3,
          placeholder: 'Qué debería pasar...'
        },
        {
          name: 'actualBehavior',
          type: 'textarea' as const,
          label: 'Comportamiento actual',
          rows: 3,
          placeholder: 'Qué está pasando en realidad...'
        }
      );
    }

    baseFields.push(
      {
        name: 'attachments',
        type: 'multi-file-upload' as const,
        label: 'Archivos adjuntos',
        accept: '.png,.jpg,.jpeg,.pdf,.txt,.log',
        maxFiles: 5,
        maxSize: 10485760, // 10MB
        description: 'Screenshots, logs, documentos (máx. 5 archivos, 10MB c/u)'
      },
      {
        name: 'tags',
        type: 'multi-select' as const,
        label: 'Etiquetas',
        options: [
          { value: 'frontend', label: 'Frontend' },
          { value: 'backend', label: 'Backend' },
          { value: 'database', label: 'Base de datos' },
          { value: 'api', label: 'API' },
          { value: 'ui', label: 'Interfaz' },
          { value: 'performance', label: 'Performance' }
        ],
        maxSelections: 5,
        createOption: true
      },
      {
        name: 'isPublic',
        type: 'toggle' as const,
        label: 'Ticket público',
        description: 'Visible para otros usuarios'
      }
    );

    return baseFields;
  };

  return (
    <FormBuilder
      schema={ticketSchema}
      action={createTicket}
      fields={getConditionalFields()}
      layout={{
        type: 'stack',
        gap: 6
      }}
      onFieldChange={(name, value) => {
        if (name === 'category') {
          setCategory(value);
        }
      }}
      submitLabel="Crear Ticket"
      loadingLabel="Creando ticket..."
    />
  );
}
```

## ⚙️ Caso 4: Configuraciones del Sistema

### Panel de Configuración Avanzado

```tsx
// schemas/settingsSchema.ts
const settingsSchema = z.object({
  // Configuración general
  siteName: z.string().min(1, 'Nombre requerido'),
  siteDescription: z.string().max(500),
  timezone: z.string(),
  language: z.string(),
  
  // Configuración de email
  emailProvider: z.enum(['smtp', 'sendgrid', 'mailgun']),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  
  // Configuración de notificaciones
  enableEmailNotifications: z.boolean(),
  enablePushNotifications: z.boolean(),
  notificationFrequency: z.enum(['immediate', 'hourly', 'daily']),
  
  // Configuración de seguridad
  requireTwoFactor: z.boolean(),
  sessionTimeout: z.number().min(5).max(1440), // minutos
  allowPasswordReset: z.boolean(),
  
  // Configuración de archivos
  maxFileSize: z.number().min(1).max(100), // MB
  allowedFileTypes: z.array(z.string()),
  
  // Configuración de backup
  enableAutoBackup: z.boolean(),
  backupFrequency: z.enum(['daily', 'weekly', 'monthly']),
  backupRetention: z.number().min(1).max(365) // días
}).refine((data) => {
  // Validación condicional para SMTP
  if (data.emailProvider === 'smtp') {
    return data.smtpHost && data.smtpPort && data.smtpUser;
  }
  return true;
}, {
  message: 'Configuración SMTP incompleta',
  path: ['smtpHost']
});

// components/settings/SettingsForm.tsx
export function SettingsForm() {
  const [emailProvider, setEmailProvider] = useState('smtp');
  const [enableAutoBackup, setEnableAutoBackup] = useState(false);

  const getEmailFields = () => {
    if (emailProvider !== 'smtp') return [];
    
    return [
      {
        name: 'smtpHost',
        type: 'text' as const,
        label: 'Servidor SMTP',
        placeholder: 'smtp.gmail.com',
        required: true
      },
      {
        name: 'smtpPort',
        type: 'number' as const,
        label: 'Puerto',
        placeholder: '587',
        required: true,
        gridColumn: 1
      },
      {
        name: 'smtpUser',
        type: 'email' as const,
        label: 'Usuario SMTP',
        required: true,
        gridColumn: 1
      },
      {
        name: 'smtpPassword',
        type: 'password' as const,
        label: 'Contraseña SMTP',
        required: true,
        showPasswordToggle: true
      }
    ];
  };

  const getBackupFields = () => {
    if (!enableAutoBackup) return [];
    
    return [
      {
        name: 'backupFrequency',
        type: 'select' as const,
        label: 'Frecuencia de backup',
        options: [
          { value: 'daily', label: 'Diario' },
          { value: 'weekly', label: 'Semanal' },
          { value: 'monthly', label: 'Mensual' }
        ],
        required: true,
        gridColumn: 1
      },
      {
        name: 'backupRetention',
        type: 'number' as const,
        label: 'Retención (días)',
        min: 1,
        max: 365,
        required: true,
        gridColumn: 1
      }
    ];
  };

  const allFields = [
    // Configuración General
    {
      name: 'siteName',
      type: 'text' as const,
      label: 'Nombre del sitio',
      required: true,
      gridColumn: 1
    },
    {
      name: 'language',
      type: 'select' as const,
      label: 'Idioma',
      options: [
        { value: 'es', label: 'Español' },
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' }
      ],
      gridColumn: 1
    },
    {
      name: 'siteDescription',
      type: 'textarea' as const,
      label: 'Descripción',
      maxLength: 500,
      showCharCount: true,
      rows: 3
    },
    
    // Email Configuration
    {
      name: 'emailProvider',
      type: 'select' as const,
      label: 'Proveedor de Email',
      options: [
        { value: 'smtp', label: 'SMTP Custom' },
        { value: 'sendgrid', label: 'SendGrid' },
        { value: 'mailgun', label: 'Mailgun' }
      ],
      required: true
    },
    ...getEmailFields(),
    
    // Notifications
    {
      name: 'enableEmailNotifications',
      type: 'toggle' as const,
      label: 'Notificaciones por email'
    },
    {
      name: 'enablePushNotifications',
      type: 'toggle' as const,
      label: 'Notificaciones push'
    },
    {
      name: 'notificationFrequency',
      type: 'select' as const,
      label: 'Frecuencia de notificaciones',
      options: [
        { value: 'immediate', label: 'Inmediata' },
        { value: 'hourly', label: 'Cada hora' },
        { value: 'daily', label: 'Diaria' }
      ]
    },
    
    // Security
    {
      name: 'requireTwoFactor',
      type: 'toggle' as const,
      label: 'Requerir autenticación de dos factores'
    },
    {
      name: 'sessionTimeout',
      type: 'number' as const,
      label: 'Timeout de sesión (minutos)',
      min: 5,
      max: 1440,
      placeholder: '30'
    },
    
    // File Settings
    {
      name: 'maxFileSize',
      type: 'number' as const,
      label: 'Tamaño máximo de archivo (MB)',
      min: 1,
      max: 100,
      gridColumn: 1
    },
    {
      name: 'allowedFileTypes',
      type: 'multi-select' as const,
      label: 'Tipos de archivo permitidos',
      options: [
        { value: 'image/jpeg', label: 'JPEG' },
        { value: 'image/png', label: 'PNG' },
        { value: 'application/pdf', label: 'PDF' },
        { value: 'text/plain', label: 'TXT' },
        { value: 'application/zip', label: 'ZIP' }
      ],
      gridColumn: 1
    },
    
    // Backup
    {
      name: 'enableAutoBackup',
      type: 'toggle' as const,
      label: 'Backup automático'
    },
    ...getBackupFields()
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <FormBuilder
        schema={settingsSchema}
        action={updateSettings}
        fields={allFields}
        layout={{
          type: 'grid',
          columns: 2,
          gap: 6
        }}
        options={{
          progressiveEnhancement: true,
          realTimeValidation: false, // Validar solo al enviar
          resetOnSuccess: false
        }}
        onFieldChange={(name, value) => {
          if (name === 'emailProvider') {
            setEmailProvider(value);
          }
          if (name === 'enableAutoBackup') {
            setEnableAutoBackup(value);
          }
        }}
        submitLabel="Guardar Configuración"
        loadingLabel="Guardando..."
        className="space-y-8"
      />
    </div>
  );
}
```

## 🛍️ Caso 5: E-commerce - Formulario de Producto

```tsx
// schemas/productSchema.ts
const productSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres').max(100),
  sku: z.string().regex(/^[A-Z0-9-]+$/, 'Solo letras mayúsculas, números y guiones'),
  category: z.string().min(1, 'Categoría requerida'),
  subcategory: z.string().optional(),
  description: z.string().min(20, 'Descripción muy corta'),
  shortDescription: z.string().max(160, 'Máximo 160 caracteres'),
  price: z.number().min(0.01, 'Precio debe ser mayor a 0'),
  comparePrice: z.number().optional(),
  cost: z.number().min(0, 'Costo no puede ser negativo'),
  images: z.array(z.instanceof(File)).min(1, 'Al menos una imagen').max(10),
  inventory: z.object({
    trackQuantity: z.boolean(),
    quantity: z.number().min(0).optional(),
    allowBackorder: z.boolean()
  }),
  shipping: z.object({
    weight: z.number().min(0),
    dimensions: z.object({
      length: z.number().min(0),
      width: z.number().min(0),
      height: z.number().min(0)
    })
  }),
  seo: z.object({
    title: z.string().max(60).optional(),
    description: z.string().max(160).optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/).optional()
  }),
  tags: z.array(z.string()).max(20),
  isActive: z.boolean(),
  isFeatured: z.boolean()
});

// components/products/ProductForm.tsx
export function ProductForm() {
  const [trackQuantity, setTrackQuantity] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  return (
    <FormBuilder
      schema={productSchema}
      action={createProduct}
      fields={[
        // Información básica
        {
          name: 'name',
          type: 'text',
          label: 'Nombre del producto',
          required: true,
          maxLength: 100,
          validation: 'realtime'
        },
        {
          name: 'sku',
          type: 'text',
          label: 'SKU',
          required: true,
          placeholder: 'PROD-001',
          description: 'Código único del producto'
        },
        {
          name: 'shortDescription',
          type: 'textarea',
          label: 'Descripción corta',
          maxLength: 160,
          showCharCount: true,
          rows: 2,
          description: 'Para listados y búsquedas'
        },
        {
          name: 'description',
          type: 'rich-text',
          label: 'Descripción completa',
          required: true,
          height: 300,
          extensions: ['bold', 'italic', 'link', 'bullet-list', 'image']
        },
        
        // Categorización
        {
          name: 'category',
          type: 'searchable-select',
          label: 'Categoría',
          required: true,
          options: categoryOptions,
          searchable: true,
          gridColumn: 1
        },
        {
          name: 'subcategory',
          type: 'select',
          label: 'Subcategoría',
          options: subcategoryOptions,
          gridColumn: 1
        },
        
        // Precios
        {
          name: 'price',
          type: 'number',
          label: 'Precio',
          required: true,
          min: 0.01,
          step: 0.01,
          gridColumn: 1
        },
        {
          name: 'comparePrice',
          type: 'number',
          label: 'Precio de comparación',
          min: 0,
          step: 0.01,
          gridColumn: 1,
          description: 'Precio tachado'
        },
        {
          name: 'cost',
          type: 'number',
          label: 'Costo',
          min: 0,
          step: 0.01,
          description: 'Para cálculo de márgenes'
        },
        
        // Imágenes
        {
          name: 'images',
          type: 'multi-file-upload',
          label: 'Imágenes del producto',
          required: true,
          accept: 'image/*',
          maxFiles: 10,
          maxSize: 5242880, // 5MB
          preview: true,
          dragDrop: true,
          description: 'Máximo 10 imágenes, 5MB cada una'
        },
        
        // Inventario
        {
          name: 'inventory.trackQuantity',
          type: 'toggle',
          label: 'Rastrear inventario'
        },
        ...(trackQuantity ? [
          {
            name: 'inventory.quantity',
            type: 'number' as const,
            label: 'Cantidad en stock',
            min: 0,
            gridColumn: 1
          },
          {
            name: 'inventory.allowBackorder',
            type: 'toggle' as const,
            label: 'Permitir pedidos sin stock',
            gridColumn: 1
          }
        ] : []),
        
        // Tags
        {
          name: 'tags',
          type: 'multi-select',
          label: 'Etiquetas',
          options: [], // Se cargan dinámicamente
          createOption: true,
          maxSelections: 20,
          description: 'Para búsquedas y filtros'
        },
        
        // Estado
        {
          name: 'isActive',
          type: 'toggle',
          label: 'Producto activo',
          gridColumn: 1
        },
        {
          name: 'isFeatured',
          type: 'toggle',
          label: 'Producto destacado',
          gridColumn: 1
        }
      ]}
      layout={{
        type: 'grid',
        columns: 2,
        gap: 6
      }}
      onFieldChange={(name, value) => {
        if (name === 'inventory.trackQuantity') {
          setTrackQuantity(value);
        }
      }}
      submitLabel="Crear Producto"
      className="space-y-8"
    />
  );
}
```

## 📝 Mejores Prácticas para Casos Complejos

### 1. Estructuración de Esquemas

```tsx
// ✅ BIEN: Esquemas modulares
const userPersonalSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email()
});

const userContactSchema = z.object({
  phone: z.string(),
  address: z.string()
});

const fullUserSchema = userPersonalSchema.merge(userContactSchema);

// ❌ EVITAR: Esquemas monolíticos
const hugeLostSchema = z.object({
  // 50+ campos mezclados...
});
```

### 2. Validaciones Condicionales

```tsx
// ✅ BIEN: Validaciones claras y específicas
const conditionalSchema = z.object({
  userType: z.enum(['individual', 'business']),
  name: z.string(),
  businessName: z.string().optional(),
  taxId: z.string().optional()
}).refine((data) => {
  if (data.userType === 'business') {
    return data.businessName && data.taxId;
  }
  return true;
}, {
  message: 'Datos de empresa requeridos',
  path: ['businessName']
});
```

### 3. Manejo de Estado Complejo

```tsx
// ✅ BIEN: Estado calculado y memoizado
const ComplexForm = () => {
  const [formState, setFormState] = useState({});
  
  const conditionalFields = useMemo(() => {
    return calculateFieldsBasedOnState(formState);
  }, [formState]);
  
  return (
    <FormBuilder
      fields={conditionalFields}
      onFieldChange={(name, value) => {
        setFormState(prev => ({ ...prev, [name]: value }));
      }}
    />
  );
};
```

---

¿Necesitas ayuda con un caso específico? ¡Consulta la [API Reference](./api-reference.md)! 🚀