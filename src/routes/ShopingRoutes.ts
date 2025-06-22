import express ,{Request,Response,NextFunction} from 'express'
import { GetFoodAvailability,GetTopRestaurants,GetFoodIn30Min,SearchFoods,RestaurantById,GetAvailabeOffer } from '../controllers/Shoping.controller';
const router = express.Router();

/**
 * @swagger
 * /shopping/{pincode}:
 *   get:
 *     summary: Get all restaurants by pincode
 *     tags: [Shopping]
 *     parameters:
 *       - name: pincode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of restaurants with food
 */
router.get('/:pincode', GetFoodAvailability);

/**
 * @swagger
 * /shopping/top-restaurants/{pincode}:
 *   get:
 *     summary: Get top 10 rated restaurants in pincode
 *     tags: [Shopping]
 *     parameters:
 *       - name: pincode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Top restaurants
 */
router.get('/top-restaurants/:pincode', GetTopRestaurants);

/**
 * @swagger
 * /shopping/foods-in-30-min/{pincode}:
 *   get:
 *     summary: Get food that can be delivered in 30 minutes
 *     tags: [Shopping]
 *     parameters:
 *       - name: pincode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fast delivery foods
 */
router.get('/foods-in-30-min/:pincode', GetFoodIn30Min);

/**
 * @swagger
 * /shopping/search/{pincode}:
 *   get:
 *     summary: Search foods in the area
 *     tags: [Shopping]
 *     parameters:
 *       - name: pincode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search/:pincode', SearchFoods);

/**
 * @swagger
 * /shopping/offers/{pincode}:
 *   get:
 *     summary: Get available offers by pincode
 *     tags: [Shopping]
 *     parameters:
 *       - name: pincode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Offers
 */
router.get('/offers/:pincode', GetAvailabeOffer);

/**
 * @swagger
 * /shopping/restaurant/{pincode}:
 *   get:
 *     summary: Get restaurants in area (duplicate/fallback route)
 *     tags: [Shopping]
 *     parameters:
 *       - name: pincode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurants list
 */
router.get('/restaurant/:pincode', RestaurantById);


export {router as ShopingRoutes};