import { Client, GatewayIntentBits, Collection } from "discord.js";
import { loadCommands } from "./handlers/commandHandler";
import { loadEvents } from "./handlers/eventHandler";
import type { Command } from "./types/Command";
import config from "./config.json";
import { setLoggerClient } from "./utils/logger";
import { startIAIfNeeded } from "./utils/ollama";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ],
}) as Client & { commands: Collection<string, Command> };

client.commands = new Collection();

setLoggerClient(client);

loadCommands(client);
loadEvents(client);

(async () => {
  await startIAIfNeeded();
  client.login(config.token);
})();