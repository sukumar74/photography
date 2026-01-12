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
            setStatus('loading');
            setStatusMessage('Connecting to AI Hub...');

            // Multi-stage feedback for long wait times
            t1 = setTimeout(() => { if (mounted) setStatusMessage('Waking up the AI model... (1/3)'); }, 5000);
            t2 = setTimeout(() => { if (mounted) setStatusMessage('Still waking up... (2/3)'); }, 45000);
            t3 = setTimeout(() => { if (mounted) setStatusMessage('Almost there! (3/3) Running final checks...'); }, 120000);

            try {
                if (!spaceId) return;
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
                    setStatusMessage('Connection failed. Model might be offline.');
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
