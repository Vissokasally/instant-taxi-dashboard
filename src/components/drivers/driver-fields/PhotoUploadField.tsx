
import React, { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UseFormSetValue } from 'react-hook-form';
import { DriverFormValues } from '../driver-types';

interface PhotoUploadFieldProps {
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  setValue: UseFormSetValue<DriverFormValues>;
}

export function PhotoUploadField({ imagePreview, setImagePreview, setValue }: PhotoUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('foto', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div 
        className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-2 overflow-hidden cursor-pointer"
        onClick={triggerFileInput}
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <Camera className="h-8 w-8 text-gray-400" />
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
      <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
        <Upload className="h-4 w-4 mr-2" />
        <span>Carregar foto</span>
      </Button>
    </div>
  );
}
