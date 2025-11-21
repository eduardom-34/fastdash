import type { AIAnalysisSuggestion, ChartParameters } from '@/types';

// Simula un delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data generator para diferentes tipos de gráficos
const generateMockData = (params: ChartParameters, type: string): any[] => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const products = ['Producto A', 'Producto B', 'Producto C', 'Producto D', 'Producto E'];
  
  const regions = ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'];

  switch (type) {
    case 'monthly_sales':
      return months.map(month => ({
        name: month,
        value: Math.floor(Math.random() * 50000) + 20000,
        target: Math.floor(Math.random() * 45000) + 25000
      }));
    
    case 'top_products':
      return products.map(product => ({
        name: product,
        value: Math.floor(Math.random() * 15000) + 5000,
        growth: (Math.random() * 30 - 5).toFixed(1)
      }));
    
    case 'customer_distribution':
      return regions.map(region => ({
        name: region,
        value: Math.floor(Math.random() * 500) + 100
      }));
    
    default:
      return months.slice(0, 6).map(month => ({
        name: month,
        value: Math.floor(Math.random() * 1000) + 100
      }));
  }
};

// Simula la subida de archivo y análisis de IA
export const mockUploadFile = async (file: File): Promise<AIAnalysisSuggestion[]> => {
  // Simula el procesamiento
  await delay(2000);
  
  const suggestions: AIAnalysisSuggestion[] = [
    {
      id: 'suggestion-1',
      title: 'Tendencia de Ventas Mensuales',
      insight: 'Tus ventas muestran un crecimiento sostenido del 15% mes a mes. Se recomienda visualizar la tendencia para identificar patrones estacionales.',
      chart_type: 'line',
      parameters: {
        x_axis: 'mes',
        y_axis: 'ventas'
      }
    },
    {
      id: 'suggestion-2',
      title: 'Top 5 Productos por Ingresos',
      insight: 'Los 5 productos principales generan el 70% de los ingresos totales. Un gráfico de barras te ayudará a visualizar su contribución relativa.',
      chart_type: 'bar',
      parameters: {
        x_axis: 'producto',
        y_axis: 'ingresos'
      }
    },
    {
      id: 'suggestion-3',
      title: 'Distribución de Clientes por Región',
      insight: 'El 45% de tus clientes se concentran en 2 regiones. Esta visualización circular te permite identificar oportunidades de expansión.',
      chart_type: 'pie',
      parameters: {
        x_axis: 'region',
        y_axis: 'clientes'
      }
    }
  ];
  
  return suggestions;
};

// Simula obtener datos para un gráfico específico
export const mockGetChartData = async (
  suggestionId: string,
  params: ChartParameters
): Promise<any[]> => {
  // Simula el delay de carga
  await delay(1500);
  
  // Determina qué tipo de datos generar basado en el ID de sugerencia
  const dataType = suggestionId === 'suggestion-1' 
    ? 'monthly_sales'
    : suggestionId === 'suggestion-2'
    ? 'top_products'
    : 'customer_distribution';
  
  return generateMockData(params, dataType);
};
