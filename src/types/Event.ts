import { ClientEvents } from "discord.js";

export interface Event<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  run: (...args: ClientEvents[K]) => void;
}
