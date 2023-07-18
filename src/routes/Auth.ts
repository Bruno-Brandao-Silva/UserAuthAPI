import { Router, Request, Response } from 'express';
import User from '../models/User';
import { signJWT } from '../middlewares/JWT';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const id = await new User(name, email, password).register();

        id ? res.status(201).json({ message: 'Usuário registrado com sucesso', id }) : new Error('Erro ao registrar usuário');
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).end();
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.login(email, password);
        if (user) {
            const token = signJWT(user);
            res.cookie('token', token, { httpOnly: true, secure: true });
            res.status(200).json({ message: 'Usuário autenticado com sucesso' });
        } else {
            res.status(401).end();
        }
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).end();
    }
});