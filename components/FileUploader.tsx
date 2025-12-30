
import React, { useRef, useState } from 'react';

interface FileUploaderProps {
  onFilesSelected: (files: FileList) => void;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleManualSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative group border-2 border-dashed rounded-xl p-10 transition-all duration-200
          ${isDragging ? 'border-indigo-500 bg-indigo-500/5' : 'border-gray-800 bg-gray-900/40 hover:border-gray-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleManualSelect}
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors">
            <svg className="w-7 h-7 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Drag files here or click to browse</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[240px] mx-auto">
              Select multiple files or your project root.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          disabled={disabled}
          onClick={() => folderRef.current?.click()}
          className="flex-1 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 py-2.5 rounded-lg text-xs font-medium text-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Upload Folder
        </button>
        <input
          ref={folderRef}
          type="file"
          // @ts-ignore
          webkitdirectory=""
          directory=""
          className="hidden"
          onChange={handleManualSelect}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FileUploader;
