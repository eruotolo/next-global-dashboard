# DEVELOPMENT_PRINCIPLES.md

Filosofía y reglas de desarrollo del proyecto.

---

## ⚡ Principios Clave

1. **Simplicidad y Código Mínimo**
    - Cambiar solo lo necesario.
    - Evitar modificaciones masivas.
2. **Cero Soluciones Temporales**
    - Siempre corregir la causa raíz.
3. **Documentación Completa**
    - Cada cambio debe explicarse.
4. **Planificación Antes de Ejecución**
    - No trabajar sin plan aprobado.
5. **Calidad sobre Velocidad**
    - Priorizar seguridad y estabilidad.

---

## 🔄 Buenas Prácticas

- Usar componentes existentes antes de crear nuevos.
- Seguir el patrón de roles y permisos al añadir páginas.
- Todas las migraciones deben pasar por Prisma.
- Implementar audit logging para operaciones sensibles.
- Validar y sanitizar la entrada en las API routes.

---

## ✅ Ejemplo de Cambio Correcto

**Mal:**

- Refactor masivo sin plan.
- No se documentan los cambios.

**Bien:**

1. Crear plan en `docs/TODO.md`.
2. Cambiar solo el módulo necesario.
3. Documentar en `docs/TODO.md`.
4. Solicitar aprobación antes del deploy.
