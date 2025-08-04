# Biblioteca de Patrones UI - Referencia Práctica

> Catálogo de patrones de diseño con implementaciones específicas para Next.js, React, Tailwind CSS y Shadcn/ui

## 📋 Índice

1. [Patrones de Navegación](#patrones-de-navegación)
2. [Patrones de Formularios](#patrones-de-formularios)
3. [Patrones de Contenido](#patrones-de-contenido)
4. [Patrones de Feedback](#patrones-de-feedback)
5. [Patrones Móviles](#patrones-móviles)
6. [Patrones de Data Display](#patrones-de-data-display)
7. [Micro-interacciones](#micro-interacciones)
8. [Layout Patterns](#layout-patterns)

---

## 🧭 Patrones de Navegación

### 1. Header Navigation

**Patrón:** Navegación principal horizontal con logo y menú

```jsx
// components/Navigation/Header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Proyectos' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/settings', label: 'Configuración' }
  ]

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* Logo */}
        <Link href="/" className="mr-6">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden ml-auto"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col space-y-3 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-foreground/80"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
```

### 2. Sidebar Navigation

**Patrón:** Navegación lateral colapsable

```jsx
// components/Navigation/Sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Home, Settings, Users, BarChart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Usuarios', href: '/users', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart },
    { name: 'Configuración', href: '/settings', icon: Settings },
  ]

  return (
    <div className={cn(
      "flex flex-col h-full bg-background border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h2 className="text-lg font-semibold">Panel</h2>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                "hover:bg-accent hover:text-accent-foreground",
                "transition-colors"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
```

### 3. Breadcrumbs

**Patrón:** Navegación jerárquica

```jsx
// components/Navigation/Breadcrumbs.tsx
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

// Uso
<Breadcrumbs 
  items={[
    { label: 'Proyectos', href: '/projects' },
    { label: 'Mi Proyecto', href: '/projects/123' },
    { label: 'Configuración' }
  ]} 
/>
```

---

## 📝 Patrones de Formularios

### 1. Form Field con Validación

**Patrón:** Campo de formulario con label, validación y feedback

```jsx
// components/Form/FormField.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helper?: string
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helper, className, ...props }, ref) => {
    return (
      <div className="grid w-full items-center gap-1.5">
        <Label 
          htmlFor={props.id}
          className={cn(error && "text-destructive")}
        >
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        
        <Input
          ref={ref}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        
        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}
        
        {helper && !error && (
          <p className="text-sm text-muted-foreground">{helper}</p>
        )}
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { FormField }
```

### 2. Multi-step Form

**Patrón:** Formulario por pasos con progreso

```jsx
// components/Form/MultiStepForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Check } from 'lucide-react'

interface Step {
  id: string
  title: string
  component: React.ComponentType<any>
}

interface MultiStepFormProps {
  steps: Step[]
  onComplete: (data: any) => void
}

export function MultiStepForm({ steps, onComplete }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = (stepData: any) => {
    const newFormData = { ...formData, ...stepData }
    setFormData(newFormData)
    
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(newFormData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {steps[currentStep].title}
          </h2>
          <span className="text-sm text-muted-foreground">
            Paso {currentStep + 1} de {steps.length}
          </span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        {/* Step Indicators */}
        <div className="flex items-center justify-between mt-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                index < currentStep || completedSteps.includes(index)
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}>
                {completedSteps.includes(index) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-12 h-0.5 mx-2",
                  index < currentStep ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mb-8">
        <CurrentStepComponent 
          data={formData}
          onNext={handleNext}
          onBack={handleBack}
          canGoBack={currentStep > 0}
          isLastStep={currentStep === steps.length - 1}
        />
      </div>
    </div>
  )
}
```

### 3. Search Input

**Patrón:** Campo de búsqueda con sugerencias

```jsx
// components/Form/SearchInput.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchResult {
  id: string
  title: string
  subtitle?: string
}

interface SearchInputProps {
  placeholder?: string
  onSearch: (query: string) => Promise<SearchResult[]>
  onSelect: (result: SearchResult) => void
  debounceMs?: number
}

export function SearchInput({ 
  placeholder = "Buscar...", 
  onSearch, 
  onSelect,
  debounceMs = 300 
}: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true)
        try {
          const searchResults = await onSearch(query)
          setResults(searchResults)
          setShowResults(true)
        } catch (error) {
          console.error('Search error:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setShowResults(false)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, onSearch, debounceMs])

  const handleClear = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
    inputRef.current?.focus()
  }

  const handleSelect = (result: SearchResult) => {
    onSelect(result)
    setQuery(result.title)
    setShowResults(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Buscando...
            </div>
          ) : results.length > 0 ? (
            results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="font-medium">{result.title}</div>
                {result.subtitle && (
                  <div className="text-sm text-muted-foreground">
                    {result.subtitle}
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

---

## 📄 Patrones de Contenido

### 1. Card Pattern

**Patrón:** Tarjeta de contenido flexible

```jsx
// components/Card/ContentCard.tsx
import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ContentCardProps {
  title: string
  description?: string
  image?: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  children?: ReactNode
  actions?: ReactNode
  onClick?: () => void
}

export function ContentCard({
  title,
  description,
  image,
  badge,
  badgeVariant = 'default',
  children,
  actions,
  onClick
}: ContentCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-1"
      )}
      onClick={onClick}
    >
      {image && (
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
          />
          {badge && (
            <Badge 
              variant={badgeVariant}
              className="absolute top-2 right-2"
            >
              {badge}
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="line-clamp-2">{title}</CardTitle>
            {description && (
              <CardDescription className="line-clamp-3">
                {description}
              </CardDescription>
            )}
          </div>
          {!image && badge && (
            <Badge variant={badgeVariant}>{badge}</Badge>
          )}
        </div>
      </CardHeader>
      
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
      
      {actions && (
        <CardFooter>
          {actions}
        </CardFooter>
      )}
    </Card>
  )
}

// Ejemplo de uso
<ContentCard
  title="Mi Proyecto"
  description="Descripción del proyecto con detalles importantes"
  badge="Activo"
  badgeVariant="default"
  image="/project-image.jpg"
  actions={
    <div className="flex space-x-2 w-full">
      <Button variant="outline" size="sm" className="flex-1">
        Ver detalles
      </Button>
      <Button size="sm" className="flex-1">
        Editar
      </Button>
    </div>
  }
/>
```

### 2. Empty State

**Patrón:** Estado vacío con ilustración y acción

```jsx
// components/EmptyState/EmptyState.tsx
import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}

// Uso con iconos de Lucide
import { FileText, Plus } from 'lucide-react'

<EmptyState
  icon={<FileText className="h-12 w-12" />}
  title="No hay proyectos"
  description="Aún no has creado ningún proyecto. Crea tu primer proyecto para comenzar."
  action={{
    label: "Crear proyecto",
    onClick: () => console.log('Crear proyecto')
  }}
  secondaryAction={{
    label: "Importar proyecto",
    onClick: () => console.log('Importar proyecto')
  }}
/>
```

### 3. Data List Pattern

**Patrón:** Lista de datos con acciones

```jsx
// components/DataList/DataList.tsx
'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataItem {
  id: string
  [key: string]: any
}

interface DataListProps<T extends DataItem> {
  items: T[]
  selectedItems?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  renderItem: (item: T) => ReactNode
  renderActions?: (item: T) => ReactNode
  showSelection?: boolean
}

export function DataList<T extends DataItem>({
  items,
  selectedItems = [],
  onSelectionChange,
  renderItem,
  renderActions,
  showSelection = false
}: DataListProps<T>) {
  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      onSelectionChange(checked ? items.map(item => item.id) : [])
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (onSelectionChange) {
      const newSelection = checked
        ? [...selectedItems, itemId]
        : selectedItems.filter(id => id !== itemId)
      onSelectionChange(newSelection)
    }
  }

  const allSelected = items.length > 0 && selectedItems.length === items.length
  const someSelected = selectedItems.length > 0 && selectedItems.length < items.length

  return (
    <div className="space-y-1">
      {/* Header con selección múltiple */}
      {showSelection && items.length > 0 && (
        <div className="flex items-center space-x-3 p-3 border-b">
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Seleccionar todos"
            className={someSelected ? "data-[state=checked]:bg-muted" : ""}
          />
          <span className="text-sm text-muted-foreground">
            {selectedItems.length > 0 
              ? `${selectedItems.length} seleccionados`
              : `${items.length} elementos`
            }
          </span>
        </div>
      )}

      {/* Lista de elementos */}
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
        >
          {showSelection && (
            <Checkbox
              checked={selectedItems.includes(item.id)}
              onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
              aria-label={`Seleccionar ${item.id}`}
            />
          )}
          
          <div className="flex-1 min-w-0">
            {renderItem(item)}
          </div>
          
          <div className="flex items-center space-x-2">
            {renderActions ? (
              renderActions(item)
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Ejemplo de uso
const users = [
  { id: '1', name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'Admin' },
  { id: '2', name: 'María García', email: 'maria@ejemplo.com', role: 'User' },
]

<DataList
  items={users}
  showSelection={true}
  selectedItems={selectedUsers}
  onSelectionChange={setSelectedUsers}
  renderItem={(user) => (
    <div>
      <div className="font-medium">{user.name}</div>
      <div className="text-sm text-muted-foreground">{user.email}</div>
    </div>
  )}
  renderActions={(user) => (
    <Button variant="outline" size="sm">
      Editar {user.name}
    </Button>
  )}
/>
```

---

## 💬 Patrones de Feedback

### 1. Toast Notifications

**Patrón:** Notificaciones temporales

```jsx
// components/Toast/ToastProvider.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 5000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const getToastIcon = (type: ToastType) => {
    const icons = {
      success: CheckCircle,
      error: XCircle,
      warning: AlertCircle,
      info: Info
    }
    const Icon = icons[type]
    return <Icon className="h-5 w-5" />
  }

  const getToastStyles = (type: ToastType) => {
    const styles = {
      success: 'border-green-200 bg-green-50 text-green-800',
      error: 'border-red-200 bg-red-50 text-red-800',
      warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
      info: 'border-blue-200 bg-blue-50 text-blue-800'
    }
    return styles[type]
  }

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "min-w-80 p-4 rounded-lg border shadow-lg transition-all duration-300",
              "animate-in slide-in-from-top-2",
              getToastStyles(toast.type)
            )}
          >
            <div className="flex items-start space-x-3">
              {getToastIcon(toast.type)}
              <div className="flex-1">
                <h4 className="font-medium">{toast.title}</h4>
                {toast.description && (
                  <p className="text-sm mt-1 opacity-90">{toast.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeToast(toast.id)}
                className="h-6 w-6 p-0 hover:bg-black/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// Hook de utilidad
export const useToastActions = () => {
  const { showToast } = useToast()
  
  return {
    success: (title: string, description?: string) => 
      showToast({ type: 'success', title, description }),
    error: (title: string, description?: string) => 
      showToast({ type: 'error', title, description }),
    warning: (title: string, description?: string) => 
      showToast({ type: 'warning', title, description }),
    info: (title: string, description?: string) => 
      showToast({ type: 'info', title, description }),
  }
}
```

### 2. Loading States

**Patrón:** Estados de carga y skeleton

```jsx
// components/Loading/LoadingStates.tsx
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// Loading Button
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
}

export function LoadingButton({ loading, children, disabled, ...props }: LoadingButtonProps) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}

// Loading Overlay
interface LoadingOverlayProps {
  loading: boolean
  children: React.ReactNode
  text?: string
}

export function LoadingOverlay({ loading, children, text = "Cargando..." }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <div className="flex space-x-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number, columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
```

### 3. Progress Indicators

**Patrón:** Indicadores de progreso

```jsx
// components/Progress/ProgressIndicators.tsx
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Circle, Loader2 } from 'lucide-react'

// Linear Progress with Steps
interface StepProgressProps {
  steps: Array<{
    id: string
    title: string
    description?: string
    status: 'completed' | 'current' | 'upcoming'
  }>
}

export function StepProgress({ steps }: StepProgressProps) {
  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start space-x-4">
          {/* Step Indicator */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2",
              step.status === 'completed' && "bg-primary border-primary text-primary-foreground",
              step.status === 'current' && "border-primary text-primary",
              step.status === 'upcoming' && "border-muted text-muted-foreground"
            )}>
              {step.status === 'completed' ? (
                <CheckCircle className="h-5 w-5" />
              ) : step.status === 'current' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={cn(
                "w-0.5 h-8 mt-2",
                step.status === 'completed' ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
          
          {/* Step Content */}
          <div className="flex-1 pb-8">
            <h3 className={cn(
              "font-medium",
              step.status === 'upcoming' && "text-muted-foreground"
            )}>
              {step.title}
            </h3>
            {step.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Circular Progress
interface CircularProgressProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
}

export function CircularProgress({ 
  value, 
  size = 'md', 
  showLabel = true,
  label 
}: CircularProgressProps) {
  const sizes = {
    sm: { container: 'w-16 h-16', circle: 'w-16 h-16', text: 'text-xs' },
    md: { container: 'w-24 h-24', circle: 'w-24 h-24', text: 'text-sm' },
    lg: { container: 'w-32 h-32', circle: 'w-32 h-32', text: 'text-base' }
  }
  
  const sizeClasses = sizes[size]
  const circumference = 2 * Math.PI * 40 // radius = 40
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className={cn("relative", sizeClasses.container)}>
      <svg className={cn("transform -rotate-90", sizeClasses.circle)} viewBox="0 0 100 100">
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-muted"
        />
        
        {/* Progress Circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-300 ease-in-out"
        />
      </svg>
      
      {/* Center Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn("text-center", sizeClasses.text)}>
            <div className="font-semibold">{Math.round(value)}%</div>
            {label && (
              <div className="text-muted-foreground text-xs">{label}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## 📱 Patrones Móviles

### 1. Bottom Sheet

**Patrón:** Panel deslizable desde abajo

```jsx
// components/Mobile/BottomSheet.tsx
'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  snapPoints?: number[] // Array de porcentajes [30, 60, 90]
}

export function BottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children,
  snapPoints = [90] 
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(0)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-background rounded-t-lg shadow-lg transition-transform duration-300 ease-out"
        style={{ height: `${snapPoints[currentSnap]}%` }}
      >
        {/* Handle */}
        <div className="flex justify-center p-2">
          <div className="w-12 h-1 bg-muted rounded-full" />
        </div>
        
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
        
        {/* Snap Points Indicator */}
        {snapPoints.length > 1 && (
          <div className="flex justify-center space-x-1 p-2 border-t">
            {snapPoints.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSnap(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentSnap ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

### 2. Swipe Actions

**Patrón:** Acciones por deslizamiento

```jsx
// components/Mobile/SwipeActions.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Trash2, Edit, Archive } from 'lucide-react'

interface SwipeAction {
  id: string
  label: string
  icon: React.ComponentType<any>
  color: 'red' | 'blue' | 'green' | 'gray'
  onAction: () => void
}

interface SwipeActionsProps {
  children: React.ReactNode
  leftActions?: SwipeAction[]
  rightActions?: SwipeAction[]
  threshold?: number
}

export function SwipeActions({ 
  children, 
  leftActions = [], 
  rightActions = [],
  threshold = 80 
}: SwipeActionsProps) {
  const [swipeX, setSwipeX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)

  const colorClasses = {
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    gray: 'bg-gray-500 text-white'
  }

  const handleStart = (clientX: number) => {
    setIsDragging(true)
    startX.current = clientX
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    
    const diff = clientX - startX.current
    const maxSwipe = Math.min(leftActions.length * 80, rightActions.length * 80, 160)
    
    setSwipeX(Math.max(-maxSwipe, Math.min(maxSwipe, diff)))
  }

  const handleEnd = () => {
    setIsDragging(false)
    
    // Determinar si activar una acción
    if (Math.abs(swipeX) > threshold) {
      const actions = swipeX > 0 ? leftActions : rightActions
      const actionIndex = Math.floor(Math.abs(swipeX) / 80)
      
      if (actions[actionIndex]) {
        actions[actionIndex].onAction()
      }
    }
    
    // Reset position
    setTimeout(() => setSwipeX(0), 150)
  }

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex">
          {leftActions.map((action, index) => {
            const Icon = action.icon
            return (
              <div
                key={action.id}
                className={cn(
                  "w-20 flex items-center justify-center",
                  colorClasses[action.color]
                )}
                style={{
                  transform: `translateX(${Math.max(0, swipeX - index * 80)}px)`
                }}
              >
                <Icon className="h-5 w-5" />
              </div>
            )
          })}
        </div>
      )}
      
      {/* Right Actions */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex">
          {rightActions.map((action, index) => {
            const Icon = action.icon
            return (
              <div
                key={action.id}
                className={cn(
                  "w-20 flex items-center justify-center",
                  colorClasses[action.color]
                )}
                style={{
                  transform: `translateX(${Math.min(0, swipeX + index * 80)}px)`
                }}
              >
                <Icon className="h-5 w-5" />
              </div>
            )
          })}
        </div>
      )}
      
      {/* Main Content */}
      <div
        className="relative bg-background transition-transform duration-150 ease-out"
        style={{
          transform: `translateX(${swipeX}px)`,
          transitionDuration: isDragging ? '0ms' : '150ms'
        }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => isDragging && handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {children}
      </div>
    </div>
  )
}

// Ejemplo de uso
<SwipeActions
  leftActions={[
    {
      id: 'edit',
      label: 'Editar',
      icon: Edit,
      color: 'blue',
      onAction: () => console.log('Editar')
    }
  ]}
  rightActions={[
    {
      id: 'archive',
      label: 'Archivar',
      icon: Archive,
      color: 'gray',
      onAction: () => console.log('Archivar')
    },
    {
      id: 'delete',
      label: 'Eliminar',
      icon: Trash2,
      color: 'red',
      onAction: () => console.log('Eliminar')
    }
  ]}
>
  <div className="p-4 border-b">
    Contenido que se puede deslizar
  </div>
</SwipeActions>
```

---

## 📊 Patrones de Data Display

### 1. Data Table Responsive

**Patrón:** Tabla responsiva con acciones

```jsx
// components/Table/ResponsiveTable.tsx
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  className?: string
  mobileHidden?: boolean
}

interface ResponsiveTableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  selectable?: boolean
  selectedItems?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  onRowClick?: (item: T) => void
  mobileCard?: (item: T) => React.ReactNode
}

export function ResponsiveTable<T extends { id: string }>({
  data,
  columns,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  onRowClick,
  mobileCard
}: ResponsiveTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSelectAll = (checked: boolean) => {
    if (onSelectionChange) {
      onSelectionChange(checked ? data.map(item => item.id) : [])
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (onSelectionChange) {
      const newSelection = checked
        ? [...selectedItems, itemId]
        : selectedItems.filter(id => id !== itemId)
      onSelectionChange(newSelection)
    }
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              
              {columns.map((column) => (
                <TableHead 
                  key={String(column.key)}
                  className={cn(
                    column.className,
                    column.sortable && "cursor-pointer hover:text-foreground"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortColumn === column.key && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {sortedData.map((item) => (
              <TableRow 
                key={item.id}
                className={cn(
                  onRowClick && "cursor-pointer hover:bg-muted/50"
                )}
                onClick={() => onRowClick?.(item)}
              >
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => 
                        handleSelectItem(item.id, checked as boolean)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                )}
                
                {columns.map((column) => (
                  <TableCell 
                    key={String(column.key)}
                    className={column.className}
                  >
                    {column.render 
                      ? column.render(item[column.key], item)
                      : String(item[column.key])
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {sortedData.map((item) => (
          <div 
            key={item.id}
            className="border rounded-lg p-4 space-y-3"
            onClick={() => onRowClick?.(item)}
          >
            {selectable && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => 
                    handleSelectItem(item.id, checked as boolean)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-sm text-muted-foreground">Seleccionar</span>
              </div>
            )}
            
            {mobileCard ? (
              mobileCard(item)
            ) : (
              <div className="space-y-2">
                {columns
                  .filter(col => !col.mobileHidden)
                  .map((column) => (
                    <div key={String(column.key)} className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {column.label}:
                      </span>
                      <span className="text-sm">
                        {column.render 
                          ? column.render(item[column.key], item)
                          : String(item[column.key])
                        }
                      </span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
```

---

## ✨ Micro-interacciones

### 1. Hover Effects

**Patrón:** Efectos de hover sutiles

```css
/* styles/components/hover-effects.css */

/* Card Hover */
.card-hover {
  @apply transition-all duration-200 ease-out;
  @apply hover:shadow-lg hover:-translate-y-1;
  @apply hover:border-border/50;
}

/* Button Hover Variations */
.button-scale {
  @apply transition-transform duration-150 ease-out;
  @apply hover:scale-105 active:scale-95;
}

.button-slide {
  @apply relative overflow-hidden;
  @apply before:absolute before:inset-0 before:bg-white/10;
  @apply before:translate-x-[-100%] before:transition-transform before:duration-300;
  @apply hover:before:translate-x-0;
}

/* Input Focus */
.input-focus {
  @apply transition-all duration-200;
  @apply focus:scale-[1.02] focus:shadow-md;
  @apply focus:border-primary focus:ring-2 focus:ring-primary/20;
}

/* Image Hover */
.image-hover {
  @apply transition-all duration-300 ease-out;
  @apply hover:scale-110 hover:brightness-110;
  @apply overflow-hidden rounded-lg;
}
```

### 2. Loading Animations

**Patrón:** Animaciones de carga personalizadas

```jsx
// components/Animations/LoadingAnimations.tsx

// Pulse Loading
export function PulseLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3', 
    lg: 'w-4 h-4'
  }
  
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-primary rounded-full animate-pulse",
            sizes[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )
}

// Wave Loading
export function WaveLoader() {
  return (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 bg-primary rounded-full animate-pulse"
          style={{
            height: `${Math.random() * 20 + 10}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.2s'
          }}
        />
      ))}
    </div>
  )
}

// Skeleton Shimmer
export function ShimmerSkeleton({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-muted rounded",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "before:animate-shimmer",
        className
      )}
    />
  )
}
```

### 3. Success/Error Animations

**Patrón:** Animaciones de feedback

```jsx
// components/Animations/FeedbackAnimations.tsx
'use client'

import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'

interface AnimatedIconProps {
  type: 'success' | 'error'
  size?: number
  duration?: number
}

export function AnimatedIcon({ type, size = 24, duration = 600 }: AnimatedIconProps) {
  const [animate, setAnimate] = useState(false)
  
  useEffect(() => {
    setAnimate(true)
  }, [])
  
  const Icon = type === 'success' ? Check : X
  const colors = type === 'success' 
    ? 'text-green-600 bg-green-100' 
    : 'text-red-600 bg-red-100'
  
  return (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center",
        "transition-all duration-300 ease-out",
        colors,
        animate && "animate-bounce"
      )}
      style={{ 
        width: size * 2, 
        height: size * 2,
        animationDuration: `${duration}ms`
      }}
    >
      <Icon 
        size={size} 
        className={cn(
          "transition-all duration-300",
          animate && "animate-scale-in"
        )}
      />
    </div>
  )
}

// Animación personalizada en CSS
/* styles/animations.css */
@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
```

---

## 🎯 Layout Patterns

### 1. Dashboard Layout

**Patrón:** Layout completo para dashboard

```jsx
// components/Layout/DashboardLayout.tsx
'use client'

import { useState } from 'react'
import { Header } from '@/components/Navigation/Header'
import { Sidebar } from '@/components/Navigation/Sidebar'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'

interface DashboardLayoutProps {
  children: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  title?: string
  actions?: React.ReactNode
}

export function DashboardLayout({ 
  children, 
  breadcrumbs = [],
  title,
  actions 
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-background border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <Sidebar />
        </div>
        
        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="px-4 py-6 lg:px-8">
            {/* Page Header */}
            {(breadcrumbs.length > 0 || title || actions) && (
              <div className="mb-6">
                {breadcrumbs.length > 0 && (
                  <Breadcrumbs items={breadcrumbs} />
                )}
                
                {(title || actions) && (
                  <div className="flex items-center justify-between mt-2">
                    {title && (
                      <h1 className="text-2xl font-bold text-foreground">
                        {title}
                      </h1>
                    )}
                    {actions && (
                      <div className="flex items-center space-x-2">
                        {actions}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Page Content */}
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 2. Grid System

**Patrón:** Sistema de grid responsivo

```jsx
// components/Layout/Grid.tsx
import { cn } from '@/lib/utils'

interface GridProps {
  children: React.ReactNode
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export function Grid({ 
  children, 
  cols = { default: 1, md: 2, lg: 3 },
  gap = 4,
  className 
}: GridProps) {
  const gridClasses = [
    `grid`,
    `gap-${gap}`,
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(' ')

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  )
}

// Auto-fit Grid
interface AutoGridProps {
  children: React.ReactNode
  minWidth?: string
  gap?: number
  className?: string
}

export function AutoGrid({ 
  children, 
  minWidth = '300px',
  gap = 4,
  className 
}: AutoGridProps) {
  return (
    <div 
      className={cn(`gap-${gap}`, className)}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`
      }}
    >
      {children}
    </div>
  )
}

// Masonry Grid (para contenido de altura variable)
export function MasonryGrid({ 
  children, 
  columns = { sm: 1, md: 2, lg: 3 },
  gap = 4 
}: {
  children: React.ReactNode
  columns?: { sm?: number, md?: number, lg?: number }
  gap?: number
}) {
  return (
    <div 
      className={cn(
        `columns-${columns.sm || 1}`,
        `md:columns-${columns.md || 2}`,
        `lg:columns-${columns.lg || 3}`,
        `gap-${gap}`
      )}
    >
      {children}
    </div>
  )
}
```

### 3. Container System

**Patrón:** Contenedores responsivos

```jsx
// components/Layout/Container.tsx
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

export function Container({ 
  children, 
  size = 'lg',
  className 
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }
  
  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  )
}

// Section Container
interface SectionProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

export function Section({ 
  children, 
  title, 
  description,
  className,
  padding = 'md'
}: SectionProps) {
  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16'
  }
  
  return (
    <section className={cn(paddingClasses[padding], className)}>
      <Container>
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && (
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}
```

---

## 📚 Recursos y Referencias

### Herramientas Útiles
- **Figma/Adobe XD**: Para wireframes y prototipos
- **Storybook**: Documentación de componentes
- **Chromatic**: Visual testing
- **React DevTools**: Debugging de componentes

### Librerías Complementarias
- **Framer Motion**: Animaciones avanzadas
- **React Spring**: Animaciones basadas en física
- **React Transition Group**: Transiciones de componentes
- **React Virtual**: Virtualización para listas largas

### Testing de Patrones
- **@testing-library/react**: Testing de componentes
- **@testing-library/user-event**: Simulación de interacciones
- **jest-axe**: Testing de accesibilidad
- **Playwright**: Testing E2E

---

*Biblioteca de patrones actualizada para Next.js 15, React 18, Tailwind CSS y Shadcn/ui - Enero 2025*