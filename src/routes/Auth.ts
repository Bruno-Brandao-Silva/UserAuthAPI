import { Router, Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { signJWT } from '../middlewares/JWT';

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = await new User(name, email, password).register();

        res.status(201).json({ message: 'Usuário registrado com sucesso', id });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await User.login(email, password);
        if (user) {
            const token = signJWT(user);
            res.cookie('token', token, { httpOnly: true, secure: true });
            res.status(200).json({ message: 'Usuário autenticado com sucesso' });
        } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ error: 'Erro ao autenticar usuário' });
    }
});

export default router;
