import React, { useRef } from 'react';
import { AnimationRow, SpriteSheetConfig } from '../types';
import { DEFAULT_ROWS, ART_STYLES, FACING_DIRECTIONS } from '../constants';
import { Wand2, RefreshCw, Upload, X, Image as ImageIcon } from 'lucide-react';

interface InputPanelProps {
  config: SpriteSheetConfig;
  setConfig: React.Dispatch<React.SetStateAction<SpriteSheetConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ config, setConfig, onGenerate, isGenerating }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRowChange = (id: number, newName: string) => {
    setConfig(prev => ({
      ...prev,
      rows: prev.rows.map(r => r.id === id ? { ...r, name: newName } : r)
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig(prev => ({ ...prev, characterDescription: e.target.value }));
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig(prev => ({ ...prev, style: e.target.value }));
  };
  
  const handleFacingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig(prev => ({ ...prev, facing: e.target.value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, referenceImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setConfig(prev => ({ ...prev, referenceImage: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Enable generate if there is a description OR a reference image
  const canGenerate = (config.characterDescription.trim().length > 0 || config.referenceImage !== null) && !isGenerating;

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 h-full flex flex-col overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-green-400" />
          MadFroggys Setup
        </h2>
        <p className="text-slate-400 text-sm">Design your character and animations.</p>
      </div>

      <div className="space-y-6 flex-grow">
        
        {/* Reference Image Upload */}
        <div>
           <label className="block text-sm font-medium text-slate-300 mb-2">Reference Character (Optional)</label>
           {!config.referenceImage ? (
             <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700/50 hover:border-slate-500 transition-all group"
             >
                <Upload className="w-8 h-8 text-slate-500 mb-2 group-hover:text-green-400 transition-colors" />
                <p className="text-xs text-slate-400 text-center">Click to upload a sample image</p>
                <p className="text-[10px] text-slate-500 mt-1">We'll remove the background automatically</p>
             </div>
           ) : (
             <div className="relative rounded-lg overflow-hidden border border-slate-600 group">
                <img src={config.referenceImage} alt="Reference" className="w-full h-32 object-cover opacity-80" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={removeImage}
                        className="bg-red-500/80 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        title="Remove Image"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-[10px] text-center text-slate-300">
                    Background will be ignored
                </div>
             </div>
           )}
           <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
        </div>

        {/* Character Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Character Description</label>
          <textarea
            value={config.characterDescription}
            onChange={handleDescriptionChange}
            placeholder={config.referenceImage ? "Describe any changes or specific details..." : "e.g., A cybernetic ninja with a glowing blue katana, wearing a hood and metallic armor..."}
            className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            {/* Art Style */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Art Style</label>
                <select 
                    value={config.style} 
                    onChange={handleStyleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-green-500 outline-none"
                >
                    {ART_STYLES.map(style => (
                        <option key={style} value={style}>{style}</option>
                    ))}
                </select>
            </div>

            {/* Facing */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Facing Direction</label>
                <select 
                    value={config.facing} 
                    onChange={handleFacingChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-green-500 outline-none"
                >
                    {FACING_DIRECTIONS.map(face => (
                        <option key={face} value={face}>{face}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* Animation Rows */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Animation Sequences (8 Rows)</label>
          <div className="space-y-2">
            {config.rows.map((row, index) => (
              <div key={row.id} className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-md border border-slate-700/50">
                <span className="text-xs font-mono text-slate-500 w-6 shrink-0">R{index + 1}</span>
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => handleRowChange(row.id, e.target.value)}
                  className="bg-transparent border-none text-sm text-slate-200 w-full focus:ring-0 placeholder-slate-600"
                  placeholder={`Animation for row ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="pt-6 mt-6 border-t border-slate-700 sticky bottom-0 bg-slate-800">
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className={`w-full py-4 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
            ${!canGenerate
              ? 'bg-slate-600 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 active:scale-[0.98] shadow-green-500/25'
            }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Forging Sprites...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Spritesheet
            </>
          )}
        </button>
      </div>
    </div>
  );
};