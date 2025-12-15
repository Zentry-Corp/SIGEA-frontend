# ⚡ Quick Start - Landing Page SIGEA

## 🚀 Inicio Rápido en 5 Minutos

Esta guía te ayudará a tener la Landing Page corriendo en menos de 5 minutos.

---

## ✅ Prerrequisitos

```bash
# Verificar versiones
node --version    # v18.0.0 o superior
npm --version     # v9.0.0 o superior
```

---

## 📦 Instalación Express

### Paso 1: Crear carpeta del proyecto
```bash
mkdir sigea-frontend
cd sigea-frontend
```

### Paso 2: Inicializar proyecto
```bash
npm init -y
```

### Paso 3: Instalar dependencias
```bash
npm install react react-dom react-router-dom styled-components framer-motion react-icons
npm install -D vite @vitejs/plugin-react
```

### Paso 4: Copiar archivos
Copia todos los archivos de `/mnt/user-data/outputs/src` a tu carpeta `src/`

### Paso 5: Configurar
Crea los siguientes archivos en la raíz:

**vite.config.js**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

**package.json** (añadir scripts)
```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**index.html**
```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SIGEA</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Paso 6: Ejecutar
```bash
npm run dev
```

---

## 🎯 Estructura Mínima Requerida

```
sigea-frontend/
├── node_modules/          (automático)
├── src/
│   ├── app/
│   │   └── App.jsx
│   ├── pages/
│   │   └── public/
│   │       ├── LandingPage.jsx
│   │       └── sections/
│   │           ├── HeroSection.jsx
│   │           ├── HowItWorksSection.jsx
│   │           ├── EventsSection.jsx
│   │           ├── TestimonialsSection.jsx
│   │           └── MissionSection.jsx
│   ├── shared/
│   │   └── ui/
│   │       ├── layouts/
│   │       │   └── PublicLayout/
│   │       │       ├── PublicLayout.jsx
│   │       │       ├── PublicHeader.jsx
│   │       │       └── PublicFooter.jsx
│   │       └── styles/
│   │           └── global.css
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚠️ Solución de Problemas Comunes

### Error: Cannot find module '@/...'

**Problema**: Los path aliases no funcionan

**Solución**:
```javascript
// vite.config.js - Verificar esta configuración
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@/app': path.resolve(__dirname, './src/app'),
    '@/pages': path.resolve(__dirname, './src/pages'),
    '@/shared': path.resolve(__dirname, './src/shared'),
  },
}
```

### Error: Module not found

**Problema**: Falta alguna dependencia

**Solución**:
```bash
npm install react react-dom react-router-dom styled-components framer-motion react-icons
```

### Error: Port 3000 already in use

**Problema**: El puerto está ocupado

**Solución 1**: Cambiar puerto en vite.config.js
```javascript
server: {
  port: 3001, // Cambiar a otro puerto
}
```

**Solución 2**: Matar proceso en puerto 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 🎨 Verificación Visual

Después de ejecutar `npm run dev`, deberías ver:

### ✅ En el navegador
1. **Header sticky** con logo SIGEA
2. **Hero section** con título grande y tarjeta flotante
3. **Sección de 4 pasos** con íconos
4. **Grid de 3 eventos** con imágenes
5. **3 testimonios** con estrellas
6. **Sección de misión** con background sutil
7. **Footer oscuro** con 3 columnas

### ✅ En la consola
```
VITE v5.1.0  ready in 1200 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

## 📱 Test Responsive

### Desktop (> 968px)
- Header completo con navegación
- Grid de 3 columnas en eventos
- Todo visible

### Tablet (768px - 968px)
- Header con menú hamburguesa
- Grid de 2 columnas en eventos
- Elementos ajustados

### Mobile (< 768px)
- Menú hamburguesa animado
- Grid de 1 columna
- Stack vertical

**Test**: Abre DevTools (F12) y prueba diferentes tamaños.

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar servidor dev

# Build
npm run build        # Crear build de producción

# Preview
npm run preview      # Ver build localmente

# Limpiar
rm -rf node_modules  # Borrar dependencias
rm -rf dist          # Borrar build
npm install          # Reinstalar
```

---

## 🎯 Próximos Pasos

### Nivel 1: Básico
- [ ] Cambiar colores en los componentes
- [ ] Modificar textos del hero
- [ ] Añadir más eventos al array
- [ ] Cambiar testimonios

### Nivel 2: Intermedio
- [ ] Crear nuevas secciones
- [ ] Añadir más páginas
- [ ] Conectar con API
- [ ] Implementar formularios

### Nivel 3: Avanzado
- [ ] Implementar autenticación
- [ ] Añadir Redux
- [ ] Crear dashboards
- [ ] Tests unitarios

---

## 📚 Documentación Completa

Para información detallada, consulta:

1. **[INDEX.md](INDEX.md)** - Índice de toda la documentación
2. **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Guía paso a paso
3. **[README_LANDING.md](README_LANDING.md)** - README completo
4. **[CONFIGURATION_FILES.md](CONFIGURATION_FILES.md)** - Configuraciones
5. **[SUMMARY.md](SUMMARY.md)** - Resumen ejecutivo

---

## 🆘 Ayuda

### Si algo no funciona:

1. **Revisa la consola**: Errores en rojo
2. **Verifica las dependencias**: `npm list`
3. **Limpia node_modules**: `rm -rf node_modules && npm install`
4. **Consulta la documentación**: Ver archivos .md
5. **Contacta al equipo**: etdu@unas.edu.pe

---

## ✨ Tips Pro

### Desarrollo más rápido
```bash
# Auto-restart en cambios
npm run dev

# En otra terminal, lint
npm run lint:fix
```

### VS Code Extensions
- ESLint
- Prettier
- ES7+ React/Redux snippets
- Auto Rename Tag
- Path Intellisense

### Shortcuts útiles
- `Ctrl + Shift + P` → Command palette
- `Ctrl + P` → Quick file open
- `Ctrl + /` → Toggle comment
- `Alt + Shift + F` → Format document

---

## 🎉 ¡Listo!

Si llegaste hasta aquí y la landing page está corriendo, ¡felicidades! 🎊

Ahora puedes:
- ✅ Explorar el código
- ✅ Personalizar colores y textos
- ✅ Añadir nuevas secciones
- ✅ Conectar con tu backend

---

**Tiempo estimado**: 5 minutos  
**Dificultad**: ⭐ Fácil  
**Última actualización**: Diciembre 2024