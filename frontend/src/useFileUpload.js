import { useState } from 'react';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

export function useFileUpload() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const uploadFile = async (file) => {
        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            // 1. Init
            const initRes = await fetch('http://localhost:3002/api/upload/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: file.name, size: file.size, mimeType: file.type })
            });

            if (!initRes.ok) throw new Error('Upload init failed');
            const { uploadId } = await initRes.json();

            // 2. Chunk Loop
            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
            for (let i = 0; i < totalChunks; i++) {
                const start = i * CHUNK_SIZE;
                const end = Math.min(file.size, start + CHUNK_SIZE);
                const chunk = file.slice(start, end);

                const chunkRes = await fetch(`http://localhost:3002/api/upload/chunk?uploadId=${uploadId}&chunkIndex=${i}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/octet-stream' },
                    body: chunk
                });

                if (!chunkRes.ok) throw new Error(`Chunk ${i} upload failed`);

                setProgress(Math.round(((i + 1) / totalChunks) * 100));
            }

            // 3. Complete
            const completeRes = await fetch('http://localhost:3002/api/upload/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uploadId, filename: file.name })
            });

            if (!completeRes.ok) throw new Error('Upload completion failed');
            const result = await completeRes.json();

            setUploading(false);
            return result; // { url, filename }

        } catch (err) {
            console.error(err);
            setError(err.message);
            setUploading(false);
            throw err;
        }
    };

    return { uploadFile, uploading, progress, error };
}
