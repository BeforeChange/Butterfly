import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import type { Command } from "../types/Command";
import { Users } from "../utils/database/Users";

const setDescription: Command = {
  data: new SlashCommandBuilder()
    .setName("setdescription")
    .setDescription("Définit ta description de profil")
    .addStringOption(option =>
      option.setName("description")
        .setDescription("Ta nouvelle description")
        .setRequired(true)
        .setMaxLength(200)
    ) as SlashCommandBuilder,
  cooldown: 5,

  run: async (interaction: ChatInputCommandInteraction) => {
    const description = interaction.options.getString("description", true);
    const userId = interaction.user.id;

    Users.setDescription(userId, description);

    await interaction.reply({
      content: `✅ Ta description a bien été mise à jour :\n> ${description}`,
      flags: MessageFlags.Ephemeral
    });
  },
};

export default setDescription;
