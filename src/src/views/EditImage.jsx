import React, { useState } from 'react';
import { useHuggingFace } from '../hooks/useHuggingFace';
import { Download, Loader2, Camera, Upload, Scissors } from 'lucide-react';

export default function EditImage() {
    const { client, status, predict } = useHuggingFace('briaai/RMBG-1.4');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setResult(null);
        }
    };

    const handleRemoveBg = async () => {
        if (!image) return;
        setLoading(true);
        setError(null);
        try {
            // RMBG-1.4 API signature
            // predict(image) -> image
            const response = await predict("/process_image", [
                image, // blob/file
            ]);

            // Response format
            if (response && response.data && response.data[0]) {
                setResult(response.data[0].url);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to remove background. Ensure the image is valid.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-container">
            <div className="tool-header">
                <h2><Scissors className="icon-title" /> Background Remover</h2>
                <p>Instantly remove backgrounds from images using RMBG-1.4.</p>
            </div>

            <div className="tool-layout">
                <div className="controls-panel">
                    <div className="input-group">
                        <label>Upload Image</label>
                        <div className="upload-box" onClick={() => document.getElementById('file-upload').click()}>
                            <Upload size={24} />
                            <span>{image ? image.name : "Click to Upload"}</span>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                hidden
                            />
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={handleRemoveBg}
                        disabled={loading || status !== 'ready' || !image}
                    >
                        {loading ? <><Loader2 className="spin" /> Processing...</> : <><Scissors /> Remove Background</>}
                    </button>

                    {status !== 'ready' && status !== 'loading' && (
                        <div className="status-indicator warning">
                            Loading Model...
                        </div>
                    )}

                    {error && <div className="error-msg">{error}</div>}
                </div>

                <div className="preview-panel">
                    {result ? (
                        <div className="result-container checkboard">
                            <img src={result} alt="Edited" />
                            <a href={result} download className="btn-download"><Download size={16} /> Download PNG</a>
                        </div>
                    ) : (
                        <div className="preview-split">
                            {image ? (
                                <div className="source-preview">
                                    <img src={URL.createObjectURL(image)} alt="Original" />
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <Camera size={48} />
                                    <p>Upload an image to start</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
        .upload-box {
            border: 2px dashed var(--border);
            padding: 2rem;
            border-radius: 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        .upload-box:hover {
            border-color: var(--accent);
            background: var(--bg-tertiary);
        }
        .checkboard {
            background-color: #eee;
            background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        .preview-split {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .source-preview img {
            max-width: 100%;
            max-height: 300px;
            border-radius: 0.5rem;
        }
      `}</style>
        </div>
    );
}
