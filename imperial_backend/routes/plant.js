import express from 'express';
import Plant from '../Model/plants.js';
import { Create,Single,AllPlant,Update,Delete,Qr,Login } from '../Controller/PlantController.js';
import upload from '../Middleware/Multer.js';
import authuser from '../Middleware/Auth.js';
const router = express.Router();

router.get('/',AllPlant);
router.put('/:id',authuser,Update);
router.post('/create',authuser,Create);
router.delete('/:id',authuser,Delete);
router.get('/:id',Single)
router.post('/login',Login)
router.get('/:id/qr',Qr)
export default router;