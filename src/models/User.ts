import { ObjectId, Collection } from 'mongodb';
import Database from './Database';

/**
 * Representa um usuário.
 */
class User {
    /**
     * A coleção "users" no banco de dados MongoDB.
     */
    private static collection = Database.getInstance().getDB().collection('users');;

    /**
     * O ID do usuário.
     */
    id: ObjectId;

    /**
     * O nome do usuário.
     */
    name: string;

    /**
     * O email do usuário.
     */
    email: string;

    /**
     * A senha do usuário.
     */
    password: string;

    /**
     * Cria uma instância de User.
     * @param id - O ID do usuário.
     * @param name - O nome do usuário.
     * @param email - O email do usuário.
     * @param password - A senha do usuário.
     */
    constructor(id: ObjectId, name: string, email: string, password: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    /**
     * Salva o usuário no banco de dados.
     * @returns Uma Promise que é resolvida quando a operação for concluída.
     */
    async save(): Promise<void> {
        await User.collection.insertOne({
            _id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
        });
    }

    /**
     * Atualiza o usuário no banco de dados.
     * @returns Uma Promise que é resolvida quando a operação for concluída.
     */
    async update(): Promise<void> {
        await User.collection.updateOne(
            { _id: this.id },
            { $set: { name: this.name, email: this.email, password: this.password } }
        );
    }

    /**
     * Exclui o usuário do banco de dados.
     * @returns Uma Promise que é resolvida quando a operação for concluída.
     */
    async delete(): Promise<void> {
        await User.collection.deleteOne({ _id: this.id });
    }

    /**
     * Busca um usuário pelo ID.
     * @param id - O ID do usuário.
     * @returns Uma Promise que é resolvida com o usuário encontrado ou null se não for encontrado.
     */
    static async findById(id: ObjectId | string): Promise<User | null> {
        if (typeof id === 'string') {
            id = new ObjectId(id);
        }
        const user = await User.collection.findOne({ _id: id });
        if (user) {
            return new User(user._id, user.name, user.email, user.password);
        }
        return null;
    }

    /**
     * Busca um usuário pelo email.
     * @param email - O email do usuário.
     * @returns Uma Promise que é resolvida com o usuário encontrado ou null se não for encontrado.
     */
    static async findByEmail(email: string): Promise<User | null> {
        const user = await User.collection.findOne({ email });
        if (user) {
            return new User(user._id, user.name, user.email, user.password);
        }
        return null;
    }

    /**
     * Busca todos os usuários.
     * @returns Uma Promise que é resolvida com uma lista de todos os usuários.
     */
    static async findAll(): Promise<User[]> {
        const users = await User.collection.find().toArray();
        return users.map(user => new User(user._id, user.name, user.email, user.password));
    }
}

export default User;
