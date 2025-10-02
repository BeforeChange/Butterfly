import { DB } from "../database";

const db = DB.getInstance();

db.prepare(`
CREATE TABLE IF NOT EXISTS guild_configs (
  guildId TEXT PRIMARY KEY,
  welcomeChannelId TEXT
)
`).run();

export class GuildConfigs {
  static setWelcomeChannel(guildId: string, channelId: string) {
    db.prepare(`
      INSERT INTO guild_configs (guildId, welcomeChannelId)
      VALUES (?, ?)
      ON CONFLICT(guildId) DO UPDATE SET welcomeChannelId=excluded.welcomeChannelId
    `).run(guildId, channelId);
  }

  static getWelcomeChannel(guildId: string): string | null {
    const row = db.prepare("SELECT welcomeChannelId FROM guild_configs WHERE guildId = ?")
        .get(guildId) as { welcomeChannelId?: string } | undefined;
    return row?.welcomeChannelId || null;
  }
}
