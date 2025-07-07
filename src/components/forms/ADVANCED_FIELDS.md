# 🚀 Campos Avanzados - Sistema de Formularios

El sistema de formularios ahora soporta componentes complejos como Rich Text Editor, Select avanzados, Checkboxes y componentes personalizados.

## 📋 **Nuevos Tipos de Campo Soportados**

### **1. Rich Text Editor**

#### **Usando FormField:**
```tsx
<FormField
  name="description"
  label="Descripción"
  type="richtext"
  imageFolder="post-images"
  validation={validationSchemas.required('La descripción es obligatoria')}
  helpText="Usa el editor para dar formato al contenido"
/>
```

#### **Usando RichTextField (componente especializado):**
```tsx
<RichTextField
  name="content"
  label="Contenido del Artículo"
  imageFolder="articles"
  validation={validationSchemas.required()}
  helpText="Editor completo con soporte para imágenes"
/>
```

**Props específicas:**
- `imageFolder`: Carpeta donde se guardan las imágenes subidas
- Integración completa con React Hook Form
- Validación en tiempo real del contenido HTML

---

### **2. Select Mejorado**

#### **Usando FormField:**
```tsx
<FormField
  name="category"
  label="Categoría"
  type="select"
  options={[
    { value: 'tech', label: 'Tecnología' },
    { value: 'design', label: 'Diseño' },
    { value: 'business', label: 'Negocios' }
  ]}
  placeholder="Selecciona una categoría"
  validation={validationSchemas.required()}
/>
```

#### **Usando SelectField (componente especializado):**
```tsx
<SelectField
  name="priority"
  label="Prioridad"
  options={[
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta', disabled: true }
  ]}
  validation={validationSchemas.required()}
  helpText="Selecciona el nivel de prioridad"
/>
```

**Características:**
- Opciones con estado `disabled`
- Placeholder personalizable
- Integración con validación
- Búsqueda automática (según configuración de shadcn/ui)

---

### **3. Checkbox**

#### **Usando FormField:**
```tsx
<FormField
  name="terms"
  label="Acepto los términos y condiciones"
  type="checkbox"
  description="He leído y acepto los términos de uso"
  validation={validationSchemas.required('Debes aceptar los términos')}
/>
```

#### **Usando CheckboxField (componente especializado):**
```tsx
<CheckboxField
  name="newsletter"
  label="Suscribirse al newsletter"
  description="Recibir actualizaciones por email"
  helpText="Puedes cancelar la suscripción en cualquier momento"
/>
```

**Props específicas:**
- `description`: Texto adicional junto al checkbox
- Layout automático con espaciado correcto
- Estados de error integrados

---

### **4. Componentes Personalizados**

Para casos donde necesitas un componente completamente personalizado:

```tsx
<FormField
  name="custom_field"
  label="Campo Personalizado"
  type="custom"
  validation={validationSchemas.required()}
>
  <CustomComponent
    value={watch('custom_field')}
    onChange={(value) => setValue('custom_field', value)}
    error={errors.custom_field}
  />
</FormField>
```

**Ventajas:**
- ✅ Mantiene la estructura visual consistente
- ✅ Manejo automático de labels y errores
- ✅ Integración con validación
- ✅ Estados de loading automáticos

---

## 🎯 **Ejemplos Prácticos**

### **Formulario de Blog Post**
```tsx
<FormWrapper onSubmit={createPost}>
  <FormField
    name="title"
    label="Título del Post"
    validation={validationSchemas.required()}
  />
  
  <FormField
    name="content"
    label="Contenido"
    type="richtext"
    imageFolder="blog-posts"
    validation={validationSchemas.required()}
  />
  
  <FormField
    name="category"
    label="Categoría"
    type="select"
    options={categories}
    validation={validationSchemas.required()}
  />
  
  <FormField
    name="published"
    label="Publicar inmediatamente"
    type="checkbox"
    description="El post será visible públicamente"
  />
  
  <StandardFormActions />
</FormWrapper>
```

### **Formulario de Ticket/Soporte**
```tsx
<FormWrapper onSubmit={createTicket}>
  <FormField
    name="subject"
    label="Asunto"
    placeholder="Describe brevemente el problema"
    validation={validationSchemas.required()}
  />
  
  <RichTextField
    name="description"
    label="Descripción Detallada"
    imageFolder="tickets"
    validation={validationSchemas.required()}
    helpText="Describe el problema con todos los detalles posibles"
  />
  
  <SelectField
    name="priority"
    label="Prioridad"
    options={[
      { value: 'low', label: 'Baja' },
      { value: 'medium', label: 'Media' },
      { value: 'high', label: 'Alta' },
      { value: 'urgent', label: 'Urgente' }
    ]}
    validation={validationSchemas.required()}
  />
  
  <CheckboxField
    name="urgent"
    label="Marcar como urgente"
    description="Requiere atención inmediata"
  />
  
  <StandardFormActions submitText="Crear Ticket" />
</FormWrapper>
```

---

## 🔧 **Validaciones Específicas**

### **Rich Text Editor**
```tsx
const richTextValidation = {
  required: 'El contenido es obligatorio',
  validate: {
    notEmpty: (value: string) => {
      // Verificar que no esté vacío después de remover HTML
      const text = value.replace(/<[^>]*>/g, '').trim();
      return text.length > 0 || 'El contenido no puede estar vacío';
    },
    minLength: (value: string) => {
      const text = value.replace(/<[^>]*>/g, '').trim();
      return text.length >= 10 || 'El contenido debe tener al menos 10 caracteres';
    }
  }
};
```

### **Select con Validación Personalizada**
```tsx
const selectValidation = {
  required: 'Debes seleccionar una opción',
  validate: {
    notDefault: (value: string) => {
      return value !== 'default' || 'Selecciona una opción válida';
    }
  }
};
```

---

## ⚡ **Ventajas del Nuevo Sistema**

### **Para Rich Text Editor:**
- ✅ **Integración automática** con React Hook Form
- ✅ **Validación en tiempo real** del contenido HTML
- ✅ **Estados de error** mostrados correctamente
- ✅ **Upload de imágenes** configurable por formulario
- ✅ **Contador de palabras** automático

### **Para Select:**
- ✅ **Búsqueda automática** (si está configurada)
- ✅ **Opciones con estado disabled**
- ✅ **Placeholder personalizable**
- ✅ **Validación inmediata** al seleccionar

### **Para Checkbox:**
- ✅ **Layout consistente** con otros campos
- ✅ **Descripción adicional** integrada
- ✅ **Estados de error** claros
- ✅ **Accesibilidad** mejorada

---

## 🚀 **Migración de Formularios Existentes**

### **Antes (Rich Text Manual):**
```tsx
const [content, setContent] = useState('');
const [error, setError] = useState('');

<RichTextEditor
  content={content}
  onChangeAction={setContent}
/>
{error && <p className="error">{error}</p>}
```

### **Después (Integrado):**
```tsx
<FormField
  name="content"
  label="Contenido"
  type="richtext"
  validation={validationSchemas.required()}
/>
```

**Reducción:** ~70% menos código manual

---

## 📈 **Rendimiento**

- **Rich Text Editor:** Integración optimizada sin re-renders innecesarios
- **Select:** Búsqueda y filtrado eficiente
- **Validación:** Solo se ejecuta cuando es necesario
- **Estados:** Manejo centralizado reduce overhead

---

## 🎯 **Próximas Mejoras**

1. **DatePicker** integrado
2. **MultiSelect** con checkboxes
3. **ColorPicker** para themes
4. **RatingField** con estrellas
5. **TagsInput** con autocompletado
6. **FileUpload** con drag & drop
7. **RangeSlider** para números
8. **CodeEditor** para desarrolladores

---

El sistema ahora soporta cualquier tipo de campo complejo manteniendo la consistencia y simplicidad del API. ¡Rich Text Editor es solo el comienzo! 🎉