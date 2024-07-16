"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = express_1.default.Router();
exports.AdminRoutes = router;
router.post('/vandor', multer_1.default.single('coverImages'), controllers_1.CreateVandor);
router.get('/vandors', controllers_1.GetVandors);
router.get('/vandor/:id', controllers_1.GetVandorByID);
router.get('/transactions', controllers_1.GetTransactions);
router.get('/transaction/:id', controllers_1.GetTransactionByID);
router.put('/delivery/verify', controllers_1.VerifyDeliveryUser);
router.get('/delivery/users', controllers_1.GetDeliveryUser);
router.get("/", (req, res, next) => {
    return res.json({ message: "Admin Routes" });
});
//# sourceMappingURL=AdminRoutes.js.map