
// ==============================================================================
// 1. CONFIGURATION
// ==============================================================================
const CONFIG = {
    settings: { useProxy: false, enableHistory: true }
};

const EFFECTS_LIBRARY = [
    {
        id: "text-to-video",
        name: "Text to Video",
        description: "Generate video from text prompts.",
        category: "Generation",
        modelId: "damo-vilab/modelscope-text-to-video-synthesis",
        inputType: "text",
        icon: "Film"
    },
    {
        id: "image-to-video",
        name: "Image to Video",
        description: "Bring still photos to life.",
        category: "Generation",
        modelId: "stabilityai/stable-video-diffusion",
        inputType: "image",
        icon: "ImagePlay"
    },
    {
        id: "video-style-transfer",
        name: "Video Styles",
        description: "Apply styles (Anime, Cyberpunk) to videos.",
        category: "Effects",
        modelId: "cerspense/zeroscope_v2_576w",
        inputType: "video",
        requiresPrompt: true,
        icon: "Wand2"
    },
    {
        id: "slow-motion",
        name: "Super Slow Motion",
        description: "Smooth out videos (Simulated via Zeroscope).",
        category: "Effects",
        modelId: "cerspense/zeroscope_v2_576w",
        inputType: "video",
        requiresPrompt: true,
        defaultPrompt: "slow motion, smooth motion, high frame rate, 60fps, interpolation",
        icon: "Clock"
    },
    {
        id: "text-to-image",
        name: "Text to Image",
        description: "FLUX.1 High Quality Generation.",
        category: "Generation",
        modelId: "black-forest-labs/FLUX.1-schnell",
        inputType: "text",
        icon: "ImageIcon"
    },
    {
        id: "remove-bg",
        name: "Remove Background",
        description: "Transparent background in seconds.",
        category: "Editing",
        modelId: "briaai/RMBG-1.4",
        inputType: "image",
        icon: "Scissors"
    },
    {
        id: "dolly-zoom",
        name: "Dolly Zoom",
        description: "Cinematic vertigo effect for images.",
        category: "Effects",
        modelId: "Google/zoe-depth", // Proxy
        inputType: "image",
        icon: "MoveDiagonal"
    },
    {
        id: "upscale",
        name: "4K Upscale",
        description: "Enhance resolution and quality.",
        category: "Editing",
        modelId: "sczhou/CodeFormer",
        inputType: "image",
        icon: "Maximize"
    }
];

const STYLES = [
    { name: "Cinematic", prompt: "cinematic lighting, 8k, highly detailed, realistic" },
    { name: "Cyberpunk", prompt: "neon lights, futuristic, cyberpunk city, dark atmosphere" },
    { name: "Anime", prompt: "anime style, vibrant colors, studio ghibli inspired" },
    { name: "Oil Painting", prompt: "oil painting texture, brush strokes, artistic" },
    { name: "Vintage", prompt: "vintage 90s camcorder style, vhs glitch, retro" },
    { name: "Bullet Time", prompt: "bullet time, frozen action, 360 degree rotation, matrix style" },
];

// ==============================================================================
// 2. MAIN APPLICATION UTILITIES & COMPONENTS
// ==============================================================================
import React, { useState, useEffect } from 'react';
import { Client } from '@gradio/client';
import { Download, Loader2, Upload, AlertCircle, Film, ImagePlay, Wand2, Clock, Image as ImageIcon, Scissors, MoveDiagonal, Maximize, ArrowLeft, Zap, Grid } from 'lucide-react';

const ICONS = { Film, ImagePlay, Wand2, Clock, ImageIcon, Scissors, MoveDiagonal, Maximize };

// --- Custom Hook ---
function useHuggingFace(spaceId) {
    const [client, setClient] = useState(null);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        let mounted = true;
        let timeout;

        async function connect() {
            setStatus('loading');
            setStatusMessage('Connecting to AI...');

            // If it takes more than 5 seconds, it's likely waking up
            timeout = setTimeout(() => {
                if (mounted) setStatusMessage('Waking up the AI model (this can take 3 minutes)...');
            }, 5000);

            try {
                if (!spaceId) return;
                console.log("Connecting to space:", spaceId);
                const c = await Client.connect(spaceId);
                if (mounted) {
                    setClient(c);
                    setStatus('ready');
                    setStatusMessage('');
                }
            } catch (err) {
                console.error("Failed to connect:", spaceId, err);
                if (mounted) {
                    setError(err.message || String(err));
                    setStatus('error');
                    setStatusMessage('Failed to connect. The space might be private or offline.');
                }
            }
        }
        connect();
        return () => {
            mounted = false;
            clearTimeout(timeout);
        };
    }, [spaceId]);

    const predict = async (endpoint, inputs) => {
        if (!client) throw new Error("Client not ready");
        return await client.predict(endpoint, inputs);
    };

    return { client, status, error, predict, statusMessage };
}

// --- Magic Editor Component ---
function MagicEditor({ effect }) {
    const { client, status, predict, statusMessage } = useHuggingFace(effect.modelId);
    const [inputData, setInputData] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setInputData(null);
        setPrompt('');
        setResult(null);
        setError(null);
    }, [effect]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setInputData(file);
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            let inputs = [];

            // 1. Text to Image (FLUX.1)
            if (effect.id === 'text-to-image') {
                inputs = [prompt, Math.random(), true, 1024, 1024, 4];
            }
            // 2. Text to Video (ModelScope)
            else if (effect.id === 'text-to-video') {
                inputs = [prompt, Math.random()];
            }
            // 3. Image to Video (SVD)
            else if (effect.id === 'image-to-video') {
                inputs = [inputData, Math.random(), 25, 127, 6, 0.02];
            }
            // 4. Video to Video (Zeroscope / Slow Motion)
            else if (effect.inputType === 'video' || effect.id === 'slow-motion') {
                inputs = [inputData, prompt, Math.random()];
            }
            // 5. General Image Ops
            else {
                inputs = [inputData];
            }

            const response = await predict("/infer", inputs).catch(async () => await predict("/predict", inputs));

            if (response && response.data && response.data[0]) {
                const data = response.data[0];
                setResult(data.url || data.video || data.image || data);
            } else {
                setError("Unexpected response format.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to run. Model might be busy. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="magic-editor">
            <div className="editor-header">
                <h2>{effect.name}</h2>
                <p>{effect.description}</p>
            </div>
            <div className="editor-workspace">
                <div className="inputs-panel">
                    {effect.inputType !== 'text' && (
                        <div className="input-field">
                            <label>Upload {effect.inputType}</label>
                            <div className="upload-zone" onClick={() => document.getElementById('magic-upload').click()}>
                                <Upload />
                                <span>{inputData ? inputData.name : `Click to Upload ${effect.inputType}`}</span>
                                <input id="magic-upload" type="file" accept={`${effect.inputType}/*`} onChange={handleFileChange} hidden />
                            </div>
                        </div>
                    )}
                    {(effect.inputType === 'text' || effect.requiresPrompt) && (
                        <div className="input-field">
                            <label>Description</label>
                            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} placeholder="Describe it..." />
                            <div className="style-chips">
                                {STYLES.map(s => (
                                    <button key={s.name} className="chip" onClick={() => setPrompt(curr => curr + " " + s.prompt)}>{s.name}</button>
                                ))}
                            </div>
                        </div>
                    )}
                    <button className="btn-run" onClick={handleGenerate} disabled={loading || status !== 'ready' || (!inputData && effect.inputType !== 'text')}>
                        {loading ? <><Loader2 className="spin" /> Processing...</> : <><Wand2 /> Run Magic</>}
                    </button>

                    {/* Improved Status Display */}
                    {status !== 'ready' && (
                        <div className="status-badge warn">
                            {statusMessage || 'Connecting...'}
                            {statusMessage && statusMessage.includes('Waking') && <div className="loader-line"></div>}
                        </div>
                    )}

                    {error && <div className="error-box"><AlertCircle size={16} /> {error}</div>}
                </div>
                <div className="output-panel">
                    {result ? (
                        <div className="result-viewer">
                            {(effect.inputType === 'video' || effect.id.includes('video')) ? <video src={result} controls autoPlay loop /> : <img src={result} alt="Result" />}
                            <a href={result} download className="btn-dl"><Download size={16} /> Save</a>
                        </div>
                    ) : <div className="placeholder"><Wand2 size={48} /><span>Result here</span></div>}
                </div>
            </div>
            <style>{`
          .loader-line { width: 100%; height: 2px; background: rgba(255,255,255,0.2); margin-top: 5px; position: relative; overflow: hidden; }
          .loader-line::after { content: ''; position: absolute; left: 0; top: 0; width: 30%; height: 100%; background: var(--accent); animation: slide 2s infinite linear; }
          @keyframes slide { 0% { left: -30%; } 100% { left: 100%; } }
      `}</style>
        </div>
    );
}

// --- Catalog Component ---
function EffectCatalog({ onSelect }) {
    const categories = [...new Set(EFFECTS_LIBRARY.map(e => e.category))];
    return (
        <div className="catalog-container">
            <div className="catalog-header"><h2>Effect Library</h2><p>Choose a tool.</p></div>
            {categories.map(category => (
                <div key={category} className="category-section">
                    <h3>{category}</h3>
                    <div className="effects-grid">
                        {EFFECTS_LIBRARY.filter(e => e.category === category).map(effect => {
                            const Icon = ICONS[effect.icon] || Wand2;
                            return (
                                <div key={effect.id} className="effect-card" onClick={() => onSelect(effect)}>
                                    <div className="card-icon"><Icon size={32} /></div>
                                    <div className="card-content"><h4>{effect.name}</h4><p>{effect.description}</p></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ==============================================================================
// 3. MAIN APP
// ==============================================================================
export default function App() {
    const [selectedEffect, setSelectedEffect] = useState(null);

    return (
        <div className="app-container">
            <nav className="sidebar">
                <div className="logo"><Wand2 className="icon-logo" /><span>AetherHub</span></div>
                <div className="nav-items"><button onClick={() => setSelectedEffect(null)} className={!selectedEffect ? 'active' : ''}><Grid size={20} /> All Effects</button></div>
            </nav>
            <main className="main-content">
                <header className="top-bar"><h1>Creative Studio</h1><div className="status-badge"><Zap size={14} /> Online</div></header>
                <div className="content-area">
                    {selectedEffect ? (
                        <div className="catalog-wrapper">
                            <button className="btn-back" onClick={() => setSelectedEffect(null)}><ArrowLeft size={16} /> Back</button>
                            <MagicEditor effect={selectedEffect} />
                        </div>
                    ) : <EffectCatalog onSelect={setSelectedEffect} />}
                </div>
            </main>
        </div>
    );
}
