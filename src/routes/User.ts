import { Router, Request, Response } from 'express';
import User from '../models/User';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { id, name, email, password } = req.body;

    const user = new User(id, name, email, password);
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao registrar o usuário' });
  }
});

router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao obter os usuários' });
  }
});

router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao obter o usuário' });
  }
});

export default router;
