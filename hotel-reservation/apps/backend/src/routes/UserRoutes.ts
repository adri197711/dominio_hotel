import { Router } from 'express';
import { registerUserController } from '../controllers/UserController';


const router = Router();


router.post('/register', registerUserController);

export default router;