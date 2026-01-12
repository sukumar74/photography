# How to Share This App for FREE

Don't worry! You do **not** need to pay for hosting. Modern web hosting services have generous "Free Tiers" for personal projects like this.

Here are the two best options. I recommend **Option 1 (Vercel)** because it works perfectly with the technology we used (Vite + React).

## Option 1: Vercel (Recommended)
1.  **Create a GitHub Account** (Free): Go to [github.com](https://github.com) and sign up.
2.  **Upload Code**:
    *   Download or move this project folder to your own computer (if you haven't already).
    *   Initialize a git repo (run `git init` in the terminal).
    *   Push this code to a new Repository on GitHub.
3.  **Deploy on Vercel**:
    *   Go to [vercel.com](https://vercel.com) and sign up with your GitHub account.
    *   Click "Add New..." -> "Project".
    *   Select the repository you just created.
    *   Click **Deploy**.
    *   **Done!** Vercel will give you a link (e.g., `ai-photo-hub.vercel.app`) that you can send to your brother. He can open it on his phone or laptop anywhere.

## Option 2: Netlify (Alternative)
1.  Go to [netlify.com](https://netlify.com) and sign up.
2.  You can drag and drop the `dist` folder to their website.
    *   First, run `npm run build` in your terminal.
    *   This creates a `dist` folder in your project.
    *   Drag that folder onto the Netlify dashboard.
    *   They will give you a free link.

## Option 3: Run Locally (Offline-ish)
If your brother has a laptop, you can just give him the code folder.
1.  Install [Node.js](https://nodejs.org) on his computer.
2.  Copy the folder `f:\practical way of learning\web development\photography` to his computer.
3.  Open a terminal in that folder and run:
    ```bash
    npm install
    npm run dev
    ```
4.  He can use it anytime! (Note: He still needs Internet access for the AI models to work, as they run in the cloud).
