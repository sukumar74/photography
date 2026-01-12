import React, { useState } from 'react';
import { useHuggingFace } from '../hooks/useHuggingFace';
import { Download, Loader2, Video as VideoIcon, Film } from 'lucide-react';
import { CONFIG, STYLES } from '../config';

export default function TextToVideo() {
    const { client, status, predict } = useHuggingFace(CONFIG.models.textToVideo);
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
            ]);

            if (response && response.data && response.data[0]) {
                setResult(response.data[0].video);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to generate video. The space might be busy (common for video models).");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-container">
            <div className="tool-header">
                <h2><Film className="icon-title" /> Text to Video</h2>
                <p>Generate short video clips from text prompts using ModelScope.</p>
            </div>

            <div className="tool-layout">
                <div className="controls-panel">
                    <div className="input-group">
                        <label>Prompt</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the video... e.g. A dog running on the beach, sunset, 4k"
                            rows={4}
                        />
                    </div>

                    <div className="input-group">
                        <label>Style Helpers</label>
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
                        {loading ? <><Loader2 className="spin" /> Generating (Takes ~2m)...</> : <><VideoIcon /> Generate Video</>}
                    </button>

                    <div className="info-box">
                        Note: Video generation is computationally expensive and may take 1-2 minutes.
                    </div>

                    {error && <div className="error-msg">{error}</div>}
                </div>

                <div className="preview-panel">
                    {result ? (
                        <div className="result-container">
                            <video src={result} controls autoPlay loop />
                            <a href={result} download className="btn-download"><Download size={16} /> Download</a>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <VideoIcon size={48} />
                            <p>Generated video will appear here</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
        .info-box {
            font-size: 0.8rem;
            color: var(--text-secondary);
            background: rgba(255, 255, 255, 0.05);
            padding: 0.75rem;
            border-radius: 0.5rem;
        }
        .result-container video {
             max-width: 100%;
             max-height: 100%;
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
       `}</style>
        </div>
    );
}
