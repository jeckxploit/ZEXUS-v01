'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Image, File, FileText, Video, Music, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUpload?: (result: UploadResult) => void;
  onError?: (error: string) => void;
  accept?: FileType[];
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

interface UploadResult {
  url: string;
  key: string;
  size: number;
  name: string;
}

type FileType = 'image' | 'document' | 'video' | 'audio';

const FILE_TYPE_ICONS: Record<FileType, React.ReactNode> = {
  image: <Image className="w-4 h-4" />,
  document: <FileText className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  audio: <Music className="w-4 h-4" />,
};

export default function FileUpload({
  onUpload,
  onError,
  accept = ['image'],
  maxSize = 5 * 1024 * 1024,
  multiple = false,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): FileType => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    const fileType = getFileType(file);
    
    if (!accept.includes(fileType)) {
      return `File type ${file.type} is not allowed`;
    }

    if (file.size > maxSize) {
      return `File size exceeds ${formatBytes(maxSize)}`;
    }

    return null;
  };

  const uploadFileWithProgress = async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.file.url,
            key: response.file.key,
            size: response.file.size,
            name: file.name,
          });
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));

      xhr.open('POST', '/api/upload/direct');
      xhr.send(formData);
    });
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const filesArray = Array.from(files);
    
    // Validate all files first
    for (const file of filesArray) {
      const error = validateFile(file);
      if (error) {
        toast({
          title: 'Upload Error',
          description: error,
          variant: 'destructive',
        });
        onError?.(error);
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const results: UploadResult[] = [];

      for (const file of filesArray) {
        const result = await uploadFileWithProgress(file);
        results.push(result);
        
        toast({
          title: 'Upload Successful',
          description: `${file.name} uploaded successfully`,
        });
      }

      setUploadedFiles((prev) => [...prev, ...results]);
      onUpload?.(multiple ? results[0] : results[0]);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      });
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [accept, maxSize, multiple, onUpload, onError]);

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
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8',
          'transition-all duration-200 cursor-pointer',
          'hover:border-primary/50 hover:bg-primary/5',
          isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25',
          isUploading && 'pointer-events-none opacity-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          className="hidden"
          accept={accept.map(t => `${t}/*`).join(',')}
          multiple={multiple}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={cn(
            'p-4 rounded-full transition-colors',
            isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}>
            <Upload className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse ({formatBytes(maxSize)} max)
            </p>
          </div>

          <div className="flex gap-2">
            {accept.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs"
              >
                {FILE_TYPE_ICONS[type]}
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            Uploading... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Uploaded Files ({uploadedFiles.length})
          </div>

          <div className="grid gap-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-md bg-muted border"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <File className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(file.url)}
                  >
                    Copy URL
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
