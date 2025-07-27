# Ejemplos Completos

Implementaciones completas y funcionales del sistema FormBuilder para diferentes casos de uso.

## 🔐 Ejemplo 1: Sistema de Autenticación Completo

### Login Form

```tsx
// components/auth/LoginForm.tsx
'use client';

import { FormBuilder } from '@/components/Form';
import { loginSchema } from '@/components/Form/validation/schemas/userSchemas';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export function LoginForm() {
  const handleLogin = async (formData: FormData): Promise<ActionResult> => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (res?.error) {
        return {
          success: false,
          error: res.error === 'CredentialsSignin' 
            ? 'Credenciales inválidas' 
            : res.error
        };
      }

      if (res?.ok) {
        window.location.href = '/dashboard';
        return {
          success: true,
          data: { email }
        };
      }

      return {
        success: false,
        error: 'Error desconocido'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error de conexión'
      };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Iniciar Sesión
            </CardTitle>
            <CardDescription>
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormBuilder
              schema={loginSchema}
              action={handleLogin}
              fields={[
                {
                  name: 'email',
                  type: 'email',
                  label: 'Correo Electrónico',
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
                  showPasswordToggle: true,
                  validation: 'onBlur'
                }
              ]}
              layout={{ type: 'stack', gap: 4 }}
              options={{
                progressiveEnhancement: true,
                realTimeValidation: true,
                focusFirstError: true,
                resetOnSuccess: false
              }}
              submitLabel="Iniciar Sesión"
              loadingLabel="Iniciando sesión..."
              onSuccess={() => {
                toast.success('¡Bienvenido de vuelta!');
              }}
              onError={(errors) => {
                if (typeof errors === 'string') {
                  toast.error(errors);
                } else {
                  toast.error('Error al iniciar sesión');
                }
              }}
              className="space-y-4"
            />
            
            <div className="mt-6 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" className="text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

## 👤 Ejemplo 2: Formulario de Registro Avanzado

### Schema de Registro

```tsx
// schemas/registrationSchema.ts
import { z } from 'zod';

export const registrationSchema = z.object({
  firstName: z.string()
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras y espacios'),
  
  lastName: z.string()
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras y espacios'),
  
  email: z.string()
    .min(1, 'Email requerido')
    .email('Formato de email inválido')
    .refine(async (email) => {
      // Validación asíncrona para verificar si el email ya existe
      const response = await fetch(\`/api/check-email?email=\${email}\`);
      const data = await response.json();
      return !data.exists;
    }, 'Este email ya está registrado'),
  
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  
  confirmPassword: z.string(),
  
  phone: z.string()
    .regex(/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Formato de teléfono inválido'),
  
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 120;
    }, 'Debes ser mayor de 18 años'),
  
  country: z.string().min(1, 'País requerido'),
  
  acceptTerms: z.boolean()
    .refine(val => val === true, 'Debes aceptar los términos y condiciones'),
  
  acceptPrivacy: z.boolean()
    .refine(val => val === true, 'Debes aceptar la política de privacidad'),
  
  newsletter: z.boolean().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

export type RegistrationData = z.infer<typeof registrationSchema>;
```

### Server Action

```tsx
// actions/authActions.ts
'use server';

import { registrationSchema } from '@/schemas/registrationSchema';
import { hash } from 'bcrypt';
import { db } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';
import type { ActionResult } from '@/components/Form/types/FormBuilderTypes';

export async function registerUser(formData: FormData): Promise<ActionResult> {
  try {
    // Validación server-side
    const rawData = Object.fromEntries(formData);
    const result = registrationSchema.safeParse(rawData);
    
    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors
      };
    }

    const { confirmPassword, acceptTerms, acceptPrivacy, ...userData } = result.data;

    // Verificar si el usuario ya existe
    const existingUser = await db.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return {
        success: false,
        errors: { email: ['Este email ya está registrado'] }
      };
    }

    // Hash de la contraseña
    const hashedPassword = await hash(userData.password, 12);

    // Crear usuario
    const user = await db.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        emailVerified: false,
        createdAt: new Date()
      }
    });

    // Enviar email de bienvenida
    await sendWelcomeEmail(user.email, user.firstName);

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName
      }
    };

  } catch (error) {
    console.error('Error en registro:', error);
    return {
      success: false,
      error: 'Error interno del servidor'
    };
  }
}
```

### Formulario de Registro

```tsx
// components/auth/RegistrationForm.tsx
'use client';

import { useState } from 'react';
import { FormBuilder } from '@/components/Form';
import { registrationSchema } from '@/schemas/registrationSchema';
import { registerUser } from '@/actions/authActions';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export function RegistrationForm() {
  const router = useRouter();
  const [countries] = useState([
    { value: 'mx', label: 'México' },
    { value: 'us', label: 'Estados Unidos' },
    { value: 'ca', label: 'Canadá' },
    { value: 'es', label: 'España' },
    { value: 'ar', label: 'Argentina' },
    { value: 'co', label: 'Colombia' }
  ]);

  const handleSuccess = (data: any) => {
    toast.success('¡Cuenta creada exitosamente!', {
      description: 'Revisa tu email para verificar tu cuenta.'
    });
    router.push('/auth/verify-email');
  };

  const handleError = (errors: any) => {
    toast.error('Error al crear la cuenta', {
      description: 'Por favor revisa los datos ingresados.'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-2xl w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Crear Cuenta
            </CardTitle>
            <CardDescription>
              Completa tus datos para crear tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormBuilder
              schema={registrationSchema}
              action={registerUser}
              fields={[
                {
                  name: 'firstName',
                  type: 'text',
                  label: 'Nombre',
                  placeholder: 'Tu nombre',
                  required: true,
                  gridColumn: 1,
                  validation: 'realtime'
                },
                {
                  name: 'lastName',
                  type: 'text',
                  label: 'Apellido',
                  placeholder: 'Tu apellido',
                  required: true,
                  gridColumn: 1,
                  validation: 'realtime'
                },
                {
                  name: 'email',
                  type: 'email',
                  label: 'Correo Electrónico',
                  placeholder: 'tu@email.com',
                  required: true,
                  validation: 'realtime',
                  autoComplete: 'email',
                  description: 'Usaremos este email para contactarte'
                },
                {
                  name: 'phone',
                  type: 'phone',
                  label: 'Teléfono',
                  placeholder: '+52 55 1234 5678',
                  required: true,
                  validation: 'onBlur'
                },
                {
                  name: 'birthDate',
                  type: 'date',
                  label: 'Fecha de Nacimiento',
                  required: true,
                  gridColumn: 1,
                  description: 'Debes ser mayor de 18 años'
                },
                {
                  name: 'country',
                  type: 'select',
                  label: 'País',
                  required: true,
                  gridColumn: 1,
                  options: countries,
                  placeholder: 'Selecciona tu país'
                },
                {
                  name: 'password',
                  type: 'password',
                  label: 'Contraseña',
                  required: true,
                  showPasswordToggle: true,
                  validation: 'realtime',
                  description: 'Mín. 8 caracteres, incluye mayúscula, minúscula, número y símbolo'
                },
                {
                  name: 'confirmPassword',
                  type: 'password',
                  label: 'Confirmar Contraseña',
                  required: true,
                  showPasswordToggle: true,
                  validation: 'onBlur'
                },
                {
                  name: 'acceptTerms',
                  type: 'checkbox',
                  label: 'Acepto los términos y condiciones',
                  required: true,
                  description: 'Lee nuestros términos de servicio'
                },
                {
                  name: 'acceptPrivacy',
                  type: 'checkbox',
                  label: 'Acepto la política de privacidad',
                  required: true,
                  description: 'Conoce cómo protegemos tus datos'
                },
                {
                  name: 'newsletter',
                  type: 'checkbox',
                  label: 'Quiero recibir el newsletter',
                  description: 'Recibe noticias y actualizaciones por email'
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
                resetOnSuccess: true,
                validateOnBlur: true
              }}
              submitLabel="Crear Cuenta"
              loadingLabel="Creando cuenta..."
              onSuccess={handleSuccess}
              onError={handleError}
              className="space-y-6"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

## 📞 Ejemplo 3: Formulario de Contacto Empresarial

```tsx
// components/contact/ContactForm.tsx
'use client';

import { FormBuilder } from '@/components/Form';
import { z } from 'zod';
import { toast } from 'sonner';

const contactSchema = z.object({
  contactType: z.enum(['general', 'sales', 'support', 'partnership']),
  company: z.string().min(2, 'Nombre de empresa requerido'),
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Teléfono inválido'),
  jobTitle: z.string().optional(),
  industry: z.string().min(1, 'Industria requerida'),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']),
  subject: z.string().min(5, 'Asunto muy corto').max(100, 'Asunto muy largo'),
  message: z.string().min(20, 'Mensaje muy corto').max(2000, 'Mensaje muy largo'),
  budget: z.enum(['<10k', '10k-50k', '50k-100k', '100k+', 'not-sure']).optional(),
  timeline: z.enum(['asap', '1-3months', '3-6months', '6months+', 'not-sure']).optional(),
  hearAboutUs: z.enum(['google', 'social-media', 'referral', 'event', 'other']).optional(),
  acceptMarketing: z.boolean().optional()
});

export function ContactForm() {
  const contactTypeOptions = [
    { value: 'general', label: '💬 Consulta General' },
    { value: 'sales', label: '💰 Ventas' },
    { value: 'support', label: '🆘 Soporte Técnico' },
    { value: 'partnership', label: '🤝 Alianzas' }
  ];

  const industryOptions = [
    { value: 'technology', label: 'Tecnología' },
    { value: 'healthcare', label: 'Salud' },
    { value: 'finance', label: 'Finanzas' },
    { value: 'education', label: 'Educación' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufactura' },
    { value: 'other', label: 'Otro' }
  ];

  const handleContactSubmit = async (formData: FormData): Promise<ActionResult> => {
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error al enviar mensaje');
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: 'Error al enviar el mensaje'
      };
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Contáctanos</h1>
        <p className="text-muted-foreground">
          Completa el formulario y nos pondremos en contacto contigo
        </p>
      </div>

      <FormBuilder
        schema={contactSchema}
        action={handleContactSubmit}
        fields={[
          {
            name: 'contactType',
            type: 'select',
            label: 'Tipo de Consulta',
            required: true,
            options: contactTypeOptions,
            placeholder: 'Selecciona el tipo de consulta'
          },
          {
            name: 'company',
            type: 'text',
            label: 'Empresa',
            required: true,
            placeholder: 'Nombre de tu empresa',
            gridColumn: 1
          },
          {
            name: 'industry',
            type: 'select',
            label: 'Industria',
            required: true,
            options: industryOptions,
            gridColumn: 1
          },
          {
            name: 'firstName',
            type: 'text',
            label: 'Nombre',
            required: true,
            placeholder: 'Tu nombre',
            gridColumn: 1
          },
          {
            name: 'lastName',
            type: 'text',
            label: 'Apellido',
            required: true,
            placeholder: 'Tu apellido',
            gridColumn: 1
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email',
            required: true,
            placeholder: 'tu@empresa.com',
            validation: 'realtime',
            gridColumn: 1
          },
          {
            name: 'phone',
            type: 'phone',
            label: 'Teléfono',
            required: true,
            placeholder: '+52 55 1234 5678',
            gridColumn: 1
          },
          {
            name: 'jobTitle',
            type: 'text',
            label: 'Cargo',
            placeholder: 'Tu posición en la empresa'
          },
          {
            name: 'companySize',
            type: 'select',
            label: 'Tamaño de Empresa',
            required: true,
            options: [
              { value: '1-10', label: '1-10 empleados' },
              { value: '11-50', label: '11-50 empleados' },
              { value: '51-200', label: '51-200 empleados' },
              { value: '201-1000', label: '201-1000 empleados' },
              { value: '1000+', label: 'Más de 1000 empleados' }
            ]
          },
          {
            name: 'subject',
            type: 'text',
            label: 'Asunto',
            required: true,
            placeholder: 'Resumen de tu consulta',
            maxLength: 100
          },
          {
            name: 'message',
            type: 'textarea',
            label: 'Mensaje',
            required: true,
            placeholder: 'Describe tu consulta en detalle...',
            rows: 6,
            maxLength: 2000,
            showCharCount: true
          },
          {
            name: 'budget',
            type: 'select',
            label: 'Presupuesto Estimado',
            options: [
              { value: '<10k', label: 'Menos de $10,000' },
              { value: '10k-50k', label: '$10,000 - $50,000' },
              { value: '50k-100k', label: '$50,000 - $100,000' },
              { value: '100k+', label: 'Más de $100,000' },
              { value: 'not-sure', label: 'No estoy seguro' }
            ],
            placeholder: 'Selecciona un rango',
            gridColumn: 1
          },
          {
            name: 'timeline',
            type: 'select',
            label: 'Timeline del Proyecto',
            options: [
              { value: 'asap', label: 'Lo antes posible' },
              { value: '1-3months', label: '1-3 meses' },
              { value: '3-6months', label: '3-6 meses' },
              { value: '6months+', label: 'Más de 6 meses' },
              { value: 'not-sure', label: 'No estoy seguro' }
            ],
            placeholder: 'Selecciona timeline',
            gridColumn: 1
          },
          {
            name: 'hearAboutUs',
            type: 'select',
            label: '¿Cómo supiste de nosotros?',
            options: [
              { value: 'google', label: 'Google' },
              { value: 'social-media', label: 'Redes Sociales' },
              { value: 'referral', label: 'Recomendación' },
              { value: 'event', label: 'Evento' },
              { value: 'other', label: 'Otro' }
            ],
            placeholder: 'Selecciona una opción'
          },
          {
            name: 'acceptMarketing',
            type: 'checkbox',
            label: 'Quiero recibir información de productos y servicios',
            description: 'Puedes cancelar la suscripción en cualquier momento'
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
        submitLabel="Enviar Mensaje"
        loadingLabel="Enviando mensaje..."
        onSuccess={() => {
          toast.success('¡Mensaje enviado!', {
            description: 'Nos pondremos en contacto contigo pronto.'
          });
        }}
        onError={() => {
          toast.error('Error al enviar', {
            description: 'Por favor intenta de nuevo.'
          });
        }}
        className="space-y-8"
      />
    </div>
  );
}
```

## 🛠️ Ejemplo 4: Configuraciones del Sistema

```tsx
// components/settings/SystemSettingsForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { FormBuilder } from '@/components/Form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Schema modular
const generalSettingsSchema = z.object({
  siteName: z.string().min(1, 'Nombre del sitio requerido'),
  siteDescription: z.string().max(500, 'Máximo 500 caracteres'),
  timezone: z.string(),
  language: z.string(),
  currency: z.string(),
  maintenanceMode: z.boolean()
});

const emailSettingsSchema = z.object({
  emailProvider: z.enum(['smtp', 'sendgrid', 'ses']),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  fromEmail: z.string().email('Email inválido'),
  fromName: z.string()
});

const securitySettingsSchema = z.object({
  requireTwoFactor: z.boolean(),
  sessionTimeout: z.number().min(5).max(1440),
  maxLoginAttempts: z.number().min(3).max(10),
  passwordMinLength: z.number().min(6).max(20),
  requirePasswordSymbols: z.boolean(),
  allowPasswordReset: z.boolean()
});

export function SystemSettingsForm() {
  const [activeTab, setActiveTab] = useState('general');
  const [emailProvider, setEmailProvider] = useState('smtp');
  const [currentSettings, setCurrentSettings] = useState({});

  // Cargar configuraciones actuales
  useEffect(() => {
    // Simular carga de configuraciones
    setCurrentSettings({
      siteName: 'Mi Aplicación',
      timezone: 'America/Mexico_City',
      language: 'es',
      emailProvider: 'smtp',
      requireTwoFactor: false
    });
  }, []);

  const handleGeneralSubmit = async (formData: FormData): Promise<ActionResult> => {
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, data: Object.fromEntries(formData) };
    } catch (error) {
      return { success: false, error: 'Error al guardar' };
    }
  };

  const renderGeneralSettings = () => (
    <FormBuilder
      schema={generalSettingsSchema}
      action={handleGeneralSubmit}
      defaultValues={currentSettings}
      fields={[
        {
          name: 'siteName',
          type: 'text',
          label: 'Nombre del Sitio',
          required: true,
          placeholder: 'Mi Aplicación',
          gridColumn: 1
        },
        {
          name: 'language',
          type: 'select',
          label: 'Idioma',
          required: true,
          options: [
            { value: 'es', label: 'Español' },
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'Français' }
          ],
          gridColumn: 1
        },
        {
          name: 'siteDescription',
          type: 'textarea',
          label: 'Descripción',
          placeholder: 'Descripción de tu aplicación...',
          maxLength: 500,
          showCharCount: true,
          rows: 3
        },
        {
          name: 'timezone',
          type: 'searchable-select',
          label: 'Zona Horaria',
          required: true,
          options: [
            { value: 'America/Mexico_City', label: 'México (GMT-6)' },
            { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
            { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
            { value: 'Asia/Tokyo', label: 'Tokio (GMT+9)' }
          ],
          searchable: true,
          gridColumn: 1
        },
        {
          name: 'currency',
          type: 'select',
          label: 'Moneda',
          options: [
            { value: 'MXN', label: 'Peso Mexicano (MXN)' },
            { value: 'USD', label: 'Dólar (USD)' },
            { value: 'EUR', label: 'Euro (EUR)' }
          ],
          gridColumn: 1
        },
        {
          name: 'maintenanceMode',
          type: 'toggle',
          label: 'Modo Mantenimiento',
          description: 'Activar para mostrar página de mantenimiento'
        }
      ]}
      layout={{ type: 'grid', columns: 2, gap: 6 }}
      submitLabel="Guardar Configuración General"
      onSuccess={() => toast.success('Configuración guardada')}
    />
  );

  const getEmailFields = () => {
    const baseFields = [
      {
        name: 'emailProvider',
        type: 'select' as const,
        label: 'Proveedor de Email',
        required: true,
        options: [
          { value: 'smtp', label: 'SMTP Custom' },
          { value: 'sendgrid', label: 'SendGrid' },
          { value: 'ses', label: 'Amazon SES' }
        ]
      },
      {
        name: 'fromEmail',
        type: 'email' as const,
        label: 'Email Remitente',
        required: true,
        placeholder: 'noreply@tudominio.com',
        gridColumn: 1
      },
      {
        name: 'fromName',
        type: 'text' as const,
        label: 'Nombre Remitente',
        required: true,
        placeholder: 'Tu Aplicación',
        gridColumn: 1
      }
    ];

    if (emailProvider === 'smtp') {
      baseFields.push(
        {
          name: 'smtpHost',
          type: 'text' as const,
          label: 'Servidor SMTP',
          required: true,
          placeholder: 'smtp.gmail.com',
          gridColumn: 1
        },
        {
          name: 'smtpPort',
          type: 'number' as const,
          label: 'Puerto',
          required: true,
          placeholder: '587',
          gridColumn: 1
        },
        {
          name: 'smtpUser',
          type: 'email' as const,
          label: 'Usuario SMTP',
          required: true,
          placeholder: 'tu@email.com'
        },
        {
          name: 'smtpPassword',
          type: 'password' as const,
          label: 'Contraseña SMTP',
          required: true,
          showPasswordToggle: true,
          description: 'Usa una contraseña de aplicación si usas 2FA'
        }
      );
    }

    return baseFields;
  };

  const renderEmailSettings = () => (
    <FormBuilder
      schema={emailSettingsSchema}
      action={handleGeneralSubmit}
      defaultValues={currentSettings}
      fields={getEmailFields()}
      layout={{ type: 'grid', columns: 2, gap: 6 }}
      onFieldChange={(name, value) => {
        if (name === 'emailProvider') {
          setEmailProvider(value);
        }
      }}
      submitLabel="Guardar Configuración de Email"
      onSuccess={() => toast.success('Configuración de email guardada')}
    />
  );

  const renderSecuritySettings = () => (
    <FormBuilder
      schema={securitySettingsSchema}
      action={handleGeneralSubmit}
      defaultValues={currentSettings}
      fields={[
        {
          name: 'requireTwoFactor',
          type: 'toggle',
          label: 'Requerir Autenticación de Dos Factores',
          description: 'Obligatorio para todos los usuarios'
        },
        {
          name: 'sessionTimeout',
          type: 'number',
          label: 'Timeout de Sesión (minutos)',
          required: true,
          min: 5,
          max: 1440,
          placeholder: '30',
          gridColumn: 1
        },
        {
          name: 'maxLoginAttempts',
          type: 'number',
          label: 'Máximo Intentos de Login',
          required: true,
          min: 3,
          max: 10,
          placeholder: '5',
          gridColumn: 1
        },
        {
          name: 'passwordMinLength',
          type: 'number',
          label: 'Longitud Mínima de Contraseña',
          required: true,
          min: 6,
          max: 20,
          placeholder: '8',
          gridColumn: 1
        },
        {
          name: 'requirePasswordSymbols',
          type: 'toggle',
          label: 'Requerir Símbolos en Contraseñas',
          description: 'Forzar uso de caracteres especiales',
          gridColumn: 1
        },
        {
          name: 'allowPasswordReset',
          type: 'toggle',
          label: 'Permitir Recuperación de Contraseña',
          description: 'Los usuarios pueden resetear su contraseña por email'
        }
      ]}
      layout={{ type: 'grid', columns: 2, gap: 6 }}
      submitLabel="Guardar Configuración de Seguridad"
      onSuccess={() => toast.success('Configuración de seguridad guardada')}
    />
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuración del Sistema</h1>
        <p className="text-muted-foreground">
          Administra la configuración global de tu aplicación
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Configuración General</h2>
            {renderGeneralSettings()}
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Configuración de Email</h2>
            {renderEmailSettings()}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Configuración de Seguridad</h2>
            {renderSecuritySettings()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 🚀 Cómo usar estos ejemplos

1. **Copia el código** que necesites para tu proyecto
2. **Adapta los schemas** a tus necesidades específicas
3. **Personaliza los campos** según tu diseño
4. **Ajusta las validaciones** a tus reglas de negocio
5. **Implementa los Server Actions** con tu lógica

¿Necesitas más ejemplos específicos? ¡Consulta la [guía básica](./guia-basica.md)! 🎯