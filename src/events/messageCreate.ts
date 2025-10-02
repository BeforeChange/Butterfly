import type { Event } from "../types/Event";
import { Users } from "../utils/database/Users";

const messageCreate: Event<"messageCreate"> = {
  name: "messageCreate",
  once: false,
  run: (message) => {
    if (message.author.bot) return;

    const { xp, level, leveledUp, progress } = Users.addXp(message.author.id);

    if (leveledUp) {
      message.channel.send(`🎉 Bravo ${message.author}, tu es maintenant niveau ${level} !`);
    }
  },
};

export default messageCreate;
