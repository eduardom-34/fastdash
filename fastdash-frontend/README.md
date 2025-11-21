# 🚀 FastDash Frontend

FastDash es un constructor de dashboards inteligente que utiliza IA para analizar archivos CSV/Excel y generar visualizaciones automáticas con insights valiosos.

## 🌟 Características

- 📊 **Análisis Automático con IA**: Sube tu archivo y recibe sugerencias inteligentes de visualizaciones
- 📈 **Múltiples Tipos de Gráficos**: Bar, Line, Pie, Area, Scatter
- 🎨 **UI Moderna**: Diseño limpio y profesional con Tailwind CSS
- ⚡ **Rápido y Responsivo**: Construido con React + Vite
- 🔌 **Integración con Backend**: Conexión directa con API FastAPI

## 🛠️ Stack Tecnológico

- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **Recharts** para visualizaciones
- **Shadcn/ui** para componentes UI
- **Sonner** para notificaciones
- **React Router** para navegación

## 🚦 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Backend de FastDash corriendo en `http://localhost:8000`

### Instalación

```bash
# Clonar el repositorio
cd fastdash-frontend

# Instalar dependencias
npm install

# (Opcional) Configurar URL del backend
# Crea un archivo .env con:
# VITE_API_BASE_URL=http://localhost:8000

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Preview de la build de producción
npm run lint         # Ejecuta ESLint
```

## 📚 Documentación

Para información detallada sobre la integración con el backend, consulta:
- [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) - Documentación completa de la integración

## 🔌 Integración con Backend

El frontend se conecta automáticamente al backend en `http://localhost:8000`. 

**Endpoints utilizados:**
- `POST /upload` - Subir archivo y obtener sugerencias de IA
- `GET /chart-data` - Obtener datos procesados para gráficos

Para más detalles sobre el flujo de integración, consulta [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)

## 📁 Estructura del Proyecto

```
src/
├── components/        # Componentes React
│   ├── analysis/     # Tarjetas de sugerencias
│   ├── dashboard/    # Widgets de gráficos
│   ├── upload/       # Componentes de carga
│   └── ui/          # Componentes UI base
├── pages/           # Páginas principales
├── services/        # Servicios de API
├── types/          # Definiciones TypeScript
├── hooks/          # Custom hooks
└── lib/            # Utilidades
```

## 🎨 Componentes Principales

- **FileUploader**: Carga de archivos con drag & drop
- **SuggestionCard**: Muestra sugerencias de la IA
- **ChartWidget**: Renderiza gráficos dinámicos
- **DashboardBuilder**: Página principal del builder

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
