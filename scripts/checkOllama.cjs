const { execSync } = require("child_process");
const os = require("os");
const http = require('http');

function installOllama() {
  const platform = os.platform();

  try {
    if (platform === "win32") {
      console.log("⚡ Installation d’Ollama sur Windows...");
      execSync("winget install Ollama.Ollama --accept-package-agreements --accept-source-agreements --silent", { stdio: "inherit" });
    } else if (platform === "darwin") {
      console.log("⚡ Installation d’Ollama sur Mac...");
      execSync("brew install ollama", { stdio: "inherit" });
    } else if (platform === "linux") {
      console.log("⚡ Installation d’Ollama sur Linux...");
      execSync("curl -fsSL https://ollama.ai/install.sh | sh", { stdio: "inherit", shell: true });
    } else {
      console.error("❌ Système non supporté. Installe Ollama manuellement : https://ollama.ai");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Impossible d’installer Ollama automatiquement :", err.message);
    process.exit(1);
  }
}

function waitForOllama(timeout = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const req = http.request(
        { method: 'HEAD', host: '127.0.0.1', port: 11434, path: '/' },
        (res) => {
          clearInterval(interval);
          resolve(true);
        }
      );

      req.on('error', (err) => {
        if (Date.now() - start > timeout) {
          clearInterval(interval);
          reject(new Error('Ollama daemon ne démarre pas'));
        }
      });

      req.end();
    }, 500);
  });
}

function ensureOllama() {
  waitForOllama()
  .then(() => {
    console.log("✅ Ollama daemon prêt !");
    execSync("ollama pull mistral", { stdio: "inherit" });
  })
  .catch((err) => {
    console.error("❌ Ollama ne semble pas lancé. Lance l’app Ollama manuellement puis réessaie.");
  });

  try {
    execSync("ollama --version", { stdio: "ignore" });
    console.log("✅ Ollama est déjà installé !");
  } catch {
    installOllama();
  }

  try {
    console.log("⚡ Téléchargement du modèle Mistral...");
    execSync("ollama pull mistral", { stdio: "inherit" });
    console.log("✅ Modèle Mistral prêt !");
  } catch (err) {
    console.error("❌ Impossible de télécharger le modèle Mistral :", err.message);
  }
}

ensureOllama();
