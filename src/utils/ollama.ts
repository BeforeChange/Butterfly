import fetch from "node-fetch";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import net from "net";
import { logger } from "./logger";

let iaProcess: ChildProcessWithoutNullStreams | null = null;

/**
 * Vérifie si un port est déjà utilisé
 * @param port numéro de port à vérifier
 * @returns true si utilisé, false sinon
 */
function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once("error", () => resolve(true)) // port occupé
      .once("listening", () => tester.close(() => resolve(false)))
      .listen(port);
  });
}

export async function startIAIfNeeded(): Promise<void> {
  const PORT = 11434;

  // Vérifie si le port est déjà utilisé
  const portUsed = await isPortInUse(PORT);
  if (portUsed) {
    logger.info(`✅ Ollama déjà en ligne sur le port ${PORT}`);
    return;
  }

  // Vérifie si le serveur répond à l'API (double sécurité)
  try {
    const res = await fetch(`http://localhost:11434`);
    if (res.ok) {
      logger.info("✅ Ollama répond déjà à l'API.");
      return;
    }
  } catch {
    logger.error("⚠️ Ollama non détecté sur le port, démarrage...");
  }

  if (iaProcess) {
    logger.info("ℹ️ Ollama est déjà en train de démarrer.");
    return;
  }

  iaProcess = spawn("ollama", ["serve"], {
    shell: false,
    stdio: ["pipe", "pipe", "pipe"],
  }) as ChildProcessWithoutNullStreams;

  iaProcess.stdout.on("data", (data) => {
    logger.info(`[Ollama] ${data.toString().trim()}`);
  });

  iaProcess.stderr.on("data", (data) => {
    logger.error(`[Ollama ERROR] ${data.toString().trim()}`);
  });

  iaProcess.on("exit", (code) => {
    logger.error(`[Ollama] Process exited with code ${code}`);
    iaProcess = null;
  });

  // Attendre un peu que le serveur démarre
  await new Promise((resolve) => setTimeout(resolve, 3000));
}

export async function askOllama(prompt: string): Promise<string> {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",
      prompt: prompt,
      stream: false
    }),
  });

  const data = await response.json() as any;
  return data.response.trim();
}
