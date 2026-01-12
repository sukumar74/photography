import React, { useState } from 'react';
import { useHuggingFace } from '../hooks/useHuggingFace';
import { Download, Loader2, Video as VideoIcon, Wand2, Upload } from 'lucide-react';
import { CONFIG, STYLES } from '../config';

export default function VideoEffects() {
    const { client, status, predict } = useHuggingFace(CONFIG.models.videoEffects);
    const [video, setVideo] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
            setResult(null);
        }
    };

    const handleGenerate = async () => {
        if (!video || !prompt) return;
        setLoading(true);
        setError(null);
        try {
            // Zeroscope or similar Vid2Vid API signature
            // predict(video_path, prompt, ...params)
            const response = await predict("/infer", [
                video,
                prompt,
                Math.floor(Math.random() * 1000000), // seed
            ]);

            if (response && response.data && response.data[0]) {
                setResult(response.data[0].video);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to apply effect. Video processing is heavy and the free space might be busy.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-container">
            <div className="tool-header">
                <h2><Wand2 className="icon-title" /> Magic Video Editor</h2>
                <p>Transform your videos with AI styles. Upload a video and type an effect!</p>
            </div>

            <div className="tool-layout">
                <div className="controls-panel">
                    <div className="input-group">
                        <label>1. Upload Video (Short clips recommended)</label>
                        <div className="upload-box" onClick={() => document.getElementById('video-upload').click()}>
                            <Upload size={24} />
                            <span>{video ? video.name : "Click to Upload Video"}</span>
                            <input
                                id="video-upload"
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                hidden
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>2. Describe Effect</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="E.g. Make it look like a 90s cartoon, or Cyberpunk style"
                            rows={3}
                        />
                    </div>

                    <div className="input-group">
                        <label>Style Presets</label>
                        <div className="style-chips">
                            {STYLES.map(style => (
                                <button
                                    key={style.name}
                                    className={`chip ${prompt.includes(style.prompt) ? 'active' : ''}`}
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
                        disabled={loading || status !== 'ready' || !video}
                    >
                        {loading ? <><Loader2 className="spin" /> Magic in progress...</> : <><Wand2 /> Apply Effect</>}
                    </button>

                    {error && <div className="error-msg">{error}</div>}
                </div>

                <div className="preview-panel">
                    {result ? (
                        <div className="result-container">
                            <video src={result} controls autoPlay loop />
                            <a href={result} download className="btn-download"><Download size={16} /> Download</a>
                        </div>
                    ) : (
                        <div className="preview-split">
                            {video ? (
                                <div className="source-preview">
                                    <video src={URL.createObjectURL(video)} controls muted />
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <VideoIcon size={48} />
                                    <p>Upload video to start</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
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
        .chip.active {
            background: var(--accent);
            border-color: var(--accent);
            color: white;
        }
        .source-preview video {
            max-width: 100%;
            max-height: 300px;
            border-radius: 0.5rem;
        }
      `}</style>
        </div>
    );
}
