import express,{Request, Response, NextFunction} from 'express'

import { plainToClass } from 'class-transformer'
import { CreateCustomerInputs,UserLoginInputs,EditCustomerProfileInput, OrderInputs,CartItem } from '../dto/Customer.dto'
import { ValidationError,validate } from 'class-validator';
import { GenerateOTP, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOTP } from '../utility';
import { Customer } from '../models/Customer.model';
// import { sign } from 'jsonwebtoken';
import {PasswordValidate} from '../utility'
import { Food, Offer, Order, Vandor } from '../models';
import { Transaction } from '../models/Transaction';
import { DeliveryUser } from '../models/Delivery.model';

export const CustomerSignup = async(req:Request,res:Response,next:NextFunction)=>{
    const customerInput=plainToClass(CreateCustomerInputs,req.body);
    const inputErrors = await validate(customerInput);

    if(inputErrors.length >0){
       return res.status(400).json(inputErrors);
    }

    const {email,phone,password}=customerInput;
    const salt = await GenerateSalt();
    const userPassword=await GeneratePassword(password,salt);
    const {otp,expiry}=GenerateOTP();
    
    const existingUser = await Customer.find({email:email})

    if(existingUser.length > 0){
       return res.status(409).json({message:"Customer with this email already exist"})
    }

    const result =  await Customer.create({
        email:email,
        password:userPassword,
        salt:salt,
        phone:phone,
        otp:otp,
        otp_expiry:expiry,
        firstName:' ',
        lastName:' ',
        address:' ',
        verified:false,
        lat:0,
        lng:0,
        orders:[]
    })

    if(result){
        const otpSend= await onRequestOTP(otp,phone);
        console.log(otpSend);
        
        const signature = GenerateSignature({
            _id:result._id,
            email:result.email,
            verified:result.verified
        })
        return res.status(201).json({signature:signature,verified:result.verified,email:result.email})
    }
        return res.status(400).json({message:'Error in sending message'});

}
export const CustomerLogin = async(req:Request,res:Response,next:NextFunction)=>{

    const loginInputs = plainToClass(UserLoginInputs,req.body);
    const loginError=await validate(loginInputs);
    if(loginError.length>0){
        return res.status(400).json(loginError);
    }
    const {email,password}=loginInputs;
    const customer = await Customer.findOne({email:email});
    if(customer){
        const validation = await PasswordValidate(password,customer.password,customer.salt);
        if(validation){
            const signature = GenerateSignature({
                _id:customer._id,
                email:customer.email,
                verified:customer.verified
            })
            return res.status(201).json({signature:signature,verified:customer.verified,email:customer.email})
        }

    }
    return res.status(404).json({message:'Login error'});
}
export const CustomerVerify = async(req:Request,res:Response,next:NextFunction)=>{

    const {otp}=req.body;
    const customer = req.user;
    if (customer){
        const profile = await Customer.findById(customer._id);
        if(profile){
            if(profile.otp===parseInt(otp) && profile.otp_expiry>= new Date()){
                profile.verified=true;
                const updateCustomerResponse =await profile.save();

                const signature = GenerateSignature({
                    _id: updateCustomerResponse._id,
                    email: updateCustomerResponse.email,
                    verified: updateCustomerResponse.verified
                })
                return res.status(201).json({
                    signature:signature,
                    verified:updateCustomerResponse.verified,
                    email:updateCustomerResponse.email
                })
            }
        }
        res.status(400).json({message:'Error with otp Validation'})
    }
}
export const RequestOTP = async(req:Request,res:Response,next:NextFunction)=>{
    const customer = req.user;
    if(customer){
        const profile = await Customer.findById(customer._id);
        if(profile){
            const {otp,expiry}=GenerateOTP();

            profile.otp=otp;
            profile.otp_expiry=expiry;
            await profile.save();
            await onRequestOTP(otp,profile.phone);
            res.status(200).json({message:'OTP sent to your registered phone number'})
        }
    }
    res.status(400).json({message:'Error with Requesting Otp'})
}
export const GetCustomerProfile = async(req:Request,res:Response,next:NextFunction)=>{
    const customer = req.user;

    if(customer){
        const profile=await Customer.findById(customer._id);
        
           return res.status(200).json(profile)
        }
        return res.status(400).json({message:"error fetching customer profile"})
}

export const EditCustomerProfile = async(req:Request,res:Response,next:NextFunction)=>{
    const customer = req.user;
    const profileInputs = plainToClass(EditCustomerProfileInput,req.body);
    const profileError = await validate(profileInputs);
    const {firstName,lastName,address}=profileInputs;
    if(profileError.length>0){
      return  res.status(400).json(profileError);
    }
    if(customer){
        const profile=await Customer.findById(customer._id);
        if(profile){
            profile.firstName=firstName;
            profile.lastName=lastName;
            profile.address=address;

            const result = await profile.save();
            res.status(200).json(result)
        }
    }
}


export const AddToCart=async(req:Request,res:Response,next:NextFunction)=>{
    const customer= req.user;
    if(customer){
        const profile = await Customer.findById(customer._id).populate('cart.food');
        let cartItems = Array();
        const {_id,unit}=<CartItem>req.body;
        const food = await Food.findById(_id);
        console.log("food",food);
        if (food) {
            if (profile != null) { 
                cartItems = profile.cart;
                if(cartItems.length >0){
                    let existingFoodItem = cartItems.filter((item)=>item.food._id.toString()===_id);
                    if(existingFoodItem.length >0){
                        const index=cartItems.indexOf(existingFoodItem[0]);
                        if(unit>0){
                            cartItems[index]={food,unit};
                        }else{
                            cartItems.splice(index,1);
                        }
                    }else{
                        cartItems.push({food,unit});
                    }
                }else{
                    cartItems.push({food,unit});
                }
                if(cartItems){
                    profile.cart = cartItems as any;
                    const cartresult = await profile.save();
                    return res.status(200).json(cartresult.cart)
                }
            }
        }
    }else{
        return res.status(400).json({message:'Unable to add in cart'});
    }
}
export const GetCart=async(req:Request,res:Response,next:NextFunction)=>{
    const customer = req.user;
    if(customer){
        const profile = await Customer.findById(customer._id).populate('cart.food');
        if(profile){
            return res.status(200).json(profile.cart);
        }
    }else{
        return res.status(400).json({message:'Cart is empty'});
    }
}
export const DeleteCart=async(req:Request,res:Response,next:NextFunction)=>{
    const customer = req.user;
    if(customer){
        const profile = await Customer.findById(customer._id).populate('cart.food');
        if(profile !=null){
            profile.cart=[] as any;
            const cartResult = await profile.save();
            return res.status(200).json(cartResult);
        }
    }else{
        return res.status(400).json({message:'Cart is empty'});
    }
    
}

// Delivery Notification
const assignOrderForDelivery=async(orderId:string, vendorId:string)=>{
    // find the vendor
    const vendor = await Vandor.findById(vendorId);
    if(vendor){
        const areaCode = vendor.pincode;
        const vendorLat = vendor.lat;
        const vendorLng = vendor.lng;
        // find the available delivery Person
        const deliveryPerson = await DeliveryUser.find({pincode:areaCode,isAvailable:true,verified:true});
        if(deliveryPerson){
            // check the nearest delivery person and assign the order

            const currentOrder = await Order.findById(orderId);
            if(currentOrder){
                // update the delivery Id
                currentOrder.deliveryId=deliveryPerson[0]._id;
                await currentOrder.save()

                //Notify to vendor for recieve New order using firebase push notification
            }
        }
        // check the nearest delivery person and assign the order
    }

    // update delivery ID
}

const validateTransaction = async(txnId:string)=>{
    const currentTransaction= await Transaction.findById(txnId);
    if(currentTransaction){
        if(currentTransaction.status.toLowerCase()!=='failed'){
            return {status:true,currentTransaction}
        }
    }
    return {status:false,currentTransaction:null};
}



export const CreateOrder = async (req:Request,res:Response,next:NextFunction)=>{
    const customer = req.user;
    const {txnId,amount,items}=<OrderInputs>req.body;
    if(customer){
        //validate transaction
        const {status,currentTransaction}=await validateTransaction(txnId);
        if(!status){
            return res.status(404).json({message:'Error with creating Order'})
        }

        const orderId=`${Math.floor(Math.random()*89999)+1000}`;
        const profile = await Customer.findById(customer._id);
        let cartItems=Array();
        let netAmount=0.0;
        let vendorId;

        if (!Array.isArray(items) || items.some(item => !item || !item._id)) {
            return res.status(400).json({ message: 'Invalid items array' });
        }
        //calculate order amount
        const foods = await Food.find().where('_id').in(items.map(item=>item._id)).exec();
        // console.log(items);
        // const foods = await Food.find();
        console.log(foods);
        foods.map(food=>{
            items.map(({_id,unit})=>{
                if(food._id == _id){
                    vendorId=food.vandorId;
                    netAmount += (food.price * unit);
                    cartItems.push({food,unit});
                }
            })
        })

        if (!vendorId) {
            return res.status(400).json({ message: 'Vendor ID is not defined' });
        }
        //create order with food description
        if(cartItems.length>0){
            //create order
            const currentOrder =  await Order.create({
                orderID: orderId,
                vendorId:vendorId,
                items:cartItems,
                totalAmount:netAmount,
                paidAmount:amount,
                orderDate:new Date(),
                orderStatus:'Waiting',
                remarks:'',
                deliveryId:'',
                readyTime:45
            })
            if(profile){
                profile.cart = [] as any
                profile.orders.push(currentOrder);
                const profileSaveResponse=await profile.save();
                // update current transaction
                if(currentTransaction){
                    currentTransaction.vendorId=vendorId ;
                    currentTransaction.orderId=orderId;
                    currentTransaction.status='CONFIRMED';
                    await currentTransaction.save();
                    assignOrderForDelivery(currentOrder._id as string,vendorId);
                    
                }
                return res.status(200).json(profileSaveResponse)
            }
        }else{
            return res.status(400).json({message:'unable to create Order!'})
        }
    }
    return res.status(401).json({ message: 'Unauthorized' });
}
export const GetOrders = async (req:Request,res:Response,next:NextFunction)=>{
    const customer = req.user;
    if(customer){
        const profile = await Customer.findById(customer._id).populate("orders");
        if(profile){
            return res.status(200).json(profile.orders);
        }
    }
}
export const GetOrderById = async (req:Request,res:Response,next:NextFunction)=>{
    const orderId=req.params.id;
    if(orderId){
        const order = await Customer.findById(orderId).populate("orders");
        res.status(200).json(order?.orders);
    }
}

export const VerifyOffer = async (req:Request,res:Response,next:NextFunction)=>{
    const offerId=req.params.id;
    const user = req.user;
    if(user){
        const appliedOffer = await Offer.findById(offerId);
        if(appliedOffer){
            if(appliedOffer.promoType==="USER"){

            }else{
                if(appliedOffer.isActive){
                    return res.status(200).json({message:'Offer is valid',Offer:appliedOffer});
                }    
            }
        }
    }
    return res.status(400).json({message:'Offer is not valid'});
}
export const CreatePayment = async (req:Request,res:Response,next:NextFunction)=>{
   const customer = req.user;
   const {amount,paymentMode,offerId}=req.body;
   let payableAmount= Number(amount);
   if(offerId){
    const appliedOffer= await Offer.findById(offerId);
    if(appliedOffer){
        if(appliedOffer.isActive){
            payableAmount=(payableAmount - appliedOffer.offerAmount);
            }
        }
   }
//    peform payment gateway charge API call
// right after payment gateway success/failure response
//    create record in Transition
const transaction = await Transaction.create({
    customer:customer?._id,
    vendorId:'',
    orderId:'',
    orderValue:payableAmount,
    offerUsed:offerId || 'NA',
    status:'OPEN',
    paymentMode: paymentMode,
    paymentResponse:'Payment is Cash on Delivery'
})
return res.status(200).json(transaction);
//    return transition ID
}


