"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Custom_controller_1 = require("../controllers/Custom.controller");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRoutes = router;
router.post('/signup', Custom_controller_1.CustomerSignup);
router.post('/login', Custom_controller_1.CustomerLogin);
router.use(middlewares_1.Authentication);
router.patch('/verify', Custom_controller_1.CustomerVerify);
router.get('/otp', Custom_controller_1.RequestOTP);
router.get('/profile', Custom_controller_1.GetCustomerProfile);
router.patch('/profile', Custom_controller_1.EditCustomerProfile);
//cart
router.post('/cart', Custom_controller_1.AddToCart);
router.get('/cart', Custom_controller_1.GetCart);
router.delete('/cart', Custom_controller_1.DeleteCart);
// Apply offer
router.get('/offer/verify/:id', Custom_controller_1.VerifyOffer);
// payment
router.post('/create-payment', Custom_controller_1.CreatePayment);
router.post('/create-order', Custom_controller_1.CreateOrder);
router.get('/orders', Custom_controller_1.GetOrders);
router.get('/order/:id', Custom_controller_1.GetOrderById);
//# sourceMappingURL=CustomerRoutes.js.map