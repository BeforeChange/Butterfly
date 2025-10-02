import { SlashCommandBuilder, ChatInputCommandInteraction, TextChannel, MessageFlags } from "discord.js";
import type { Command } from "../types/Command";
import { GuildConfigs } from "../utils/database/GuildConfigs";

const setWelcome: Command = {
  data: new SlashCommandBuilder()
    .setName("setwelcome")
    .setDescription("Définit le salon de bienvenue")
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription("Salon pour les messages de bienvenue")
        .setRequired(true)
    ) as SlashCommandBuilder,
  cooldown: 5,
  run: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    
    const channel = interaction.options.getChannel("channel");

    // Vérifie que c'est bien un TextChannel (canal textuel dans un serveur)
    if (!channel || !(channel instanceof TextChannel)) {
        interaction.reply({ content: "Veuillez choisir un salon texte valide.", flags: MessageFlags.Ephemeral });
        return;
    }

    GuildConfigs.setWelcomeChannel(interaction.guildId!, channel.id);
    await interaction.reply({ content: `✅ Salon de bienvenue configuré : ${channel}`, flags: MessageFlags.Ephemeral });
  },
};

export default setWelcome;
