import type { Event } from "../types/Event";
import { logger } from "../utils/logger";

const ready: Event<"clientReady"> = {
  name: "clientReady",
  once: true,
  run: (client) => {
    logger.info(`✅ Connecté en tant que ${client.user?.tag}`);
  },
};

export default ready;
