export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter';

export interface ChartParameters {
  x_axis: string;
  y_axis: string;
  aggregation?: string;
}

export interface AIAnalysisSuggestion {
  id?: string; // Generado en frontend para compatibilidad
  title: string;
  insight: string;
  chart_type: ChartType;
  parameters: ChartParameters;
}

export interface UploadResponse {
  file_id: string;
  filename: string;
  summary: string;
  suggestions: AIAnalysisSuggestion[];
}

export interface DashboardWidget extends AIAnalysisSuggestion {
  data: any[]; // Array de objetos para Recharts
}

export interface ChartDataParams {
  file_id: string;
  filename: string;
  x_axis: string;
  y_axis: string;
  chart_type: string;
}
