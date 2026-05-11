'use client';

import { useState } from 'react';
import { updatePortfolioTheme } from '@/lib/actions';

interface ThemeConfig {
  primaryColor: string;
  layout: string;
  fontFamily: string;
}

export function ThemeEditor({ initialConfig }: { initialConfig?: ThemeConfig }) {
  const [config, setConfig] = useState<ThemeConfig>(initialConfig || {
    primaryColor: '#3b82f6',
    layout: 'bento',
    fontFamily: 'Inter',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePortfolioTheme(config);
      alert('Design erfolgreich gespeichert!');
    } catch (error) {
      console.error('Failed to save theme:', error);
      alert('Fehler beim Speichern.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 border rounded-xl p-6 bg-card">
      <h2 className="text-xl font-bold">Design anpassen</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Primärfarbe</label>
          <div className="flex gap-2">
            <input 
              type="color" 
              value={config.primaryColor} 
              onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input 
              type="text" 
              value={config.primaryColor} 
              onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
              className="flex-1 border rounded px-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Layout</label>
          <select 
            value={config.layout} 
            onChange={(e) => setConfig({...config, layout: e.target.value})}
            className="w-full border rounded px-3 py-2"
          >
            <option value="bento">Bento Grid (Modern)</option>
            <option value="minimal">Minimalist (Klassisch)</option>
            <option value="sidebar">Sidebar (Fokussiert)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Schriftart</label>
          <select 
            value={config.fontFamily} 
            onChange={(e) => setConfig({...config, fontFamily: e.target.value})}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Inter">Inter (Sans)</option>
            <option value="Geist">Geist (Modern)</option>
            <option value="Playfair Display">Playfair (Serif)</option>
          </select>
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
      >
        {isSaving ? 'Speichere...' : 'Änderungen speichern'}
      </button>

      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <p className="text-xs text-muted-foreground mb-2">Vorschau</p>
        <div className="h-20 w-full rounded flex items-center justify-center text-white font-bold" style={{ backgroundColor: config.primaryColor }}>
          Hello World
        </div>
      </div>
    </div>
  );
}
