import { useState, useEffect } from 'react';
import { Client } from '@gradio/client';

export function useHuggingFace(spaceId) {
    const [client, setClient] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, ready, error
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
                console.error("Failed to connect to space:", spaceId, err);
                if (mounted) {
                    setError(err);
                    setStatus('error');
                    setStatusMessage('Failed to connect. The space might be private or offline.');
                }
            }
        }
        if (spaceId) connect();
        return () => {
            mounted = false;
            clearTimeout(timeout);
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
