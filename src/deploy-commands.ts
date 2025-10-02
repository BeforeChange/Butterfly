import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import config from "./config.json";

const commands: SlashCommandBuilder[] = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

// On charge toutes les commandes actuelles
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file)).default;
  if (command && "data" in command) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(config.token!);

(async () => {
  try {
    console.log(`🔄 Déploiement de ${commands.length} commande(s)...`);

    // ⚡ Déploiement guild-only (remplace toutes les commandes existantes par celles fournies)
    await rest.put(
      Routes.applicationGuildCommands(config.clientId!, config.guildId!),
      { body: commands } // Seules les commandes actuelles seront présentes
    );

    console.log("✅ Commandes déployées avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du déploiement :", error);
  }
})();
