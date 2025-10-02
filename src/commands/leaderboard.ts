import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { Command } from "../types/Command";
import { Users } from "../utils/database/Users";

const leaderboard: Command = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Affiche le top 10 des joueurs"),
  cooldown: 5,

  run: async (interaction) => {
    const top = Users.leaderboard(10);
    const description = top
      .map((u, i) => `**${i + 1}.** <@${u.id}> — Niveau ${u.level} (${u.xp} XP)`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle("🏆 Leaderboard")
      .setColor("Gold")
      .setDescription(description);

    await interaction.reply({ embeds: [embed] });
  },
};

export default leaderboard;
