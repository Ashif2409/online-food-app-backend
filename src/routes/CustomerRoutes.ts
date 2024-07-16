import express from 'express'
import { CustomerLogin, CustomerSignup, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOTP ,DeleteCart,GetCart,AddToCart,VerifyOffer, CreateOrder, GetOrders, GetOrderById, CreatePayment} from '../controllers/Custom.controller';
import { Authentication } from '../middlewares';

const router = express.Router();

router.post('/signup',CustomerSignup)

router.post('/login',CustomerLogin)

router.use(Authentication)
router.patch('/verify',CustomerVerify)

router.get('/otp',RequestOTP);

router.get('/profile',GetCustomerProfile)

router.patch('/profile',EditCustomerProfile)

//cart
router.post('/cart',AddToCart)
router.get('/cart',GetCart)
router.delete('/cart',DeleteCart)

// Apply offer
router.get('/offer/verify/:id',VerifyOffer)

// payment
router.post('/create-payment',CreatePayment);


router.post('/create-order',CreateOrder)
router.get('/orders',GetOrders)
router.get('/order/:id',GetOrderById)

export {router as CustomerRoutes};
