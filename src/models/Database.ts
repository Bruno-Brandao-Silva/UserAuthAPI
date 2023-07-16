import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  private static instance: Database;
  private db?: Db;

  private constructor() {
    const url = process.env.MONGODB_URL!;
    const dbName = process.env.MONGODB_DB_NAME!;

    const client = new MongoClient(url);

    client
      .connect()
      .then(() => {
        this.db = client.db(dbName);
        console.log('Conectado ao MongoDB');
      })
      .catch(error => {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
      });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getDB(): Db {
    if (!this.db) {
      throw new Error('Conexão com o banco de dados não estabelecida');
    }
    return this.db;
  }
}

export default Database;
