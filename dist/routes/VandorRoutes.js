"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VandorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
exports.VandorRoutes = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: imageStorage });
router.post("/login", controllers_1.VandorLogin);
router.use(middlewares_1.Authentication);
router.get("/profile", controllers_1.GetVandorProfile);
router.patch("/profile", controllers_1.UpdateVandorProfile);
router.patch('/coverimage', upload.single('coverImages'), controllers_1.UpdateVandorCoverImage);
router.patch("/service", controllers_1.UpdateVandorService);
// router.post("/food", upload.single('images'), Addfood);
// router.post("/food", Addfood);
router.post('/food', upload.array('images', 10), controllers_1.Addfood);
router.get("/foods", controllers_1.Getfood);
router.get('/orders', controllers_1.GetCurrentOrders);
router.put('/orders/:id/process', controllers_1.ProcessOrder);
router.get('/orders/:id', controllers_1.GetOrderDetails);
// OFFERS
router.get('/offers', controllers_1.GetOffer);
router.post('/offer', controllers_1.AddOffer);
router.put('/offers/:id', controllers_1.EditOffer);
router.get("/", (req, res, next) => {
    return res.json({ message: "vandor Routes" });
});
//# sourceMappingURL=VandorRoutes.js.map