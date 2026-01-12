import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Video, Wand2, Layers, Zap, Sparkles, Grid } from 'lucide-react';
import EffectCatalog from './views/EffectCatalog';
import TextToImage from './views/TextToImage'; // Keeping for legacy/direct access if needed, or remove?
// Actually, EffectCatalog covers EVERYTHING now. Let's make it the main view.

export default function App() {
    const [activeTab, setActiveTab] = useState('catalog');

    return (
        <div className="app-container">
            <nav className="sidebar">
                <div className="logo">
                    <Wand2 className="icon-logo" />
                    <span>AetherHub</span>
                </div>

                <div className="nav-group-label">Main</div>
                <div className="nav-items">
                    <button onClick={() => setActiveTab('catalog')} className={activeTab === 'catalog' ? 'active' : ''}>
                        <Grid size={20} /> All Effects
                    </button>
                </div>

                <div className="nav-group-label">Quick Access</div>
                <div className="nav-items">
                    {/* We can keep these as shortcuts to filters in the catalog later, or just simple views */}
                    {/* For now, let's keep it simple: Catalog IS the app */}
                    <div className="nav-info">
                        <p>Select "All Effects" to browse the complete library including:</p>
                        <ul>
                            <li>Text to Video</li>
                            <li>Image to Video</li>
                            <li>Slow Motion</li>
                            <li>Dolly Zoom</li>
                            <li>Style Transfer</li>
                            <li>4K Upscale</li>
                        </ul>
                    </div>
                </div>
            </nav>
            <main className="main-content">
                <header className="top-bar">
                    <h1>Creative Studio 🚀 v1.3</h1>
                    <div className="status-badge" style={{ color: '#84cc16' }}><Zap size={14} className="icon-zap" /> System Live</div>
                </header>
                <div className="content-area">
                    <EffectCatalog />
                </div>
            </main>

            <style>{`
        .nav-info { padding: 1rem; color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5; opacity: 0.7; }
        .nav-info ul { padding-left: 1.2rem; margin: 0.5rem 0; }
        .nav-info li { margin-bottom: 0.25rem; }
      `}</style>
        </div>
    );
}
