import { DB } from "./index";

export type UserData = {
  id: string;
  xp: number;
  level: number;
  description: string;
};

const db = DB.getInstance();

// Crée la table si elle n’existe pas
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1
)
`).run();

export class Users {
  static get(id: string): UserData {
    let user = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserData | undefined;
    if (!user) {
      db.prepare("INSERT INTO users (id) VALUES (?)").run(id);
      user = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserData;
    }
    return user;
  }

    static addXp(id: string, amount: number = 1): { xp: number; level: number; leveledUp: boolean; nextLevelXp: number; progress: number } {
    const user = Users.get(id);

    // Vérifie si c'est le weekend
    const today = new Date();
    const day = today.getDay(); // 0 = dimanche, 6 = samedi
    if (day === 0 || day === 6) {
        amount *= 2; // double XP
    }

    const newXp = user.xp + amount; // ajoute toujours 1 XP par message

    // Niveau progressif : chaque niveau n demande n^2 * 50 XP
    let newLevel = 1;
    while (newXp >= newLevel * newLevel * 50) {
        newLevel++;
    }

    const leveledUp = newLevel > user.level;

    db.prepare("UPDATE users SET xp = ?, level = ? WHERE id = ?").run(newXp, newLevel, id);

    const nextLevelXp = newLevel * newLevel * 50;
    const progress = Math.floor((newXp / nextLevelXp) * 100); // % vers le prochain niveau

    return { xp: newXp, level: newLevel, leveledUp, nextLevelXp, progress };
    }

    static leaderboard(limit = 10): UserData[] {
        return db
            .prepare("SELECT * FROM users ORDER BY xp DESC LIMIT ?")
            .all(limit) as UserData[];
    }

    static setDescription(id: string, description: string) {
      this.get(id);
      db.prepare("UPDATE users SET description = ? WHERE id = ?").run(description, id);
    }
}
