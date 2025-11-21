# 🔌 Integración con Backend

Este documento describe cómo el frontend de FastDash se integra con el backend.

## 📋 Configuración

### URL del Backend

Por defecto, el frontend está configurado para conectarse a `http://localhost:8000`.

Para cambiar la URL del backend:

1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega la siguiente variable:
   ```
   VITE_API_BASE_URL=http://tu-backend-url:puerto
   ```

O modifica directamente la constante `API_BASE_URL` en `src/services/api.ts`.

### CORS

Asegúrate de que tu backend tenga configurado CORS para aceptar peticiones desde:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternativo)

## 🔄 Flujo de Integración

### 1. Usuario sube archivo

```
Frontend → POST /upload → Backend
```

El usuario selecciona un archivo CSV o Excel mediante:
- Drag & drop
- Selector de archivos

El archivo se envía al endpoint `/upload` usando `FormData`.

**Código:** `src/services/api.ts` → función `uploadFile()`

### 2. Backend analiza y devuelve sugerencias

```
Backend → Respuesta JSON → Frontend
```

El backend procesa el archivo y devuelve:
- `file_id`: ID único del archivo (UUID)
- `filename`: Nombre del archivo
- `summary`: Resumen del análisis
- `suggestions`: Array de sugerencias de gráficos con parámetros

**Código:** `src/pages/DashboardBuilder.tsx` → función `handleFileUpload()`

### 3. Usuario selecciona una sugerencia

El frontend guarda `file_id` y `filename` en el estado y muestra las sugerencias como tarjetas.

**Código:** `src/components/analysis/SuggestionCard.tsx`

### 4. Frontend solicita datos del gráfico

```
Frontend → GET /chart-data?params → Backend
```

Cuando el usuario hace clic en una sugerencia, el frontend llama a:

```
GET /chart-data?file_id={id}&filename={name}&x_axis={col1}&y_axis={col2}&chart_type={type}
```

**Código:** `src/services/api.ts` → función `getChartData()`

### 5. Backend devuelve datos procesados

```
Backend → Array de datos → Frontend
```

El backend devuelve un array de objetos con los datos procesados:

```json
[
  {
    "Region": "Norte",
    "Ventas": 15000
  },
  {
    "Region": "Sur",
    "Ventas": 12000
  }
]
```

### 6. Frontend renderiza el gráfico

El frontend usa Recharts para renderizar el gráfico con los datos recibidos.

**Código:** `src/components/dashboard/ChartWidget.tsx`

## 📁 Archivos Modificados

### Nuevos archivos:
- `src/services/api.ts` - Servicio para comunicación con backend

### Archivos actualizados:
- `src/types/index.ts` - Tipos actualizados para incluir respuestas del backend
- `src/pages/DashboardBuilder.tsx` - Integración con servicios reales
- `src/components/dashboard/ChartWidget.tsx` - Uso dinámico de nombres de columnas

### Archivos preservados (por compatibilidad):
- `src/services/apiMock.ts` - Mocks originales (no se usan actualmente)

## 🔧 Funciones Principales

### `uploadFile(file: File): Promise<UploadResponse>`

Sube un archivo al backend y obtiene las sugerencias de la IA.

**Parámetros:**
- `file`: Archivo CSV o Excel

**Retorna:**
- `file_id`: ID único del archivo
- `filename`: Nombre del archivo
- `summary`: Resumen del análisis
- `suggestions`: Array de sugerencias

**Manejo de errores:**
- 400: Formato de archivo inválido
- 500: Error al procesar el archivo
- Network error: Backend no disponible

### `getChartData(params: ChartDataParams): Promise<any[]>`

Obtiene los datos procesados para renderizar un gráfico.

**Parámetros:**
- `file_id`: ID del archivo (obtenido de `/upload`)
- `filename`: Nombre del archivo
- `x_axis`: Nombre de la columna para eje X
- `y_axis`: Nombre de la columna para eje Y
- `chart_type`: Tipo de gráfico (bar, line, pie, area, scatter)

**Retorna:**
- Array de objetos con los datos del gráfico

**Manejo de errores:**
- 404: Archivo no encontrado (probablemente expirado)
- 500: Error al procesar datos

## 🚨 Manejo de Errores

El frontend maneja los siguientes escenarios:

1. **Archivo inválido (400)**
   - Mensaje: "Formato de archivo no válido. Solo se aceptan archivos .csv y .xlsx"

2. **Archivo no encontrado (404)**
   - Mensaje: "Archivo no encontrado. Por favor, sube el archivo nuevamente"
   - Acción: Usuario debe subir el archivo de nuevo

3. **Error del servidor (500)**
   - Mensaje: "Error al procesar el archivo/gráfico"

4. **Backend no disponible**
   - Mensaje: "Error de conexión con el servidor. Asegúrate de que el backend esté corriendo"

Los errores se muestran mediante `toast` notifications usando Sonner.

## 🧪 Desarrollo Local

### Iniciar Frontend
```bash
npm run dev
```

El frontend se iniciará en `http://localhost:5173`

### Iniciar Backend
```bash
# En el directorio del backend
uvicorn main:app --reload
```

El backend debe estar corriendo en `http://localhost:8000`

## 📊 Tipos de Gráficos Soportados

- `bar`: Gráfico de barras
- `line`: Gráfico de líneas
- `pie`: Gráfico circular
- `area`: Gráfico de área
- `scatter`: Gráfico de dispersión (nuevo)

## 🎯 Estructura de Datos

### Respuesta de `/upload`
```typescript
{
  file_id: string;           // UUID
  filename: string;          // "ventas.csv"
  summary: string;           // "Análisis completado..."
  suggestions: [
    {
      title: string;         // "Ventas por Región"
      chart_type: string;    // "bar"
      insight: string;       // Descripción del insight
      parameters: {
        x_axis: string;      // "Region"
        y_axis: string;      // "Ventas"
        aggregation?: string // "sum" (opcional)
      }
    }
  ]
}
```

### Respuesta de `/chart-data`
```typescript
[
  {
    [x_axis]: string | number,
    [y_axis]: number
  }
]
```

## ✅ Checklist de Integración

- [x] Servicio API creado (`api.ts`)
- [x] Tipos actualizados para backend
- [x] Upload de archivos integrado
- [x] Sugerencias de IA integradas
- [x] Renderizado de gráficos con datos reales
- [x] Manejo de errores implementado
- [x] Uso dinámico de nombres de columnas
- [x] Soporte para todos los tipos de gráficos
- [x] Mensajes de error descriptivos
- [x] Configuración flexible de URL del backend

## 🐛 Debugging

Si tienes problemas:

1. **Verifica que el backend esté corriendo:**
   ```bash
   curl http://localhost:8000
   ```

2. **Revisa la consola del navegador** para ver errores de red

3. **Verifica CORS** si ves errores de origen cruzado

4. **Verifica el formato del archivo** - solo CSV y XLSX son soportados

5. **Revisa los logs del backend** para ver errores del lado del servidor

