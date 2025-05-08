'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Button } from '@/app/_components/ui/button';

interface ImageUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  maxSize?: number; // in MB
  className?: string;
  dropzoneText?: string;
  previewClassName?: string;
  showRemoveButton?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  maxSize = 5, // 5MB default
  className,
  dropzoneText = 'Drag & drop an image here, or click to select',
  previewClassName,
  showRemoveButton = true,
  ...props
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(value || null);
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length === 0) {
        return;
      }

      const file = acceptedFiles[0];

      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size exceeds ${maxSize}MB limit`);
        return;
      }

      const processImage = (file: File) => {
        const reader = new FileReader();

        reader.onload = () => {
          const img = document.createElement('img');
          img.src = reader.result as string;

          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 400;
            const size = Math.min(img.width, img.height, MAX_SIZE);
            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const scale = size / Math.min(img.width, img.height);
            const x = (img.width * scale - size) / 2;
            const y = (img.height * scale - size) / 2;

            ctx.drawImage(
              img,
              x / scale,
              y / scale,
              size / scale,
              size / scale,
              0,
              0,
              size,
              size
            );

            const croppedImage = canvas.toDataURL('image/jpeg', 0.8);
            setPreview(croppedImage);
            if (onChange) {
              onChange(croppedImage);
            }
          };
        };

        reader.readAsDataURL(file);
      };

      processImage(file);
    },
    [maxSize, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled,
  });

  const handleRemove = () => {
    setPreview(null);
    if (onRemove) {
      onRemove();
    } else if (onChange) {
      onChange('');
    }
  };

  return (
    <div
      className={cn('space-y-2', className)}
      {...props}
    >
      {preview ? (
        <div className="relative">
          <div
            className={cn(
              'relative overflow-hidden rounded-full',
              previewClassName
            )}
          >
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
            {showRemoveButton && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'border-muted-foreground/25 hover:border-muted-foreground/50 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors',
            isDragActive && 'border-primary/50 bg-primary/5',
            disabled && 'cursor-not-allowed opacity-60',
            className
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Upload className="text-muted-foreground h-8 w-8" />
            <div className="space-y-1">
              <p className="text-sm font-medium">{dropzoneText}</p>
              <p className="text-muted-foreground text-xs">
                Supported formats: JPEG, PNG, GIF, WebP
              </p>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
