import { ObjectId } from 'mongodb';
import Database from './Database';


class User {
    private static collection = 'users';
    private static db = new Database();
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;

    constructor(name: string, email: string, password: string, id?: ObjectId | string) {
        this._id = id ? new ObjectId(id) : undefined;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    async register(): Promise<ObjectId | void> {
        const user = await User.db.findOne(User.collection, { email: this.email });
        if (!user) {
            const result = await User.db.insertOne(User.collection, {
                name: this.name,
                email: this.email,
                password: this.password,
            });
            if (result.acknowledged)
                return result.insertedId
            else throw new Error('Erro ao inserir usuário');
        } else {
            throw new Error('Usuário já existe');
        }
    }

    async update(): Promise<void> {
        await User.db.updateOne(User.collection, { _id: this._id }, { name: this.name, email: this.email, password: this.password });
    }

    static async delete(id: string): Promise<void> {
        await User.db.deleteOne(User.collection, { _id: new ObjectId(id) });
    }

    static async findById(id: string): Promise<User | void> {
        const user = await this.db.findById(User.collection, id);
        if (user) {
            return new User(user.name, user.email, user.password, user._id);
        }
    }

    static async login(email: string, password: string): Promise<User | void> {
        const user = await this.db.findOne(User.collection, { email, password });
        if (user) {
            return new User(user.name, user.email, user.password, user._id);
        }
    }
    
    static async findAll(): Promise<User[]> {
        const users = await this.db.find(User.collection);
        return users.map(user => new User(user.name, user.email, user.password, user.id));
    }
}

export default User;