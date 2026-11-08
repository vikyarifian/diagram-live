# diagram-live

A browser-based live diagram viewer and node renderer for internal network topology and server status visualization. Built with TypeScript, Vite, and Tailwind CSS.

![diagram-live preview](https://via.placeholder.com/800x400.png?text=diagram-live+Preview)

## Features

- **Live Text Parsing**: Paste simple text syntax to instantly render nodes and connections on canvas.
- **Interactive Canvas**: Drag and drop nodes to reposition them while connection lines recalculate automatically.
- **Export**: Export rendered topology as SVG or PNG for report attachments.
- **Presets**: Pre-loaded rack configurations and network component templates.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Setup & Local Development

1. Clone this repository:
   ```bash
   git clone http://gitlab.internal.corp/tools/diagram-live.git
   cd diagram-live
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start local development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

## Building & Deployment

To build the static single-page application (SPA):

```bash
npm run build
```

The compiled production bundle will be generated in the `dist` directory. Upload the contents of `dist` directly to the corporate NGINX server at `/var/www/html/diagram-live`.

## Internal Usage Note

For `surat_jalan` or rack asset tracking documentation, use the PNG export feature to attach network topology diagrams directly into internal tickets.