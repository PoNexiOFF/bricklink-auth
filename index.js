import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverProcess = spawn("node", [path.join(__dirname, "backend/server.js")], {
  stdio: "inherit",
});

serverProcess.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});
