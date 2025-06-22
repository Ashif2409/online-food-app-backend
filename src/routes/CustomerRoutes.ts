import express from 'express'
import { CustomerLogin, CustomerSignup, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOTP ,DeleteCart,GetCart,AddToCart,VerifyOffer, CreateOrder, GetOrders, GetOrderById, CreatePayment} from '../controllers/Custom.controller';
import { Authentication } from '../middlewares';

const router = express.Router();
/**
 * @swagger
 * /customer/signup:
 *   post:
 *     summary: Customer signup
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer created
 *       400:
 *         description: Validation or user already exists
 */
router.post('/signup', CustomerSignup);


/**
 * @swagger
 * /customer/login:
 *   post:
 *     summary: Customer login
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success, returns token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', CustomerLogin);


/**
 * @swagger
 * /customer/verify:
 *   patch:
 *     summary: Verify customer account using OTP
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: number
 *     responses:
 *       200:
 *         description: Verification successful
 *       400:
 *         description: Invalid OTP
 */
router.patch('/verify', CustomerVerify);


/**
 * @swagger
 * /customer/otp:
 *   get:
 *     summary: Request new OTP
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP sent
 *       500:
 *         description: Error sending OTP
 */
router.get('/otp', RequestOTP);


/**
 * @swagger
 * /customer/profile:
 *   get:
 *     summary: Get customer profile
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved
 */
router.get('/profile', GetCustomerProfile);


/**
 * @swagger
 * /customer/profile:
 *   patch:
 *     summary: Edit customer profile
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch('/profile', EditCustomerProfile);


/**
 * @swagger
 * /customer/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - food
 *               - unit
 *             properties:
 *               food:
 *                 type: string
 *               unit:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.post('/cart', AddToCart);


/**
 * @swagger
 * /customer/cart:
 *   get:
 *     summary: Get customer cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items
 */
router.get('/cart', GetCart);


/**
 * @swagger
 * /customer/cart:
 *   delete:
 *     summary: Clear customer cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete('/cart', DeleteCart);


/**
 * @swagger
 * /customer/offer/verify/{id}:
 *   get:
 *     summary: Verify an offer by ID
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Offer details
 *       404:
 *         description: Offer not found
 */
router.get('/offer/verify/:id', VerifyOffer);


/**
 * @swagger
 * /customer/create-payment:
 *   post:
 *     summary: Create a payment
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment created
 */
router.post('/create-payment', CreatePayment);


/**
 * @swagger
 * /customer/create-order:
 *   post:
 *     summary: Place a new order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - txnId
 *               - amount
 *               - items
 *             properties:
 *               txnId:
 *                 type: string
 *               amount:
 *                 type: number
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     food:
 *                       type: string
 *                     unit:
 *                       type: number
 *     responses:
 *       200:
 *         description: Order created
 */
router.post('/create-order', CreateOrder);


/**
 * @swagger
 * /customer/orders:
 *   get:
 *     summary: Get all customer orders
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get('/orders', GetOrders);


/**
 * @swagger
 * /customer/order/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/order/:id', GetOrderById);

export {router as CustomerRoutes};
