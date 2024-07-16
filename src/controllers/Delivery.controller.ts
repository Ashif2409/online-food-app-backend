import express,{Request, Response, NextFunction} from 'express'

import { plainToClass } from 'class-transformer'
import { CreateCustomerInputs,UserLoginInputs,EditCustomerProfileInput, OrderInputs,CartItem, CreateDeliveryUserInputs } from '../dto/Customer.dto'
import { ValidationError,validate } from 'class-validator';
import { GenerateOTP, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOTP } from '../utility';
import { Customer } from '../models/Customer.model';
import { sign } from 'jsonwebtoken';
import {PasswordValidate} from '../utility'
import { Food, Offer, Order, Vandor } from '../models';
import { Transaction } from '../models/Transaction';
import { DeliveryUser } from '../models/Delivery.model';
import { Message } from 'twilio/lib/twiml/MessagingResponse';

export const DeliveryUserSignup = async(req:Request,res:Response,next:NextFunction)=>{
    const deliveryUserInput=plainToClass(CreateDeliveryUserInputs,req.body);
    const inputErrors = await validate(deliveryUserInput);

    if(inputErrors.length >0){
       return res.status(400).json(inputErrors);
    }

    const {email,phone,password,address,firstName,lastName,pincode}=deliveryUserInput;
    const salt = await GenerateSalt();
    const userPassword=await GeneratePassword(password,salt);

    const existingDeliveryUser = await DeliveryUser.find({email:email})
    if(existingDeliveryUser.length>0){
       return res.status(409).json({message:"Delivery guy with this email already exist"})
    }

    const result =  await DeliveryUser.create({
        email:email,
        password:userPassword,
        salt:salt,
        phone:phone,
        firstName:firstName,
        lastName:lastName,
        pincode:pincode,
        address:address,
        verified:false,
        lat:0,
        lng:0,
        isAvailable:false
    })

    if(result){
        
        const signature = GenerateSignature({
            _id:result._id,
            email:result.email,
            verified:result.verified
        })
        return res.status(201).json({signature:signature,verified:result.verified,email:result.email})
    }
        return res.status(400).json({message:'Error in sending message'});

}
export const DeliveryUserLogin = async(req:Request,res:Response,next:NextFunction)=>{

    const loginInputs = plainToClass(UserLoginInputs,req.body);
    const loginError=await validate(loginInputs);
    if(loginError.length>0){
        return res.status(400).json(loginError);
    }
    const {email,password}=loginInputs;
    const deliveryUser = await DeliveryUser.findOne({email:email});
    if(deliveryUser){
        const validation = await PasswordValidate(password,deliveryUser.password,deliveryUser.salt);
        if(validation){
            const signature = GenerateSignature({
                _id:deliveryUser._id,
                email:deliveryUser.email,
                verified:deliveryUser.verified
            })
            return res.status(201).json({signature:signature,verified:deliveryUser.verified,email:deliveryUser.email})
        }

    }
    return res.status(404).json({message:'Login error'});
}

export const GetDeliveryUserProfile = async(req:Request,res:Response,next:NextFunction)=>{
    const deliveryUser = req.user;

    if(deliveryUser){
        const profile=await DeliveryUser.findById(deliveryUser._id);
        
           return res.status(200).json(profile)
        }
        return res.status(400).json({message:"error fetching customer profile"})
}

export const EditDeliveryUserProfile = async(req:Request,res:Response,next:NextFunction)=>{
    const deliveryUser = req.user;
    const profileInputs = plainToClass(EditCustomerProfileInput,req.body);
    const profileError = await validate(profileInputs);
    const {firstName,lastName,address}=profileInputs;
    if(profileError.length>0){
      return  res.status(400).json(profileError);
    }
    if(deliveryUser){
        const profile=await DeliveryUser.findById(deliveryUser._id);
        if(profile){
            profile.firstName=firstName;
            profile.lastName=lastName;
            profile.address=address;

            const result = await profile.save();
            res.status(200).json(result)
        }
    }
    return res.status(400).json({message:"error fetching deliveryUser profile"})

}

export const UpdateDeliveryUserStatus = async(req:Request,res:Response,next:NextFunction)=>{
    const deliveryUser=req.user;
    if(deliveryUser){
        const {lat,lng}=req.body;
        const profile = await DeliveryUser.findById(deliveryUser._id);
        if(profile){
            if(lat && lng){
                profile.lng=lng;
                profile.lat=lat;
            }
            profile.isAvailable= !profile.isAvailable;
            const result = await profile.save();
            return res.status(200).json(result)

        }
    }
    return res.status(400).json({message:'Error in Updating status'})
}



