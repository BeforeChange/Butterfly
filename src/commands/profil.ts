import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { Command } from "../types/Command";
import { Users } from "../utils/database/Users";

const profile: Command = {
  data: new SlashCommandBuilder()
    .setName("profil")
    .setDescription("Montre le profil d'un joueur")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Utilisateur à afficher")
        .setRequired(false)
    ) as SlashCommandBuilder,
  cooldown: 5,

  run: async (interaction) => {
    const user = interaction.options.getUser("user") || interaction.user;
    const userData = Users.get(user.id);

    const nextLevelXp = userData.level * userData.level * 50;

    const pourcentage = Math.floor((userData.xp / nextLevelXp) * 100);
    const progressUnits = Math.round(pourcentage / 10);
    const bar = "▰".repeat(progressUnits) + "▱".repeat(10 - progressUnits);

    const today = new Date();
    const day = today.getDay(); // 0 = dimanche, 6 = samedi
    const footerText = (day === 0 || day === 6) ? "🎉 Weekend : XP x2 !" : undefined;

    const embed = new EmbedBuilder()
      .setTitle(`${user.username} - Profil`)
      .setColor(0x000000)
      .addFields(
        { name: "Niveau", value: `${userData.level}`, inline: true },
        { name: "XP", value: `${userData.xp}/${nextLevelXp}`, inline: true },
        { name: "Progression", value: `[${bar}] ${pourcentage}%` },
        { name: "Description", value: userData.description || "Aucune description définie." }
      )
      .setThumbnail(user.displayAvatarURL({ size: 512 }))
      if (footerText) {
        embed.setFooter({ text: footerText });
      }
    await interaction.reply({ embeds: [embed] });
  },
};

export default profile;
