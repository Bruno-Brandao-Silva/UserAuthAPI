import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomRequest } from '../types';

dotenv.config();

const SECRET = process.env.SECRET!;

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
    // const token = req.headers['x-access-token'] as string;
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Nenhum token encontrado.' });

    try {
        const decoded = jwt.verify(token, SECRET);
        console.log(decoded);
        // req.token = token;
        // req.user = decoded;
        next();
    } catch (err: any) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token invÃ¡lido.' });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado.' });
        } else {
            return res.status(500).json({ message: 'Falha ao autenticar token.', error: err.message });
        }
    }
}

export function signJWT(object: Object | any) {
    return jwt.sign(object, SECRET);
}
