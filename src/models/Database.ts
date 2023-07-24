import { MongoClient, Db, ObjectId, WithId, OptionalUnlessRequiredId, Filter, Document, InsertOneResult } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    private url: string;
    private dbName: string;
    private client: MongoClient | null;
    private db: Db | null;

    constructor() {
        this.url = process.env.MONGODB_URL!;
        this.dbName = process.env.MONGODB_DB_NAME!;
        this.client = null;
        this.db = null;
    }

    private async connect(): Promise<void> {
        try {
            this.client = await MongoClient.connect(this.url);
            this.db = this.client.db(this.dbName);
        } catch (error) {
            console.error('Failed to connect to the database:', error);
            throw error;
        }
    }

    private getDatabase(): Db {
        if (!this.db) {
            throw new Error('Database connection not established');
        }
        return this.db;
    }

    private async disconnect(): Promise<void> {
        try {
            if (this.client) {
                await this.client.close();
            }
        } catch (error) {
            console.error('Failed to disconnect from the database:', error);
            throw error;
        }
    }

    public async execute<T>(callback: (db: Db) => Promise<T>): Promise<T> {
        try {
            await this.connect();
            const result = await callback(this.getDatabase());
            await this.disconnect();
            return result;
        } catch (error) {
            console.error('Failed to execute database operation:', error);
            throw error;
        }
    }

    public async find<T extends Document>(
        collectionName: string,
        filter: Filter<T> = {}
    ): Promise<WithId<T>[]> {
        return this.execute(async (db) => {
            const collection = db.collection<T>(collectionName);
            const result = await collection.find(filter).toArray();
            return result;
        });
    }
    public async findOne<T extends Document>(
        collectionName: string,
        filter: Filter<T> = {}
    ): Promise<WithId<T> | null> {
        return this.execute(async (db) => {
            const collection = db.collection<T>(collectionName);
            const result = await collection.findOne(filter);
            return result;
        });
    }
    public async insertOne<T extends Document>(
        collectionName: string,
        document: OptionalUnlessRequiredId<T>
    ): Promise<InsertOneResult<T>> {
        return await this.execute(async (db) => {
            const collection = db.collection<T>(collectionName);
            return await collection.insertOne(document);
        });
    }

    public async insertMany<T extends Document>(
        collectionName: string,
        documents: OptionalUnlessRequiredId<T>[]
    ): Promise<void> {
        await this.execute(async (db) => {
            const collection = db.collection<T>(collectionName);
            await collection.insertMany(documents);
        });
    }

    public async updateOne<T extends Document>(
        collectionName: string,
        filter: Filter<T>,
        update: Partial<T>
    ): Promise<void> {
        await this.execute(async (db) => {
            const collection = db.collection<T>(collectionName);
            await collection.updateOne(filter, { $set: update });
        });
    }

    public async deleteOne<T extends Document>(
        collectionName: string,
        filter: Filter<T>
    ): Promise<void> {
        await this.execute(async (db) => {
            const collection = db.collection<T>(collectionName);
            await collection.deleteOne(filter);
        });
    }

    public async findById<T extends Document>(
        collectionName: string,
        id: string
    ): Promise<WithId<T> | null> {
        return this.execute(async (db) => {
            const collection = db.collection<T>(collectionName);
            const result = await collection.findOne({ _id: new ObjectId(id) } as Filter<T>);
            return result;
        });
    }
}

export default Database;
