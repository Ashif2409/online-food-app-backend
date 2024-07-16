import express, { Request, Response, NextFunction } from 'express';
import { VandorLogin, GetVandorProfile, UpdateVandorProfile, UpdateVandorService, Addfood, Getfood, UpdateVandorCoverImage, GetOrderDetails, GetCurrentOrders, ProcessOrder, GetOffer, AddOffer, EditOffer } from '../controllers';
import { Authentication } from '../middlewares';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: imageStorage });

router.post("/login", VandorLogin);
router.use(Authentication);

router.get("/profile", GetVandorProfile);
router.patch("/profile", UpdateVandorProfile);
router.patch('/coverimage', upload.single('coverImages'), UpdateVandorCoverImage);
router.patch("/service", UpdateVandorService);

// router.post("/food", upload.single('images'), Addfood);
// router.post("/food", Addfood);
router.post('/food', upload.array('images', 10), Addfood);
router.get("/foods", Getfood);

router.get('/orders', GetCurrentOrders);
router.put('/orders/:id/process', ProcessOrder);
router.get('/orders/:id', GetOrderDetails);

// OFFERS
router.get('/offers', GetOffer);
router.post('/offer', AddOffer);
router.put('/offers/:id', EditOffer);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    return res.json({ message: "vandor Routes" });
});

export { router as VandorRoutes };
