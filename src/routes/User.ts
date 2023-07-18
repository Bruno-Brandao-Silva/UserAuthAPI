import { Router, Request, Response } from 'express';
import User from '../models/User';
import { verifyJWT } from '../middlewares/JWT';

const router = Router();

router.get('/all', verifyJWT, async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    res.status(500).end();
  }
});

router.get('/:id', verifyJWT, async (req: Request, res: Response) => {
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

router.put('/:id', verifyJWT, async (req: Request, res: Response) => {
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

router.delete('/:id', verifyJWT, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.delete(id);

    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).end();
  }
});

export default router;