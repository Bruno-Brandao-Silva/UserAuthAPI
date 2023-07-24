import { NextFunction, Response, Request } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const SECRET = process.env.SECRET_KEY!;

export async function verifyJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Nenhum token encontrado.' });

    try {
        const user = jwt.verify(token, SECRET) as User;
        req.userId = String(user._id);
        // É possivel adicionar niveis de acesso ao token
        // req.userLevel = user.level;
        const search = await User.findById(req.userId)
        if (!search) {
            throw new JsonWebTokenError('Usuário não encontrado.');
        }
        next();
    } catch (err: any) {
        if (err.name === 'JsonWebTokenError') {
            res.clearCookie('token');
            return res.status(401).json({ message: 'Token inválido.' });
        } else if (err.name === 'TokenExpiredError') {
            res.clearCookie('token');
            return res.status(401).json({ message: 'Token expirado.' });
        } else {
            return res.status(500).json({ message: 'Falha ao autenticar token.', error: err.message });
        }
    }
}

export function signJWT(object: Object | any) {
    return jwt.sign({ ...object }, SECRET);
}
