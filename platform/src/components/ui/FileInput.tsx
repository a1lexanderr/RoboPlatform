import React, { useState, useRef } from 'react';
import { Upload, File as FileIcon, X } from 'lucide-react';
import { Button } from './Button';

interface FileInputProps {
  onFileSelect: (file: File | null) => void;
  initialFileName?: string | null;
}

export const FileInput: React.FC<FileInputProps> = ({ onFileSelect, initialFileName }) => {
  const [fileName, setFileName] = useState<string | null>(initialFileName || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFileName(file?.name || null);
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveFile = () => {
    setFileName(null);
    onFileSelect(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      {!fileName ? (
        <Button type="button" variant="secondary" onClick={handleButtonClick}>
          <Upload className="h-4 w-4 mr-2" />
          Выбрать файл
        </Button>
      ) : (
        <div className="flex items-center justify-between p-2 bg-gray-700 border border-gray-600 rounded-md">
            <div className="flex items-center">
                <FileIcon className="h-5 w-5 mr-2 text-gray-400"/>
                <span className="text-sm text-white truncate">{fileName}</span>
            </div>
            <button type="button" onClick={handleRemoveFile} className="text-gray-400 hover:text-white ml-2">
                <X className="h-4 w-4"/>
            </button>
        </div>
      )}
    </div>
  );
};