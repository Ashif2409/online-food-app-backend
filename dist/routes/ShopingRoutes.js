"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Shoping_controller_1 = require("../controllers/Shoping.controller");
const router = express_1.default.Router();
exports.ShopingRoutes = router;
router.get('/:pincode', Shoping_controller_1.GetFoodAvailability);
router.get('/top-restaurants/:pincode', Shoping_controller_1.GetTopRestaurants);
router.get('/foods-in-30-min/:pincode', Shoping_controller_1.GetFoodIn30Min);
router.get('/search/:pincode', Shoping_controller_1.SearchFoods);
// find offer
router.get('/offers/:pincode', Shoping_controller_1.GetAvailabeOffer);
router.get('/restaurant/:pincode', Shoping_controller_1.RestaurantById);
//# sourceMappingURL=ShopingRoutes.js.map