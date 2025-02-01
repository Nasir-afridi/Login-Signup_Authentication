import express from 'express';
import {Router} from 'express';
import { Signup,Login } from '../controllers/registration.controllers.js';

const router = new Router();
router.post('/signup',Signup);
router.post('/login', Login);

export default router;
