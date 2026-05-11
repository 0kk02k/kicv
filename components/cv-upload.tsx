'use client';

import { useState } from 'react';
import { processCVUpload } from '@/lib/actions';

export function CVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      await processCVUpload(formData);
      alert('Lebenslauf erfolgreich verarbeitet!');
      setFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Fehler beim Verarbeiten des Lebenslaufs.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 border rounded-xl p-6 bg-card">
      <h2 className="text-xl font-bold">KI-Wissen (Lebenslauf)</h2>
      <p className="text-sm text-muted-foreground">
        Lade deinen Lebenslauf als PDF hoch. Unsere KI extrahiert die wichtigsten Informationen und erstellt daraus deine interaktive Wissensbasis.
      </p>

      <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
        <input 
          type="file" 
          accept=".pdf" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden" 
          id="cv-file"
        />
        <label htmlFor="cv-file" className="cursor-pointer flex flex-col items-center">
          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm font-medium">{file ? file.name : 'Klicke zum Hochladen oder Drag & Drop'}</span>
          <span className="text-xs text-gray-500 mt-1">PDF (max. 5MB)</span>
        </label>
      </div>

      <button 
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full bg-secondary text-secondary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
      >
        {isUploading ? 'Verarbeite...' : 'KI-Wissen generieren'}
      </button>
    </div>
  );
}
