import type { Event } from "../types/Event";
import { logger } from "../utils/logger";
import { checkCooldown } from "../utils/cooldown";
import { MessageFlags } from "discord.js";

const interactionCreate: Event<"interactionCreate"> = {
  name: "interactionCreate",
  run: async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      logger.warn(`Commande non trouvée : ${interaction.commandName}`);
      return;
    }

    const cooldownTime = command.cooldown ?? 0;
    const cooldown = checkCooldown(command.data.name, interaction.user.id, cooldownTime);

    if (!cooldown.canRun) {
      return interaction.reply({
        content: `⏳ Tu dois attendre encore **${cooldown.timeLeft}s** avant d'utiliser \`${interaction.commandName}\`.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await command.run(interaction);
      logger.info(`Commande exécutée : ${interaction.commandName} par ${interaction.user.tag}`);
    } catch (err) {
      logger.error(`Erreur sur ${interaction.commandName} : ${(err as Error).message}`);
      await interaction.reply({ content: "❌ Erreur lors de l'exécution", flags: MessageFlags.Ephemeral });
    }
  },
};

export default interactionCreate;
