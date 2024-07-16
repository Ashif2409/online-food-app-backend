import { Request,Response,NextFunction } from "express"
import { AuthPayLoad } from "../dto/Auth.dto"
import { ValidateSignature } from "../utility"

declare global{
    namespace Express{
        interface Request {
            user?:AuthPayLoad
            }
    }
}

export const Authentication  = async(req:Request,res:Response,next:NextFunction)=>{
    const validate =await ValidateSignature(req);
    if(validate){
        next()
    }else{
        res.json({"message":"User is not authorized"})
    }
}

