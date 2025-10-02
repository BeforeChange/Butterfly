import { Client, TextChannel } from "discord.js";
import { logsChannelId } from "../config.json";

enum LogLevel {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR"
}

let client: Client | null = null;

export function setLoggerClient(c: Client) {
    client = c;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "medium"
  }).format(date);
}

function log(message: string, level: LogLevel = LogLevel.INFO): void {
    const timestamp = formatDate(new Date());
    const formatted = `[${timestamp}] [${level}] ${message}`;

    console.log(formatted);

    if (client && logsChannelId) {
        const channel = client.channels.cache.get(logsChannelId);
        if (channel && channel.isTextBased()) {
            (channel as TextChannel).send(formatted).catch(() => {});
        }
    }
}

type Logger = { [K in keyof typeof LogLevel as Lowercase<K>]: (msg: string) => void };

export const logger = Object.fromEntries(
  Object.entries(LogLevel).map(([key, value]) => [
    key.toLowerCase(),
    (msg: string) => log(msg, value as LogLevel),
  ])
) as Logger;