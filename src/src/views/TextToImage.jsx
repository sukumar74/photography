import React, { useState } from 'react';
import { useHuggingFace } from '../hooks/useHuggingFace';
import { Download, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CONFIG, STYLES } from '../config';

export default function TextToImage() {
    const { client, status, predict } = useHuggingFace(CONFIG.models.textToImage);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setError(null);
        try {
            const response = await predict("/infer", [
                prompt, // prompt
                Math.floor(Math.random() * 1000000), // seed
                true, // randomize_seed
                1024, // width
                1024, // height
                4,    // num_inference_steps
            ]);

            if (response && response.data && response.data[0]) {
                setResult(response.data[0].url);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to generate image. The space might be busy or restarting.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-container">
            <div className="tool-header">
                <h2><Sparkles className="icon-title" /> Text to Image</h2>
                <p>Generate stunning high-quality images from text descriptions in seconds.</p>
            </div>

            <div className="tool-layout">
                <div className="controls-panel">
                    <div className="input-group">
                        <label>Prompt</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your imagination... e.g. A futuristic city with neon lights, cinematic lighting, 8k"
                            rows={4}
                        />
                    </div>

                    <div className="input-group">
                        <label>Style Helpers (Click to add)</label>
                        <div className="style-chips">
                            {STYLES.map(style => (
                                <button
                                    key={style.name}
                                    className="chip"
                                    onClick={() => setPrompt(prev => prev + (prev ? ", " : "") + style.prompt)}
                                >
                                    {style.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={handleGenerate}
                        disabled={loading || status !== 'ready'}
                    >
                        {loading ? <><Loader2 className="spin" /> Generating...</> : <><Sparkles /> Generate Image</>}
                    </button>

                    {status !== 'ready' && status !== 'loading' && (
                        <div className="status-indicator warning">
                            Connecting to AI Model...
                        </div>
                    )}

                    {error && <div className="error-msg">{error}</div>}
                </div>

                <div className="preview-panel">
                    {result ? (
                        <div className="result-container">
                            <img src={result} alt="Generated" />
                            <a href={result} download className="btn-download"><Download size={16} /> Download</a>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <ImageIcon size={48} />
                            <p>Generated image will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .view-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        .tool-header h2 {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin: 0 0 0.5rem 0;
            font-size: 1.8rem;
        }
        .icon-title { color: var(--accent); }
        .tool-header p { color: var(--text-secondary); margin: 0; }
        
        .tool-layout {
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 2rem;
            flex: 1;
            min-height: 0;
        }
        
        .controls-panel {
            background: var(--bg-secondary);
            padding: 1.5rem;
            border-radius: 1rem;
            border: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .input-group label {
            font-weight: 500;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        .input-group textarea {
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: 0.5rem;
            padding: 0.75rem;
            color: var(--text-primary);
            font-family: inherit;
            resize: vertical;
        }
        .input-group textarea:focus {
            outline: none;
            border-color: var(--accent);
        }

        .style-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .chip {
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            color: var(--text-secondary);
            padding: 0.4rem 0.8rem;
            border-radius: 99px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s;
        }
        .chip:hover {
            border-color: var(--accent);
            color: var(--text-primary);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--accent), var(--accent-hover));
            color: white;
            border: none;
            padding: 0.75rem;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .btn-primary:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            filter: grayscale(0.5);
        }
        
        .preview-panel {
            background: var(--bg-secondary);
            border-radius: 1rem;
            border: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }
        
        .empty-state {
            color: var(--text-secondary);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        
        .result-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .result-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .btn-download {
            position: absolute;
            bottom: 1rem;
            right: 1rem;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            backdrop-filter: blur(5px);
        }
        
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .error-msg {
            color: #ef4444;
            font-size: 0.9rem;
            background: rgba(239, 68, 68, 0.1);
            padding: 0.5rem;
            border-radius: 0.5rem;
        }

        @media (max-width: 900px) {
            .tool-layout { grid-template-columns: 1fr; }
            .preview-panel { height: 400px; }
        }
      `}</style>
        </div>
    );
}
