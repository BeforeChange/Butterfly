import DatabaseConstructor from "better-sqlite3";
import path from "path";

export class DB {
  private static instance: ReturnType<typeof DatabaseConstructor>;

  static getInstance() {
    if (!DB.instance) {
      DB.instance = new DatabaseConstructor(path.join(__dirname, "../../../bot.db"));
      console.log("🟢 Database ouverte !");
    }
    return DB.instance;
  }
}
