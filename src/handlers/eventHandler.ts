import { Client } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import type { Event } from "../types/Event";
import { logger } from "../utils/logger";

export function loadEvents(client: Client) {
  const eventsPath = path.join(__dirname, "..", "events");
  const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of eventFiles) {
    const event: Event = require(path.join(eventsPath, file)).default;

    if (event.once) {
      client.once(event.name, (...args) => event.run(...args));
    } else {
      client.on(event.name, (...args) => event.run(...args));
    }

    logger.info(`⚡ Event chargé : ${event.name}`);
  }
}
