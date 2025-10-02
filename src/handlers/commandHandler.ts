import { Client } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import type { Command } from "../types/Command";
import { logger } from "../utils/logger";

export function loadCommands(client: Client & { commands: Map<string, Command> }) {
  const commandsPath = path.join(__dirname, "..", "commands");
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of commandFiles) {
    const command: Command = require(path.join(commandsPath, file)).default;
    client.commands.set(command.data.name, command);
    logger.info(`📦 Commande chargée : ${command.data.name}`);
  }
}
