# FocusUp Frontend

Frontend para la aplicación de gestión de tareas FocusUp, construido con Next.js, React y TypeScript.

## 🚀 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno (opcional):**
   ```bash
   # Crear archivo .env.local si necesitas configurar la URL del backend
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
   ```

## 🛠️ Scripts Disponibles

### Desarrollo
- `npm run dev` - Inicia el servidor de desarrollo en http://localhost:3000
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción

### Calidad de Código
- `npm run lint` - Ejecuta ESLint para verificar el código
- `npm run type-check` - Verifica tipos TypeScript sin compilar
- `npm run clean` - Limpia archivos de build

### Análisis
- `npm run analyze` - Analiza el bundle de la aplicación

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/              # App Router de Next.js 13+
│   │   ├── dashboard/    # Página del dashboard
│   │   ├── globals.css   # Estilos globales
│   │   ├── layout.tsx    # Layout principal
│   │   └── page.tsx      # Página principal
│   ├── components/       # Componentes reutilizables
│   │   ├── PomodoroTimer.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskForm.tsx
│   ├── lib/              # Utilidades y configuraciones
│   │   └── api.ts        # Cliente API
│   └── types/            # Definiciones de tipos TypeScript
│       └── task.ts
├── public/               # Archivos estáticos
└── tailwind.config.js    # Configuración de Tailwind CSS
```

## 🎨 Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconos

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env.local` para configuraciones locales:

```env
# URL del backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Tailwind CSS
El proyecto está configurado con Tailwind CSS. Los estilos se pueden personalizar en:
- `tailwind.config.js` - Configuración del framework
- `src/app/globals.css` - Estilos globales

## 🚀 Desarrollo

### Iniciar Servidor de Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

### Construir para Producción
```bash
npm run build
npm run start
```

## 📱 Características

- **Dashboard de Tareas** - Gestión completa de tareas
- **Timer Pomodoro** - Técnica de productividad
- **Interfaz Responsiva** - Optimizada para móviles y desktop
- **TypeScript** - Tipado seguro
- **Componentes Modulares** - Fácil mantenimiento

## 🔗 Integración con Backend

El frontend se conecta al backend a través de la API REST. Asegúrate de que el backend esté ejecutándose en el puerto configurado (por defecto 3001).

## 🧪 Testing

Para ejecutar tests (cuando se implementen):
```bash
npm run test
```

## 📝 Licencia

MIT 