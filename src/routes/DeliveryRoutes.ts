import express from 'express'
import { DeliveryUserLogin, DeliveryUserSignup,GetDeliveryUserProfile,EditDeliveryUserProfile,UpdateDeliveryUserStatus} from '../controllers/';
import { Authentication } from '../middlewares';

const router = express.Router();

/**
 * @swagger
 * /delivery/signup:
 *   post:
 *     summary: Signup a delivery user
 *     tags: [Delivery]
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
 *               - address
 *               - firstName
 *               - lastName
 *               - pincode
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               pincode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Delivery user created
 */
router.post('/signup', DeliveryUserSignup);

/**
 * @swagger
 * /delivery/login:
 *   post:
 *     summary: Login a delivery user
 *     tags: [Delivery]
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
 *         description: Login success
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', DeliveryUserLogin);

/**
 * @swagger
 * /delivery/change-status:
 *   put:
 *     summary: Update delivery user's active status
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Bad request
 */
router.put('/change-status', UpdateDeliveryUserStatus);

/**
 * @swagger
 * /delivery/profile:
 *   get:
 *     summary: Get delivery user profile
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved
 */
router.get('/profile', GetDeliveryUserProfile);

/**
 * @swagger
 * /delivery/profile:
 *   patch:
 *     summary: Update delivery user profile
 *     tags: [Delivery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch('/profile', EditDeliveryUserProfile);




export {router as DeliveryRoutes};
