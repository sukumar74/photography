import { useState, useEffect } from 'react';
import { Client } from '@gradio/client';

export function useHuggingFace(spaceId) {
    const [client, setClient] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, ready, error
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        async function connect() {
            setStatus('loading');
            try {
                console.log("Connecting to space:", spaceId);
                const c = await Client.connect(spaceId);
                if (mounted) {
                    setClient(c);
                    setStatus('ready');
                    console.log("Connected to", spaceId);
                }
            } catch (err) {
                console.error("Failed to connect to space:", spaceId, err);
                if (mounted) {
                    setError(err);
                    setStatus('error');
                }
            }
        }
        if (spaceId) connect();
        return () => { mounted = false; };
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
