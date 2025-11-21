import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Brain } from 'lucide-react';

interface UploadProgressProps {
  fileName: string;
}

export const UploadProgress = ({ fileName }: UploadProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-8 shadow-elevated">
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <div className="w-16 h-16 rounded-full bg-primary/20" />
            </div>
            <div className="relative p-4 rounded-full bg-gradient-primary">
              <Brain className="w-8 h-8 text-primary-foreground animate-pulse" />
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            La IA está analizando tus datos
            <Sparkles className="w-5 h-5 text-primary" />
          </h3>
          <p className="text-sm text-muted-foreground">
            {fileName}
          </p>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Procesando...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p className="animate-pulse">
            Identificando patrones y generando insights...
          </p>
        </div>
      </div>
    </Card>
  );
};
