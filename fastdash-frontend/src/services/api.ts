import type { UploadResponse, ChartDataParams } from '@/types';

// Configuración base del API
// Puedes cambiar esta URL si tu backend está en otro puerto o dominio
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Sube un archivo CSV/Excel al backend y obtiene las sugerencias de IA
 * @param file Archivo CSV o Excel a subir
 * @returns Respuesta con file_id, filename y sugerencias
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Formato de archivo no válido. Solo se aceptan archivos .csv y .xlsx');
      }
      if (response.status === 500) {
        throw new Error('Error al procesar el archivo. Verifica que el formato sea correcto');
      }
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data: UploadResponse = await response.json();
    
    // Generar IDs únicos para cada sugerencia (para compatibilidad con frontend)
    data.suggestions = data.suggestions.map((suggestion, index) => ({
      ...suggestion,
      id: suggestion.id || `suggestion-${index}-${Date.now()}`
    }));

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:8000');
  }
};

/**
 * Obtiene los datos procesados para un gráfico específico
 * @param params Parámetros del gráfico incluyendo file_id, filename, ejes y tipo
 * @returns Array de datos listos para graficar
 */
export const getChartData = async (params: ChartDataParams): Promise<any[]> => {
  const queryParams = new URLSearchParams({
    file_id: params.file_id,
    filename: params.filename,
    x_axis: params.x_axis,
    y_axis: params.y_axis,
    chart_type: params.chart_type,
  });

  try {
    const response = await fetch(`${API_BASE_URL}/chart-data?${queryParams.toString()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Archivo no encontrado. Por favor, sube el archivo nuevamente');
      }
      if (response.status === 500) {
        throw new Error('Error al procesar los datos del gráfico');
      }
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};

