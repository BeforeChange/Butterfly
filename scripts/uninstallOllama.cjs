const { execSync } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

function killPort11434() {
  try {
    const platform = os.platform();
    console.log("🔍 Recherche des processus utilisant le port 11434...");

    if (platform === "win32") {
      const result = execSync('netstat -ano | findstr :11434').toString();
      const lines = result.split('\n').filter(Boolean);

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid) {
          console.log(`⛔️ Kill process PID: ${pid}`);
          execSync(`taskkill /PID ${pid} /F`);
        }
      }
    } else {
      const result = execSync('lsof -i :11434 || true').toString();
      const lines = result.split('\n').slice(1); // skip header

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[1];
        if (pid) {
          console.log(`⛔️ Kill process PID: ${pid}`);
          execSync(`kill -9 ${pid}`);
        }
      }
    }
    console.log("✅ Port 11434 libéré !");
  } catch (err) {
    console.warn("⚠️ Aucun processus actif trouvé ou erreur : ", err.message);
  }
}

function uninstallOllama() {
  const platform = os.platform();
  console.log("🧹 Désinstallation d'Ollama...");

  try {
    if (platform === "win32") {
      execSync('winget uninstall Ollama.Ollama --silent', { stdio: 'inherit' });
    } else if (platform === "darwin") {
      execSync("brew uninstall ollama || true", { stdio: "inherit" });
    } else if (platform === "linux") {
      const binPath = "/usr/local/bin/ollama";
      if (fs.existsSync(binPath)) {
        fs.unlinkSync(binPath);
        console.log(`🗑️ Supprimé : ${binPath}`);
      }
    }
  } catch (err) {
    console.warn("⚠️ Erreur pendant la désinstallation :", err.message);
  }

  // Supprimer les fichiers liés à Ollama
  const home = os.homedir();
  const ollamaDirs = [
    path.join(home, ".ollama"),
    path.join(home, "Library/Application Support/Ollama"), // Mac
    path.join(home, "AppData/Local/Ollama"), // Windows
  ];

  for (const dir of ollamaDirs) {
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`🗑️ Dossier supprimé : ${dir}`);
      }
    } catch (e) {
      console.warn(`⚠️ Impossible de supprimer ${dir} :`, e.message);
    }
  }

  console.log("✅ Désinstallation terminée.");
}

killPort11434();
uninstallOllama();
