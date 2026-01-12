import React, { useState } from 'react';
import { EFFECTS_LIBRARY } from '../config';
import MagicEditor from './MagicEditor';
import { Film, ImagePlay, Wand2, Clock, ImageIcon, Scissors, MoveDiagonal, Maximize, ArrowLeft } from 'lucide-react';

const ICONS = {
    Film, ImagePlay, Wand2, Clock, ImageIcon, Scissors, MoveDiagonal, Maximize
};

export default function EffectCatalog() {
    const [selectedEffect, setSelectedEffect] = useState(null);

    if (selectedEffect) {
        return (
            <div className="catalog-wrapper">
                <button className="btn-back" onClick={() => setSelectedEffect(null)}>
                    <ArrowLeft size={16} /> Back to Library
                </button>
                <MagicEditor effect={selectedEffect} />
            </div>
        );
    }

    // Group effects by category
    const categories = [...new Set(EFFECTS_LIBRARY.map(e => e.category))];

    return (
        <div className="catalog-container">
            <div className="catalog-header">
                <h2>Effect Library</h2>
                <p>Choose an AI tool to start creating magic.</p>
            </div>

            {categories.map(category => (
                <div key={category} className="category-section">
                    <h3>{category}</h3>
                    <div className="effects-grid">
                        {EFFECTS_LIBRARY.filter(e => e.category === category).map(effect => {
                            const Icon = ICONS[effect.icon] || Wand2;
                            return (
                                <div key={effect.id} className="effect-card" onClick={() => setSelectedEffect(effect)}>
                                    <div className="card-icon">
                                        <Icon size={32} />
                                    </div>
                                    <div className="card-content">
                                        <h4>{effect.name}</h4>
                                        <p>{effect.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            <style>{`
        .catalog-container { height: 100%; overflow-y: auto; padding-right: 1rem; }
        .catalog-header { margin-bottom: 2rem; }
        .catalog-header h2 { font-size: 2rem; margin: 0; }
        .catalog-header p { color: var(--text-secondary); margin: 0.5rem 0 0; }
        
        .category-section { margin-bottom: 3rem; }
        .category-section h3 { color: var(--accent); margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; display: inline-block; }
        
        .effects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        
        .effect-card { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 1rem; padding: 1.5rem; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 1rem; }
        .effect-card:hover { border-color: var(--accent); transform: translateY(-3px); background: var(--bg-tertiary); }
        
        .card-icon { width: 3rem; height: 3rem; background: rgba(139, 92, 246, 0.1); color: var(--accent); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
        
        .card-content h4 { margin: 0 0 0.5rem; font-size: 1.1rem; }
        .card-content p { margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4; }
        
        .catalog-wrapper { height: 100%; display: flex; flex-direction: column; gap: 1rem; }
        .btn-back { align-self: flex-start; background: transparent; border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; padding: 0.5rem 0; }
        .btn-back:hover { color: var(--text-primary); }
      `}</style>
        </div>
    );
}
