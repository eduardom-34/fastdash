import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, PieChart, TrendingUp, Plus } from 'lucide-react';
import type { AIAnalysisSuggestion } from '@/types';

interface SuggestionCardProps {
  suggestion: AIAnalysisSuggestion;
  onAdd: (suggestion: AIAnalysisSuggestion) => void;
  isAdded: boolean;
}

const getChartIcon = (chartType: string) => {
  switch (chartType) {
    case 'bar':
      return BarChart3;
    case 'line':
      return LineChart;
    case 'pie':
      return PieChart;
    case 'area':
      return TrendingUp;
    default:
      return BarChart3;
  }
};

export const SuggestionCard = ({ suggestion, onAdd, isAdded }: SuggestionCardProps) => {
  const ChartIcon = getChartIcon(suggestion.chart_type);

  return (
    <Card className="p-6 space-y-4 hover:shadow-elevated transition-all duration-300 border-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-lg bg-primary/10">
            <ChartIcon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-foreground">
              {suggestion.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {suggestion.insight}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
        <span className="px-2 py-1 rounded-md bg-muted">
          Eje X: {suggestion.parameters.x_axis}
        </span>
        <span className="px-2 py-1 rounded-md bg-muted">
          Eje Y: {suggestion.parameters.y_axis}
        </span>
        <span className="px-2 py-1 rounded-md bg-muted capitalize">
          Tipo: {suggestion.chart_type}
        </span>
      </div>

      <Button
        onClick={() => onAdd(suggestion)}
        disabled={isAdded}
        className="w-full"
        variant={isAdded ? "secondary" : "default"}
      >
        {isAdded ? (
          <>
            <span>Agregado al Dashboard</span>
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Agregar al Dashboard
          </>
        )}
      </Button>
    </Card>
  );
};
