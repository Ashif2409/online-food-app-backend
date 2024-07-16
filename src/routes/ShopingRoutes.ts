import express ,{Request,Response,NextFunction} from 'express'
import { GetFoodAvailability,GetTopRestaurants,GetFoodIn30Min,SearchFoods,RestaurantById,GetAvailabeOffer } from '../controllers/Shoping.controller';
const router = express.Router();

router.get('/:pincode',GetFoodAvailability)
router.get('/top-restaurants/:pincode',GetTopRestaurants)
router.get('/foods-in-30-min/:pincode',GetFoodIn30Min)
router.get('/search/:pincode',SearchFoods)
// find offer
router.get('/offers/:pincode',GetAvailabeOffer)
router.get('/restaurant/:pincode',RestaurantById)

export {router as ShopingRoutes};