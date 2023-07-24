import { Router, Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { verifyJWT, signJWT } from '../middlewares/JWT';
import { validationResult } from 'express-validator';

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
  } catch (e: any) {
    console.error('Erro ao registrar usuário:', e);
    if (e.message === 'Usuário já existe')
      res.status(409).json({ error: 'Usuário já existe' });
    else
      res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password);
    if (user) {
      const token = signJWT(user);
      res.cookie('token', token, { httpOnly: true, secure: true, expires: new Date(Date.now() + 1000 * 60 * 60) });
      res.status(200).json({ message: 'Usuário autenticado com sucesso' });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ error: 'Erro ao autenticar usuário' });
  }
});


router.get('/all', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll();
    res.json({ data: users });
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    next(error);
  }
});

router.get('/:id', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (user) {
      res.json({ data: user });
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    next(error);
  }
});

router.put('/:id', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = new User(name, email, password, id);
    await user.update();

    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    next(error);
  }
});

router.delete('/:id', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await User.delete(id);

    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    next(error);
  }
});

export default router;
