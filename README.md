<div align="center">
    <h1>BrickLink Auth</h1>
    <p>
        <a href="https://www.npmjs.com/package/bricklink-auth"><img src="https://img.shields.io/npm/v/bricklink-auth.svg?maxAge=3600" alt="npm version" /></a>
        <a href="https://www.npmjs.com/package/bricklink-auth"><img src="https://img.shields.io/npm/dt/bricklink-auth.svg?maxAge=3600" alt="npm downloads" /></a>
    </p>
    <p>
        A simple package to verify BrickLink API keys and integrate a ready-to-use frontend button for validation.
    </p>
</div>

---

## Overview

`bricklink-auth` allows you to:

- Verify **BrickLink API credentials** securely
- Provide a **frontend button** to let users input their keys
- Handle **OAuth signature** automatically
- Easily integrate with any frontend project

The package includes both a **backend server** and **frontend components**.

---

## Project Structure

```bash
bricklink-auth/
├─ src/
│  ├─ backend/
│  │  └─ server.js                # Express server for key verification
│  └─ frontend/
│     ├─ bricklinkAPI.js          # Frontend fetch wrapper for server
│     ├─ bricklinkButton.js       # Main button component
│     └─ bricklinkButton.css      # Button and popup styling
├─ package.json
└─ README.md
```

--- 

## Installation

```bash
npm install bricklink-auth
```

Or clone it via github:

```bash
git clone https://github.com/PoNexiOFF/bricklink-auth.git
cd ConsoleLogging
npm install
npm run build
```

---

## Usage



### Quick Demo with server.js
If you want to quickly test the BrickLink Auth button in a basic HTML page without setting up a backend yourself, you can use a `server.js` file at the root of your project like this:

To make this demo work, you need to have the following packages installed in your project:

**1. bricklink-auth – the main package for the button and key verification:**
```bash
npm install bricklink-auth
```
**2. Install all required dependencies from bricklink-auth:**
```bash
npm install
```

```js
import { spawn } from "child_process"; // Used to launch another Node.js process (the backend server)
import path from "path"; // Provides utilities for file paths
import { fileURLToPath } from "url"; // Converts URL to file path
import express from "express"; // Web server framework

// Get the current file path and its directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Launch the BrickLink Auth server from the npm package
const serverProcess = spawn(
    "node",
    [path.join(__dirname, "node_modules/bricklink-auth/src/backend/server.js")],
    { stdio: "inherit" }
);

// Listen for the backend server process to exit and log the code
serverProcess.on("close", (code) => {
    console.log(`BrickLink server exited with code ${code}`);
});

// Set up a simple Express server to serve the frontend demo
const app = express();

// Serve static files from the current directory (index.html, etc.)
app.use(express.static(path.join(__dirname, ".")));

// Start the frontend demo server on port 4000
app.listen(4000, () => {
    console.log("Demo front running on http://localhost:4000");
});
```

**3. Start the server:**
```bash
node server.js
```

### Using the frontend button
Include the button in your HTML page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>BrickLink Auth Demo</title>
</head>
<body>
    <!-- Container where the BrickLink Auth button will be injected -->
    <div id="bricklink-container"></div>

    <script type="module">
        // Import the createBricklinkButton function from the npm package
        import { createBricklinkButton } from './node_modules/bricklink-auth/src/frontend/bricklinkButton.js';

        // Inject the button into the container
        createBricklinkButton("bricklink-container");
  </script>
</body>
</html>
```

### Getting the verification result
You can pass a **callback function** to `createBricklinkButton` to get the result of the key verification:
```js
import { createBricklinkButton } from "./node_modules/bricklink-auth/src/frontend/bricklinkButton.js";

createBricklinkButton("bricklinkContainer", (result) => {
    if (result.success) {
        console.log("Keys are valid ✅", result);
    } else {
        console.error("Keys are invalid ❌", result);
    }
});
```

### Verifying Keys Programmatically
You can also verify keys directly using the `verifyKeys` function:

```js
import { verifyKeys } from './node_modules/bricklink-auth/src/frontend/bricklinkAPI.js';

const payload = {
  consumerKey: "YOUR_CONSUMER_KEY",
  consumerSecret: "YOUR_CONSUMER_SECRET",
  tokenKey: "YOUR_TOKEN_KEY",
  tokenSecret: "YOUR_TOKEN_SECRET"
};

const { status, data } = await verifyKeys(payload);

if (data.success) {
  console.log("Keys are valid ✅");
} else {
  console.error("Keys are invalid ❌", data.text);
}
```