import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types/Command";
import { askOllama } from "../utils/ollama";

const ask: Command = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Pose une question à l'IA locale")
    .addStringOption(option =>
      option.setName("question")
        .setDescription("Ta question")
        .setRequired(true)
    ) as SlashCommandBuilder,

  cooldown: 5,

  run: async (interaction) => {
    const question = interaction.options.getString("question", true);
    await interaction.deferReply(); // évite le timeout Discord

  const prompt = `
    Tu es Eve, un bot Discord amical et concis.
    Réponds directement et de manière simple à la question de l'utilisateur, en Français.
    Ne fais pas de longs paragraphes, reste clair et naturel.
    Parle toujours comme si tu étais Eve dans un salon Discord.

    Question : ${question}
    `;

    try {
      const answer = await askOllama(prompt);
      await interaction.editReply({ content: answer });
    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Impossible de contacter Ollama.");
    }
  },
};

export default ask;
