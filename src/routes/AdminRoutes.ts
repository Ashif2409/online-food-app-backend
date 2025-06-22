import express,{Request,Response,NextFunction} from 'express'
import { CreateVendor, GetVandorByID, GetVandors,GetTransactions,GetTransactionByID, VerifyDeliveryUser, GetDeliveryUser } from '../controllers';
import upload from '../middlewares/multer';
const router = express.Router();

/**
 * @swagger
 * /admin/vendor:
 *   post:
 *     summary: Create a new vendor
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - ownerName
 *               - foodType
 *               - pincode
 *               - address
 *               - phone
 *               - email
 *               - password
 *               - coverImages
 *             properties:
 *               name:
 *                 type: string
 *               ownerName:
 *                 type: string
 *               foodType:
 *                 type: string
 *               pincode:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               coverImages:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Vendor created
 *       400:
 *         description: File missing or invalid input
 *       500:
 *         description: Server error
 */
router.post('/vendor', upload.single('coverImages'), CreateVendor);


/**
 * @swagger
 * /admin/vendors:
 *   get:
 *     summary: Get all vendors
 *     responses:
 *       200:
 *         description: List of vendors
 *       404:
 *         description: No vendors found
 */
router.get('/vendors', GetVandors);


/**
 * @swagger
 * /admin/vendor/{id}:
 *   get:
 *     summary: Get a vendor by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the vendor
 *     responses:
 *       200:
 *         description: Vendor found
 *       404:
 *         description: Vendor not found
 */
router.get('/vendor/:id', GetVandorByID);


/**
 * @swagger
 * /admin/transactions:
 *   get:
 *     summary: Get all transactions
 *     responses:
 *       200:
 *         description: List of transactions
 *       404:
 *         description: No transactions found
 */
router.get('/transactions', GetTransactions);


/**
 * @swagger
 * /admin/transaction/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the transaction
 *     responses:
 *       200:
 *         description: Transaction found
 *       404:
 *         description: Transaction not found
 */
router.get('/transaction/:id', GetTransactionByID);


/**
 * @swagger
 * /admin/delivery/verify:
 *   put:
 *     summary: Verify a delivery user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *               - status
 *             properties:
 *               _id:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Delivery user verified
 *       400:
 *         description: Verification failed
 */
router.put('/delivery/verify', VerifyDeliveryUser);


/**
 * @swagger
 * /admin/delivery/users:
 *   get:
 *     summary: Get all delivery users
 *     responses:
 *       200:
 *         description: List of delivery users
 *       400:
 *         description: No delivery users found
 */
router.get('/delivery/users', GetDeliveryUser);


export {router as AdminRoutes}