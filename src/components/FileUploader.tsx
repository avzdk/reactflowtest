import React, { useState } from 'react';
import { UmlData } from '../types/uml';
import { loadJsonFile } from '../services/UmlService';
import './FileUploader.css';

interface FileUploaderProps {
  onDataLoaded: (data: UmlData) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/json') {
      setError('Please upload a JSON file.');
      return;
    }

    setIsLoading(true);
    
    try {
      const data = await loadJsonFile(file);
      onDataLoaded(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load JSON file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="file-uploader-container">
      <div 
        className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <i className="upload-icon">📁</i>
          <p>Drag and drop a JSON file here, or</p>
          <label className="file-select-button">
            Select File
            <input 
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          Loading...
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
