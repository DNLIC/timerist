# View TimerControls Component Demo

## Quick Start - Standalone HTML (No Installation Required)

The easiest way to view the component is to open the standalone HTML file:

1. **Navigate to the file:**
   ```
   /Users/brehtburri/timerist/timer-controls-demo.html
   ```

2. **Open it in your browser:**
   - **macOS**: Right-click the file → "Open With" → Choose your browser (Chrome, Safari, Firefox, etc.)
   - **Or**: Drag and drop the file into your browser window
   - **Or**: Use File → Open File in your browser and navigate to the file

3. **Or use the local server:**
   If a Python HTTP server is running, visit:
   ```
   http://localhost:8000/timer-controls-demo.html
   ```

## What You'll See

The demo includes:
- ✅ Full-featured TimerControls with all features enabled
- ✅ Live timer display showing countdown
- ✅ Phase badges (Work/Rest)
- ✅ Round tracking
- ✅ Duration slider
- ✅ Minimal example
- ✅ Dark mode toggle button

## Interactive Features

- Click **Start** to begin the timer
- Click **Pause** to pause the timer
- Click **Reset** to reset to initial state
- Adjust the **Duration slider** (when timer is stopped)
- Toggle **Dark Mode** to see the dark theme

## Next.js Dev Server (Alternative)

If you want to run the full Next.js version:

1. Install dependencies:
   ```bash
   cd /Users/brehtburri/timerist
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Open in browser:
   ```
   http://localhost:3000
   ```

## Troubleshooting

**If the HTML file doesn't load:**
- Make sure you're opening it via `file://` protocol or through a local server
- Some browsers block local file access - use the Python server instead

**To start the Python server manually:**
```bash
cd /Users/brehtburri/timerist
python3 -m http.server 8000
```

Then visit: `http://localhost:8000/timer-controls-demo.html`
