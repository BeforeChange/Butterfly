import type { Event } from "../types/Event";
import { VoiceState } from "discord.js";
import { Users } from "../utils/database/Users";
import { logger } from "../utils/logger";

const usersInVoice = new Map<string, NodeJS.Timeout>();

const voiceStateUpdate: Event<"voiceStateUpdate"> = {
  name: "voiceStateUpdate",
  run: (oldState: VoiceState, newState: VoiceState) => {
    const member = newState.member;
    if (!member || member.user.bot) return;

    const userId = member.id;

    // Rejoindre un canal vocal
    if (!oldState.channel && newState.channel) {
      logger.info(`[Voice] ${member.user.tag} a rejoint le canal ${newState.channel.name}`);

      if (!usersInVoice.has(userId)) {
        const interval = setInterval(() => {
          const result = Users.addXp(userId, 10);
          logger.info(`[Voice XP] ${member.user.tag} gagne +10 XP (Niveau ${result.level}, XP ${result.xp}/${result.nextLevelXp})`);
        }, 60 * 1000); // toutes les minutes
        usersInVoice.set(userId, interval);
        logger.info(`[Voice] Démarrage du suivi XP pour ${member.user.tag}`);
      }
    }

    // Quitter un canal vocal
    else if (oldState.channel && !newState.channel) {
      logger.info(`[Voice] ${member.user.tag} a quitté le canal ${oldState.channel.name}`);
      const interval = usersInVoice.get(userId);
      if (interval) {
        clearInterval(interval);
        usersInVoice.delete(userId);
        logger.info(`[Voice] Arrêt du suivi XP pour ${member.user.tag}`);
      }
    }
  },
};

export default voiceStateUpdate;
