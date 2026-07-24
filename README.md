# AoE Problem Solving

Small office utilities that make everyday work a little easier.

## Tools

- **Produce Color Lookup** — search fruits and vegetables to find their color category.

## Open locally in your browser

No build step required. This is plain HTML, CSS, and JavaScript.

### Option 1: Open the file directly

1. Open `index.html` in Chrome, Edge, or Firefox (double-click it in File Explorer, or drag it into a browser tab).

### Option 2: Use a simple local server (recommended)

If you have [Node.js](https://nodejs.org/) installed:

```powershell
cd C:\Users\emmanuel.estrada\Projects\aoe-problem-solving
npx --yes serve .
```

Then open the URL shown in the terminal (usually `http://localhost:3000`).

### Option 3: Use Cursor

You're already in Cursor (a VS Code–style editor). Open this folder as your workspace, edit files, and use **Simple Browser** or your system browser to preview.

## Push to GitHub

1. Install [Git for Windows](https://git-scm.com/download/win) if it is not already installed.
2. Create a new empty repository on GitHub (for example `aoe-problem-solving`).
3. From this folder:

```powershell
git init
git add .
git commit -m "Initial commit: AoE Problem Solving"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aoe-problem-solving.git
git push -u origin main
```

## Deploy on GitHub Pages

1. On GitHub, open your repository → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch `main` and folder `/ (root)`, then save.
4. After a minute or two, your site will be live at:

`https://YOUR_USERNAME.github.io/aoe-problem-solving/`

## Add more tools

1. Create a new page under `tools/`.
2. Reuse styles from `css/styles.css`.
3. Add a card linking to it from `index.html`.
