import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export const FileUploader = ({ onFileUpload, isUploading }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  if (isUploading) {
    return null;
  }

  return (
    <Card 
      className={`
        relative border-2 border-dashed transition-all duration-300
        ${isDragging 
          ? 'border-primary bg-primary/5 shadow-glow' 
          : 'border-border hover:border-primary/50 hover:shadow-card'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center p-12 space-y-6">
        <div className="p-6 rounded-full bg-gradient-primary">
          <Upload className="w-12 h-12 text-primary-foreground" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-semibold text-foreground">
            Sube tu archivo de datos
          </h3>
          <p className="text-muted-foreground max-w-md">
            Arrastra y suelta tu archivo Excel o CSV aquí, o haz clic para seleccionar
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Formatos soportados: .csv, .xlsx, .xls</span>
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium 
                        hover:bg-primary/90 transition-colors shadow-card">
            Seleccionar archivo
          </div>
        </label>
      </div>
    </Card>
  );
};
