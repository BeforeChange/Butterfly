import { Collection } from "discord.js";

type CooldownMap = Collection<string, Collection<string, number>>;
// commandName -> (userId -> timestamp)

const cooldowns: CooldownMap = new Collection();

/**
 * Vérifie et applique le cooldown
 */
export function checkCooldown(
  commandName: string,
  userId: string,
  cooldownSeconds: number
): { canRun: boolean; timeLeft?: number } {
  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(commandName)!;
  const cooldown = cooldownSeconds * 1000;

  if (timestamps.has(userId)) {
    const expirationTime = timestamps.get(userId)! + cooldown;

    if (now < expirationTime) {
      const timeLeft = Math.ceil((expirationTime - now) / 1000);
      return { canRun: false, timeLeft };
    }
  }

  timestamps.set(userId, now);
  return { canRun: true };
}
