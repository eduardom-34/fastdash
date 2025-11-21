import { useState } from 'react';
import { FileUploader } from '@/components/upload/FileUploader';
import { UploadProgress } from '@/components/upload/UploadProgress';
import { SuggestionCard } from '@/components/analysis/SuggestionCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import type { AIAnalysisSuggestion, DashboardWidget } from '@/types';
import { uploadFile, getChartData } from '@/services/api';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const DashboardBuilder = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [fileId, setFileId] = useState<string>('');
  const [suggestions, setSuggestions] = useState<AIAnalysisSuggestion[]>([]);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [loadingWidgets, setLoadingWidgets] = useState<Set<string>>(new Set());

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadedFileName(file.name);
    
    try {
      const response = await uploadFile(file);
      
      // Guardar file_id y filename para usar en las consultas de gráficos
      setFileId(response.file_id);
      setUploadedFileName(response.filename);
      setSuggestions(response.suggestions);
      
      toast.success('¡Análisis completado!', {
        description: response.summary || `Se encontraron ${response.suggestions.length} insights valiosos en tus datos.`
      });
    } catch (error) {
      console.error('Error al subir archivo:', error);
      toast.error('Error al analizar el archivo', {
        description: error instanceof Error ? error.message : 'Por favor, intenta nuevamente.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSuggestion = async (suggestion: AIAnalysisSuggestion) => {
    if (!suggestion.id) return;
    
    setLoadingWidgets(prev => new Set(prev).add(suggestion.id!));
    
    try {
      // Llamar al backend para obtener los datos del gráfico
      const chartData = await getChartData({
        file_id: fileId,
        filename: uploadedFileName,
        x_axis: suggestion.parameters.x_axis,
        y_axis: suggestion.parameters.y_axis,
        chart_type: suggestion.chart_type,
      });
      
      const newWidget: DashboardWidget = {
        ...suggestion,
        data: chartData
      };
      
      setWidgets(prev => [...prev, newWidget]);
      toast.success('Gráfico agregado', {
        description: suggestion.title
      });
    } catch (error) {
      console.error('Error al cargar datos del gráfico:', error);
      toast.error('Error al cargar los datos del gráfico', {
        description: error instanceof Error ? error.message : 'Intenta nuevamente'
      });
    } finally {
      setLoadingWidgets(prev => {
        const newSet = new Set(prev);
        newSet.delete(suggestion.id!);
        return newSet;
      });
    }
  };

  const isWidgetAdded = (suggestionId: string) => {
    return widgets.some(w => w.id === suggestionId) || loadingWidgets.has(suggestionId);
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <LayoutDashboard className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                AI Dashboard Builder
              </h1>
              <p className="text-sm text-muted-foreground">
                Transforma tus datos en insights visuales con inteligencia artificial
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isUploading && suggestions.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <FileUploader 
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
            />
          </div>
        ) : isUploading ? (
          <div className="max-w-2xl mx-auto">
            <UploadProgress fileName={uploadedFileName} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Panel Izquierdo: Sugerencias */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Sugerencias de IA
                </h2>
              </div>
              
              <div className="space-y-4">
                {suggestions.map(suggestion => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onAdd={handleAddSuggestion}
                    isAdded={isWidgetAdded(suggestion.id || '')}
                  />
                ))}
              </div>
            </div>

            {/* Panel Derecho: Dashboard */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <LayoutDashboard className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Tu Dashboard
                </h2>
              </div>

              {widgets.length === 0 && loadingWidgets.size === 0 ? (
                <div className="bg-card rounded-lg border border-dashed border-border p-12 text-center">
                  <LayoutDashboard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Tu dashboard está vacío
                  </h3>
                  <p className="text-muted-foreground">
                    Selecciona una sugerencia de la izquierda para comenzar a construir tu dashboard
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {loadingWidgets.size > 0 && Array.from(loadingWidgets).map(id => {
                    const suggestion = suggestions.find(s => s.id === id);
                    if (!suggestion) return null;
                    return (
                      <ChartWidget
                        key={`loading-${id}`}
                        widget={{ ...suggestion, data: [] }}
                        isLoading={true}
                      />
                    );
                  })}
                  {widgets.map(widget => (
                    <ChartWidget
                      key={widget.id}
                      widget={widget}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardBuilder;
