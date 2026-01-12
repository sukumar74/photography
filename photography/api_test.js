import { Client } from "@gradio/client";

async function check() {
    try {
        console.log("Connecting...");
        const client = await Client.connect("ByteDance/AnimateDiff-Lightning");
        const api = await client.view_api();
        console.log("API:", JSON.stringify(api, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

check();
