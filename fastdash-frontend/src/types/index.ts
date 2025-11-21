export type ChartType = 'bar' | 'line' | 'pie' | 'area';

export interface ChartParameters {
  x_axis: string;
  y_axis: string;
}

export interface AIAnalysisSuggestion {
  id: string;
  title: string;
  insight: string;
  chart_type: ChartType;
  parameters: ChartParameters;
}

export interface DashboardWidget extends AIAnalysisSuggestion {
  data: any[]; // Array de objetos para Recharts
}
