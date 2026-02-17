
# Guía de Despliegue - Pizzeria Pro

Esta aplicación está diseñada para ser extremadamente ligera y fácil de desplegar.

## Requisitos
- Node.js 18+
- PostgreSQL (opcional para persistencia real, actualmente usa LocalStorage/Mock para demo)

## Pasos para Producción

### 1. Preparar la Base de Datos
- Crea una base de datos en Supabase o Railway.
- Ejecuta el contenido de `database.sql` para crear las tablas necesarias.

### 2. Configurar Variables de Entorno (Frontend)
No necesitas API Keys. Simplemente configura el `store.ts` con tus datos iniciales o utiliza el panel `/admin` una vez desplegado.

### 3. Build & Deploy Frontend (Vercel/Netlify)
- Sube el código a un repositorio de GitHub.
- Conecta el repo a Vercel.
- Comando de build: `npm run build`
- Directorio de salida: `dist` o `build` (según tu config de Vite/Next).

### 4. Configurar Dominio
- Apunta tu dominio (ej. `menu.pizzeria.com`) al CNAME de Vercel.
- Vercel gestionará el SSL (HTTPS) automáticamente de forma gratuita.

### 5. Generar el QR
- El sistema incluye un generador automático en el footer del layout. 
- Imprime este QR y ponlo en las mesas o en el mostrador del local.

## Seguridad Recomendada
- Cambia la contraseña por defecto `admin123` en el código antes de desplegar.
- Implementa una API real en el backend usando Express y Prisma siguiendo el esquema SQL proporcionado para persistir los cambios del admin.
