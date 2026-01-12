export const CONFIG = {
    settings: {
        useProxy: false,
        enableHistory: true,
    }
};

// The Ultimate Effects Library
export const EFFECTS_LIBRARY = [
    // --- VIDEO GENERATION ---
    {
        id: "text-to-video",
        name: "Text to Video",
        description: "Generate video from text prompts.",
        category: "Generation",
        modelId: "damo-vilab/modelscope-text-to-video-synthesis",
        inputType: "text", // text, image, video
        icon: "Film"
    },
    {
        id: "image-to-video",
        name: "Image to Video",
        description: "Bring still photos to life.",
        category: "Generation",
        modelId: "stabilityai/stable-video-diffusion",
        inputType: "image",
        icon: "ImagePlay"
    },

    // --- VIDEO EFFECTS (Vid2Vid) ---
    {
        id: "video-style-transfer",
        name: "Video Styles",
        description: "Apply styles (Anime, Cyberpunk) to videos.",
        category: "Effects",
        modelId: "cerspense/zeroscope_v2_576w", // Using zeroscope as a general vid2vid proxy
        inputType: "video",
        requiresPrompt: true,
        icon: "Wand2"
    },
    {
        id: "slow-motion",
        name: "Super Slow Motion",
        description: "Smooth out videos with AI interpolation (RIFE).",
        category: "Effects",
        modelId: "alexk313/RIFE", // Proxy for RIFE space
        inputType: "video",
        icon: "Clock" // Simulating Slow Mo
    },

    // --- IMAGE EFFECTS ---
    {
        id: "text-to-image",
        name: "Text to Image",
        description: "FLUX.1 High Quality Generation.",
        category: "Generation",
        modelId: "black-forest-labs/FLUX.1-schnell",
        inputType: "text",
        icon: "ImageIcon"
    },
    {
        id: "remove-bg",
        name: "Remove Background",
        description: "Transparent background in seconds.",
        category: "Editing",
        modelId: "briaai/RMBG-1.4",
        inputType: "image",
        icon: "Scissors"
    },
    {
        id: "dolly-zoom",
        name: "Dolly Zoom",
        description: "Cinematic vertigo effect for images.",
        category: "Effects",
        modelId: "Google/zoe-depth", // Using Depth as a proxy for the 'dolly' effect if specific LoRA space isn't generic
        inputType: "image",
        icon: "MoveDiagonal"
    },
    {
        id: "upscale",
        name: "4K Upscale",
        description: "Enhance resolution and quality.",
        category: "Editing",
        modelId: "sczhou/CodeFormer", // or Real-ESRGAN
        inputType: "image",
        icon: "Maximize"
    }
];

export const STYLES = [
    { name: "Cinematic", prompt: "cinematic lighting, 8k, highly detailed, realistic" },
    { name: "Cyberpunk", prompt: "neon lights, futuristic, cyberpunk city, dark atmosphere" },
    { name: "Anime", prompt: "anime style, vibrant colors, studio ghibli inspired" },
    { name: "Oil Painting", prompt: "oil painting texture, brush strokes, artistic" },
    { name: "Vintage", prompt: "vintage 90s camcorder style, vhs glitch, retro" },
    { name: "Bullet Time", prompt: "bullet time, frozen action, 360 degree rotation, matrix style" }, // Specific prompt helper
];
