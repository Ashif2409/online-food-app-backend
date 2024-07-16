import {Request,Response, NextFunction } from "express";
import { FoodDoc, Offer, Vandor } from "../models";

export const GetFoodAvailability = async(req:Request,res:Response,next:NextFunction)=>{
    const pincode = req.params.pincode;
    const result =await Vandor.find({pincode:pincode,serviceAvailabel:true})
                        .sort([['rating','descending']])
                        .populate("food");
    if(result){
       return res.status(200).json({result});
    }
    res.status(400).json({"message":"Data not found"});
}
export const GetTopRestaurants = async(req:Request,res:Response,next:NextFunction)=>{
    const pincode = req.params.pincode;
    const result =await Vandor.find({pincode:pincode,serviceAvailabel:true})
                        .sort([['rating','descending']])
                        .limit(10);
    if(result){
       return res.status(200).json({result});
    }
    res.status(400).json({"message":"Data not found"});
}
export const GetFoodIn30Min = async(req:Request,res:Response,next:NextFunction)=>{
    const pincode = req.params.pincode;
    const result =await Vandor.find({pincode:pincode,serviceAvailabel:false})
                        .populate("food")
    if(result){
        let foodResult:any=[];
        result.map(vandor=>{
            const foods = vandor.food as [FoodDoc]
            foodResult.push({...foods.filter(food=>food.readyTime <=30)})
        })
       return res.status(200).json({foodResult});
    }
    res.status(400).json({"message":"Data not found"});
}

export const SearchFoods = async(req:Request,res:Response,next:NextFunction)=>{
    const pincode = req.params.pincode;
    const result =await Vandor.find({pincode:pincode})
    if(result){
        const foodResults:any = [];
        result.map(item=>foodResults.push(...item.food));
       return res.status(200).json({foodResults});
    }
    return res.status(400).json({"message":"Data not found"});

}
export const RestaurantById = async(req:Request,res:Response,next:NextFunction)=>{
    const pincode = req.params.pincode;
    const result =await Vandor.find({pincode:pincode}).populate('food')
    if(result){
       return res.status(200).json({result});
    }
    return res.status(400).json({"message":"Data not found"});
}
export const GetAvailabeOffer = async(req:Request,res:Response,next:NextFunction)=>{
    const pincode = req.params.pincode;
    const offers =await Offer.find({pincode:pincode,isActive:true});
    if(offers){
       return res.status(200).json(offers);
    }
    return res.status(400).json({"message":"Offer not found"});
}
