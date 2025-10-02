import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, EmbedBuilder, TextChannel } from "discord.js";
import type { Command } from "../types/Command";
import { GuildConfigs } from "../utils/database/GuildConfigs";

const simulateWelcome: Command = {
  data: new SlashCommandBuilder()
    .setName("simulate-welcome")
    .setDescription("Simule l'arrivée d'un membre")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Membre à simuler")
        .setRequired(true)
    ) as SlashCommandBuilder,
  cooldown: 5,

  run: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const user = interaction.options.getUser("user");
    if (!user) {
        await interaction.reply({ content: "Utilisateur invalide.", flags: MessageFlags.Ephemeral });
        return;
    }

    const channelId = GuildConfigs.getWelcomeChannel(interaction.guildId!);
    if (!channelId) {
        await interaction.reply({ content: "Aucun salon de bienvenue configuré pour ce serveur.", flags: MessageFlags.Ephemeral });
        return;
    }

    const channel = interaction.guild?.channels.cache.get(channelId) as TextChannel;
    if (!channel || !channel.isTextBased()) {
      await interaction.reply({ content: "Le salon configuré n'est pas un salon texte valide.", flags: MessageFlags.Ephemeral });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("🎉 Nouveau membre !")
      .setDescription(`Salut <@${user.id}> ! Bienvenue sur **${interaction.guild?.name}** !`)
      .addFields(
        { name: "Membre n°", value: `${interaction.guild?.memberCount ?? "?"}`, inline: true },
        { name: "Règles", value: "N'oublie pas de lire les règles du serveur !", inline: true }
      )
      .setColor(0x000000)
      .setThumbnail(user.displayAvatarURL({ size: 512 }))
      .setFooter({ text: `Utilisateur : ${user.tag}` });

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: `Message de bienvenue simulé pour ${user.tag}.`, flags: MessageFlags.Ephemeral });
  },
};

export default simulateWelcome;
