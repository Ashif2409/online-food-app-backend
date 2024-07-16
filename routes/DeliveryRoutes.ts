import express from 'express'
import { DeliveryUserLogin, DeliveryUserSignup,GetDeliveryUserProfile,EditDeliveryUserProfile,UpdateDeliveryUserStatus} from '../controllers/';
import { Authentication } from '../middlewares';

const router = express.Router();

router.post('/signup',DeliveryUserSignup)

router.post('/login',DeliveryUserLogin)

router.use(Authentication)

// changing service status
router.put('/change-status',UpdateDeliveryUserStatus);

router.get('/profile',GetDeliveryUserProfile)

router.patch('/profile',EditDeliveryUserProfile)



export {router as DeliveryRoutes};
