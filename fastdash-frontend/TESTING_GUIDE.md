# 🧪 Guía de Pruebas - FastDash

Esta guía te ayudará a probar la integración completa del frontend con el backend.

## ✅ Pre-requisitos

Antes de comenzar las pruebas, asegúrate de que:

- [ ] El backend está corriendo en `http://localhost:8000`
- [ ] El frontend está corriendo en `http://localhost:5173`
- [ ] Tienes archivos CSV o Excel de prueba disponibles

### Verificar Backend

Abre tu navegador o usa curl:

```bash
# Debería devolver información del API
curl http://localhost:8000
```

## 🎯 Pruebas de Integración

### 1. Prueba de Carga de Archivo

**Objetivo**: Verificar que el archivo se sube correctamente y la IA genera sugerencias.

**Pasos:**
1. Abre `http://localhost:5173` en tu navegador
2. Verás la pantalla de carga de archivos
3. Arrastra un archivo CSV o Excel o haz clic en "Seleccionar archivo"
4. Espera a que aparezca la animación de carga
5. Deberías ver:
   - ✅ Notificación de éxito "¡Análisis completado!"
   - ✅ Panel izquierdo con sugerencias de la IA
   - ✅ Panel derecho vacío esperando que agregues gráficos

**Posibles Errores:**
- ❌ "Error de conexión con el servidor" → El backend no está corriendo
- ❌ "Formato de archivo no válido" → El archivo no es CSV o XLSX válido
- ❌ "Error al procesar el archivo" → El backend tuvo problemas al analizar el archivo

### 2. Prueba de Sugerencias de IA

**Objetivo**: Verificar que las sugerencias se muestran correctamente.

**Qué verificar:**
- [ ] Cada sugerencia tiene un título descriptivo
- [ ] Cada sugerencia tiene un insight (descripción)
- [ ] Cada sugerencia muestra el tipo de gráfico (icono)
- [ ] El botón "Agregar a dashboard" está visible

**Ejemplo de sugerencia esperada:**
```
Título: "Ventas Totales por Región"
Tipo: Gráfico de Barras (icono de barras)
Insight: "La región Norte lidera las ventas con diferencia."
```

### 3. Prueba de Renderizado de Gráficos

**Objetivo**: Verificar que los gráficos se cargan y renderizan correctamente.

**Pasos:**
1. Haz clic en el botón "Agregar a dashboard" de una sugerencia
2. Deberías ver:
   - ✅ Animación de carga (spinner) en el panel derecho
   - ✅ El botón cambia a "Agregado" y se deshabilita
3. Después de cargar:
   - ✅ El gráfico aparece en el panel derecho
   - ✅ Los datos se visualizan correctamente
   - ✅ Los ejes tienen las etiquetas correctas
   - ✅ Notificación "Gráfico agregado"

**Posibles Errores:**
- ❌ "Archivo no encontrado" → El archivo temporal expiró, sube el archivo de nuevo
- ❌ "Error al cargar los datos del gráfico" → Problema en el backend al procesar datos

### 4. Prueba de Múltiples Gráficos

**Objetivo**: Verificar que se pueden agregar varios gráficos al dashboard.

**Pasos:**
1. Agrega 2-3 sugerencias al dashboard
2. Verifica que:
   - [ ] Todos los gráficos se muestran correctamente
   - [ ] No hay conflictos entre gráficos
   - [ ] Cada gráfico mantiene sus propios datos
   - [ ] Los gráficos se organizan verticalmente

### 5. Prueba de Tipos de Gráficos

**Objetivo**: Verificar que todos los tipos de gráficos funcionan.

**Tipos a probar:**

#### 📊 Gráfico de Barras (bar)
- [ ] Las barras se muestran correctamente
- [ ] Los valores están en el eje Y
- [ ] Las categorías están en el eje X
- [ ] Tooltip muestra información al hacer hover

#### 📈 Gráfico de Líneas (line)
- [ ] La línea conecta todos los puntos
- [ ] Los puntos son visibles
- [ ] La línea tiene color apropiado
- [ ] Tooltip funciona

#### 🥧 Gráfico Circular (pie)
- [ ] Las secciones suman 100%
- [ ] Cada sección tiene color diferente
- [ ] Los porcentajes se muestran
- [ ] Los nombres de categorías son visibles

#### 📉 Gráfico de Área (area)
- [ ] El área está rellena
- [ ] La línea superior es visible
- [ ] Los colores son apropiados

## 🔍 Pruebas de Consola del Navegador

Abre las DevTools (F12) y verifica:

### Network Tab
1. Ve a la pestaña Network
2. Sube un archivo
3. Deberías ver:
   - `POST /upload` → Status 200
   - Response contiene `file_id`, `filename`, `suggestions`

4. Agrega un gráfico
5. Deberías ver:
   - `GET /chart-data?file_id=...&filename=...&x_axis=...&y_axis=...&chart_type=...`
   - Status 200
   - Response es un array de objetos

### Console Tab
- No debería haber errores en rojo (excepto warnings menores)
- Si ves errores, toma nota de ellos

## 🧪 Pruebas con Diferentes Archivos

### CSV Simple
```csv
Region,Ventas
Norte,15000
Sur,12000
Este,8500
Oeste,9200
```

**Resultado esperado:** Sugerencia de gráfico de barras "Ventas por Región"

### Excel con Múltiples Columnas
Un archivo con columnas como:
- Fecha
- Producto
- Cantidad
- Precio
- Región

**Resultado esperado:** Múltiples sugerencias con diferentes combinaciones de columnas

### Archivo Grande
Un CSV con 100+ filas

**Resultado esperado:** 
- El backend debe procesarlo (puede tardar más)
- Los gráficos deben mostrar datos agregados/limitados (no todos los puntos)

## ❌ Manejo de Errores a Probar

### 1. Archivo Inválido
**Prueba:** Intenta subir un archivo .txt o .pdf

**Resultado esperado:**
- ❌ Error: "Formato de archivo no válido. Solo se aceptan archivos .csv y .xlsx"

### 2. Backend Offline
**Prueba:** Detén el backend y intenta subir un archivo

**Resultado esperado:**
- ❌ Error: "Error de conexión con el servidor. Asegúrate de que el backend esté corriendo"

### 3. Archivo Corrupto
**Prueba:** Sube un CSV con formato incorrecto

**Resultado esperado:**
- ❌ Error: "Error al procesar el archivo. Verifica que el formato sea correcto"

### 4. Archivo Expirado
**Prueba:** 
1. Sube un archivo
2. Espera unos minutos (si el backend limpia archivos temporales)
3. Intenta agregar un gráfico

**Resultado esperado:**
- ❌ Error: "Archivo no encontrado. Por favor, sube el archivo nuevamente"

## 📊 Checklist Final

Después de completar todas las pruebas:

- [ ] La carga de archivos funciona correctamente
- [ ] Las sugerencias de IA se muestran
- [ ] Los gráficos se renderizan con datos reales
- [ ] Los diferentes tipos de gráficos funcionan
- [ ] Los errores se manejan apropiadamente
- [ ] Las notificaciones (toasts) aparecen correctamente
- [ ] La UI es responsiva y funcional
- [ ] No hay errores en la consola
- [ ] Las llamadas al API son correctas (Network tab)

## 🐛 Reporte de Bugs

Si encuentras algún problema, anota:

1. **Descripción del problema**: ¿Qué esperabas que pasara vs qué pasó?
2. **Pasos para reproducir**: ¿Cómo llegaste al error?
3. **Mensajes de error**: Screenshots o mensajes de la consola
4. **Archivo usado**: Tipo y contenido del archivo que causó el error
5. **Respuesta del backend**: Lo que se ve en la pestaña Network

## 🎉 ¡Listo!

Si todas las pruebas pasan, la integración está funcionando correctamente. 

**Siguiente paso:** Prueba con tus archivos reales de datos y verifica que las visualizaciones tengan sentido para tu caso de uso.

