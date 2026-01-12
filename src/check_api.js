import { Client } from "@gradio/client";

async function run() {
    try {
        console.log("Connecting...");
        const app = await Client.connect("black-forest-labs/FLUX.1-schnell");
        const info = await app.view_api();
        console.log(JSON.stringify(info, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
