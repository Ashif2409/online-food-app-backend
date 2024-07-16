"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers/");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.DeliveryRoutes = router;
router.post('/signup', controllers_1.DeliveryUserSignup);
router.post('/login', controllers_1.DeliveryUserLogin);
router.use(middlewares_1.Authentication);
// changing service status
router.put('/change-status', controllers_1.UpdateDeliveryUserStatus);
router.get('/profile', controllers_1.GetDeliveryUserProfile);
router.patch('/profile', controllers_1.EditDeliveryUserProfile);
//# sourceMappingURL=DeliveryRoutes.js.map