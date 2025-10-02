import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
  data: SlashCommandBuilder;
  run: (interaction: ChatInputCommandInteraction) => Promise<void>;
  cooldown?: number; // Cooldown en secondes
}
