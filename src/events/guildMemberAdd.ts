import type { Event } from "../types/Event";
import { EmbedBuilder, TextChannel } from "discord.js";
import { GuildConfigs } from "../utils/database/GuildConfigs";

const guildMemberAdd: Event<"guildMemberAdd"> = {
  name: "guildMemberAdd",
  once: false,
  run: async (member) => {
    const channelId = GuildConfigs.getWelcomeChannel(member.guild.id);
    if (!channelId) return; // pas de salon configuré → ne rien faire

    const channel = member.guild.channels.cache.get(channelId) as TextChannel;
    if (!channel || !channel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle("🎉 Nouveau membre !")
      .setDescription(`Salut <@${member.id}> ! Bienvenue sur **${member.guild.name}** !`)
      .addFields(
        { name: "Membre n°", value: `${member.guild.memberCount}`, inline: true },
        { name: "Règles", value: "N'oublie pas de lire les règles du serveur !", inline: true }
      )
      .setColor(0x000000)
      .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
      .setFooter({ text: `Utilisateur : ${member.user.tag}` });

    await channel.send({ embeds: [embed] });
  },
};

export default guildMemberAdd;
