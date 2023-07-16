import { Router, Request, Response } from 'express';
import User from '../models/User';

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
      res.status(200).json({ message: 'Usuário autenticado com sucesso' });
    } else {
      res.status(401).end();
    }
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).end();
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = new User(name, email, password, id);
    await user.update();

    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).end();
  }

});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.delete(id);

    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).end();
  }
});

router.get('/all', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    res.status(500).end();
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).end();
  }
});

export default router;
