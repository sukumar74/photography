import React, { useState, useEffect } from 'react';
import { useHuggingFace } from '../hooks/useHuggingFace';
import { Download, Loader2, Wand2, Upload, AlertCircle } from 'lucide-react';
import { STYLES } from '../config';

export default function MagicEditor({ effect }) {
    const { client, status, predict, statusMessage } = useHuggingFace(effect.modelId);
    const [inputData, setInputData] = useState(null); // Can be text, file, etc.
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Reset state when effect changes
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
            // 2. Text to Video (Lightning / ModelScope)
            else if (effect.id === 'text-to-video') {
                // Lightning often expects (prompt, negative_prompt, seed, steps, cfg)
                // But for a generic catch-all, we try prompt + seed first
                inputs = [prompt, Math.random()];
            }
            // 3. Image to Video (SVD-XT)
            else if (effect.id === 'image-to-video') {
                inputs = [inputData, Math.random(), 25, 127, 6, 0.02];
            }
            // 4. Video to Video (Zeroscope / Slow Motion)
            else if (effect.inputType === 'video' || effect.id === 'slow-motion') {
                inputs = [inputData, prompt, Math.random()];
            }
            // 5. Other Image Effects
            else {
                inputs = [inputData];
            }

            const response = await predict("/infer", inputs).catch(async () => {
                // Fallback endpoint names if /infer fails (common variations)
                return await predict("/predict", inputs);
            });

            // Parse Result - Generic Attempt
            if (response && response.data && response.data[0]) {
                // Check if result is a file object or url
                const data = response.data[0];
                setResult(data.url || data.video || data.image || data);
            } else {
                console.warn("Unexpected response structure:", response);
                setError("Received unexpected format from AI. Check console.");
            }

        } catch (err) {
            console.error(err);
            setError(`Failed to run ${effect.name}. The model might be busy or expects different inputs.`);
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
                    {/* INPUT: FILE (Image/Video) */}
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

                    {/* INPUT: PROMPT (Text or Video that requires text) */}
                    {(effect.inputType === 'text' || effect.requiresPrompt) && (
                        <div className="input-field">
                            <label>Description / Prompt</label>
                            <textarea
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder={effect.inputType === 'video' ? "Describe the style... e.g. Cyberpunk" : "Describe what you want..."}
                                rows={3}
                            />

                            <div className="style-chips">
                                {STYLES.map(s => (
                                    <button key={s.name} className="chip" onClick={() => setPrompt(curr => curr + " " + s.prompt)}>
                                        {s.name}
                                    </button>
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
                            {statusMessage || 'System Connecting...'}
                            {status === 'loading' && <div className="loader-line"></div>}
                        </div>
                    )}
                    {error && <div className="error-box"><AlertCircle size={16} /> {error}</div>}
                </div>

                <div className="output-panel">
                    {result ? (
                        <div className="result-viewer">
                            {(effect.inputType === 'video' || effect.id.includes('video')) ? (
                                <video src={result} controls autoPlay loop />
                            ) : (
                                <img src={result} alt="Result" />
                            )}
                            <a href={result} download className="btn-dl"><Download size={16} /> Save</a>
                        </div>
                    ) : (
                        <div className="placeholder">
                            <Wand2 size={48} />
                            <span>Result will appear here</span>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .magic-editor { display: flex; flex-direction: column; gap: 1.5rem; height: 100%; }
        .editor-header h2 { margin: 0; font-size: 2rem; color: var(--text-primary); }
        .editor-header p { margin: 0.5rem 0 0; color: var(--text-secondary); }
        .editor-workspace { display: grid; grid-template-columns: 350px 1fr; gap: 2rem; flex: 1; min-height: 0; }
        .inputs-panel { background: var(--bg-secondary); padding: 1.5rem; border-radius: 1rem; display: flex; flex-direction: column; gap: 1.5rem; border: 1px solid var(--border); }
        .upload-zone { border: 2px dashed var(--border); padding: 2rem; border-radius: 0.5rem; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--text-secondary); transition: all 0.2s; }
        .upload-zone:hover { border-color: var(--accent); background: var(--bg-tertiary); color: var(--text-primary); }
        .input-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-field textarea { background: var(--bg-tertiary); border: 1px solid var(--border); padding: 0.8rem; border-radius: 0.5rem; color: white; resize: vertical; }
        .style-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
        .chip { background: var(--bg-tertiary); border: 1px solid var(--border); color: var(--text-secondary); padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 10px; cursor: pointer; }
        .chip:hover { color: var(--text-primary); border-color: var(--accent); }
        .btn-run { background: var(--accent); color: white; border: none; padding: 1rem; border-radius: 0.5rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: auto; }
        .btn-run:disabled { opacity: 0.5; cursor: not-allowed; }
        .output-panel { background: #000; border-radius: 1rem; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); position: relative; }
        .result-viewer { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .result-viewer img, .result-viewer video { max-width: 100%; max-height: 100%; object-fit: contain; }
        .btn-dl { position: absolute; bottom: 1rem; right: 1rem; background: rgba(0,0,0,0.8); color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; text-decoration: none; display: flex; gap: 0.5rem; }
        .placeholder { display: flex; flex-direction: column; align-items: center; color: var(--text-secondary); gap: 1rem; }
        .warn { color: #facc15; font-size: 0.8rem; text-align: center; }
        .error-box { background: rgba(239,68,68,0.1); color: #ef4444; padding: 0.5rem; border-radius: 0.5rem; font-size: 0.8rem; display: flex; gap: 0.5rem; align-items: center; }
        .spin { animation: spin 1s infinite linear; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
