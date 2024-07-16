import express,{Request,Response,NextFunction} from 'express'
import { CreateVandor, GetVandorByID, GetVandors,GetTransactions,GetTransactionByID, VerifyDeliveryUser, GetDeliveryUser } from '../controllers';
import upload from '../middlewares/multer';
const router = express.Router();

router.post('/vandor', upload.single('coverImages'), CreateVandor);
router.get('/vandors',GetVandors)
router.get('/vandor/:id',GetVandorByID)

router.get('/transactions',GetTransactions)
router.get('/transaction/:id',GetTransactionByID)

router.put('/delivery/verify',VerifyDeliveryUser)
router.get('/delivery/users',GetDeliveryUser)

router.get("/",(req:Request,res:Response,next:NextFunction)=>{
    return res.json({message:"Admin Routes"})
})

export {router as AdminRoutes}