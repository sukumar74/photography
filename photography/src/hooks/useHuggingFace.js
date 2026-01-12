import { useState, useEffect } from 'react';
import { Client } from '@gradio/client';

export function useHuggingFace(spaceId) {
    const [client, setClient] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, ready, error
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        let mounted = true;
        let t1, t2, t3;

        async function connect() {
            if (!spaceId) return;

            console.log(`[AI Hook] Attempting connection to: ${spaceId}`);
            setStatus('loading');
            setStatusMessage('Initializing Hub Connection...');

            // Multi-stage feedback for long wait times
            t1 = setTimeout(() => {
                if (mounted) {
                    console.log("[AI Hook] Stage 1/3: Waking up");
                    setStatusMessage('Waking up the AI model... (Stage 1/3)');
                }
            }, 5000);

            t2 = setTimeout(() => {
                if (mounted) {
                    console.log("[AI Hook] Stage 2/3: Loading weights");
                    setStatusMessage('Still waking up... Loading AI weights (Stage 2/3)');
                }
            }, 45000);

            t3 = setTimeout(() => {
                if (mounted) {
                    console.log("[AI Hook] Stage 3/3: Near completion");
                    setStatusMessage('Almost ready! Finalizing server setup (Stage 3/3)');
                }
            }, 120000);

            try {
                const c = await Client.connect(spaceId);
                console.log(`[AI Hook] Successfully connected to: ${spaceId}`);
                if (mounted) {
                    setClient(c);
                    setStatus('ready');
                    setStatusMessage('AI System Ready');
                }
            } catch (err) {
                console.error("[AI Hook] Connection failed:", spaceId, err);
                if (mounted) {
                    setError(err.message || String(err));
                    setStatus('error');
                    setStatusMessage('Connection failed. This tool might be temporarily offline.');
                }
            }
        }
        connect();
        return () => {
            mounted = false;
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
        };
    }, [spaceId]);

    const predict = async (endpoint, inputs) => {
        if (!client) throw new Error("Client not ready");
        try {
            const result = await client.predict(endpoint, inputs);
            return result;
        } catch (err) {
            console.error("Prediction failed:", err);
            throw err;
        }
    };

    return { client, status, error, predict };
}
