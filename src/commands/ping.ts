import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types/Command";

const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Réponds avec Pong!"),
    cooldown: 5,
    
  run: async (interaction) => {
    await interaction.reply("🏓 Pong!");
  },
};

export default ping;
