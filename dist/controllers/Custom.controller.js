"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePayment = exports.VerifyOffer = exports.GetOrderById = exports.GetOrders = exports.CreateOrder = exports.DeleteCart = exports.GetCart = exports.AddToCart = exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOTP = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignup = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const Customer_model_1 = require("../models/Customer.model");
// import { sign } from 'jsonwebtoken';
const utility_2 = require("../utility");
const models_1 = require("../models");
const Transaction_1 = require("../models/Transaction");
const Delivery_model_1 = require("../models/Delivery.model");
const CustomerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInput);
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = customerInput;
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, utility_1.GenerateOTP)();
    const existingUser = yield Customer_model_1.Customer.find({ email: email });
    if (existingUser.length > 0) {
        return res.status(409).json({ message: "Customer with this email already exist" });
    }
    const result = yield Customer_model_1.Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: ' ',
        lastName: ' ',
        address: ' ',
        verified: false,
        lat: 0,
        lng: 0,
        orders: []
    });
    if (result) {
        const otpSend = yield (0, utility_1.onRequestOTP)(otp, phone);
        console.log(otpSend);
        const signature = (0, utility_1.GenerateSignature)({
            _id: result._id,
            email: result.email,
            verified: result.verified
        });
        return res.status(201).json({ signature: signature, verified: result.verified, email: result.email });
    }
    return res.status(400).json({ message: 'Error in sending message' });
});
exports.CustomerSignup = CustomerSignup;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInputs, req.body);
    const loginError = yield (0, class_validator_1.validate)(loginInputs);
    if (loginError.length > 0) {
        return res.status(400).json(loginError);
    }
    const { email, password } = loginInputs;
    const customer = yield Customer_model_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, utility_2.PasswordValidate)(password, customer.password, customer.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            });
            return res.status(201).json({ signature: signature, verified: customer.verified, email: customer.email });
        }
    }
    return res.status(404).json({ message: 'Login error' });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_model_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updateCustomerResponse = yield profile.save();
                const signature = (0, utility_1.GenerateSignature)({
                    _id: updateCustomerResponse._id,
                    email: updateCustomerResponse.email,
                    verified: updateCustomerResponse.verified
                });
                return res.status(201).json({
                    signature: signature,
                    verified: updateCustomerResponse.verified,
                    email: updateCustomerResponse.email
                });
            }
        }
        res.status(400).json({ message: 'Error with otp Validation' });
    }
});
exports.CustomerVerify = CustomerVerify;
const RequestOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_model_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.GenerateOTP)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, utility_1.onRequestOTP)(otp, profile.phone);
            res.status(200).json({ message: 'OTP sent to your registered phone number' });
        }
    }
    res.status(400).json({ message: 'Error with Requesting Otp' });
});
exports.RequestOTP = RequestOTP;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_model_1.Customer.findById(customer._id);
        return res.status(200).json(profile);
    }
    return res.status(400).json({ message: "error fetching customer profile" });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInput, req.body);
    const profileError = yield (0, class_validator_1.validate)(profileInputs);
    const { firstName, lastName, address } = profileInputs;
    if (profileError.length > 0) {
        return res.status(400).json(profileError);
    }
    if (customer) {
        const profile = yield Customer_model_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            res.status(200).json(result);
        }
    }
});
exports.EditCustomerProfile = EditCustomerProfile;
const AddToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_model_1.Customer.findById(customer._id).populate('cart.food');
        let cartItems = Array();
        const { _id, unit } = req.body;
        const food = yield models_1.Food.findById(_id);
        console.log("food", food);
        if (food) {
            if (profile != null) {
                cartItems = profile.cart;
                if (cartItems.length > 0) {
                    let existingFoodItem = cartItems.filter((item) => item.food._id.toString() === _id);
                    if (existingFoodItem.length > 0) {
                        const index = cartItems.indexOf(existingFoodItem[0]);
                        if (unit > 0) {
                            cartItems[index] = { food, unit };
                        }
                        else {
                            cartItems.splice(index, 1);
                        }
                    }
                    else {
                        cartItems.push({ food, unit });
                    }
                }
                else {
                    cartItems.push({ food, unit });
                }
                if (cartItems) {
                    profile.cart = cartItems;
                    const cartresult = yield profile.save();
                    return res.status(200).json(cartresult.cart);
                }
            }
        }
    }
    else {
        return res.status(400).json({ message: 'Unable to add in cart' });
    }
});
exports.AddToCart = AddToCart;
const GetCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_model_1.Customer.findById(customer._id).populate('cart.food');
        if (profile) {
            return res.status(200).json(profile.cart);
        }
    }
    else {
        return res.status(400).json({ message: 'Cart is empty' });
    }
});
exports.GetCart = GetCart;
const DeleteCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_model_1.Customer.findById(customer._id).populate('cart.food');
        if (profile != null) {
            profile.cart = [];
            const cartResult = yield profile.save();
            return res.status(200).json(cartResult);
        }
    }
    else {
        return res.status(400).json({ message: 'Cart is empty' });
    }
});
exports.DeleteCart = DeleteCart;
// Delivery Notification
const assignOrderForDelivery = (orderId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    // find the vendor
    const vendor = yield models_1.Vandor.findById(vendorId);
    if (vendor) {
        const areaCode = vendor.pincode;
        const vendorLat = vendor.lat;
        const vendorLng = vendor.lng;
        // find the available delivery Person
        const deliveryPerson = yield Delivery_model_1.DeliveryUser.find({ pincode: areaCode, isAvailable: true, verified: true });
        if (deliveryPerson) {
            // check the nearest delivery person and assign the order
            const currentOrder = yield models_1.Order.findById(orderId);
            if (currentOrder) {
                // update the delivery Id
                currentOrder.deliveryId = deliveryPerson[0]._id;
                yield currentOrder.save();
                //Notify to vendor for recieve New order using firebase push notification
            }
        }
        // check the nearest delivery person and assign the order
    }
    // update delivery ID
});
const validateTransaction = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTransaction = yield Transaction_1.Transaction.findById(txnId);
    if (currentTransaction) {
        if (currentTransaction.status.toLowerCase() !== 'failed') {
            return { status: true, currentTransaction };
        }
    }
    return { status: false, currentTransaction: null };
});
const CreateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const { txnId, amount, items } = req.body;
    if (customer) {
        //validate transaction
        const { status, currentTransaction } = yield validateTransaction(txnId);
        if (!status) {
            return res.status(404).json({ message: 'Error with creating Order' });
        }
        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
        const profile = yield Customer_model_1.Customer.findById(customer._id);
        let cartItems = Array();
        let netAmount = 0.0;
        let vendorId;
        if (!Array.isArray(items) || items.some(item => !item || !item._id)) {
            return res.status(400).json({ message: 'Invalid items array' });
        }
        //calculate order amount
        const foods = yield models_1.Food.find().where('_id').in(items.map(item => item._id)).exec();
        // console.log(items);
        // const foods = await Food.find();
        console.log(foods);
        foods.map(food => {
            items.map(({ _id, unit }) => {
                if (food._id == _id) {
                    vendorId = food.vandorId;
                    netAmount += (food.price * unit);
                    cartItems.push({ food, unit });
                }
            });
        });
        if (!vendorId) {
            return res.status(400).json({ message: 'Vendor ID is not defined' });
        }
        //create order with food description
        if (cartItems.length > 0) {
            //create order
            const currentOrder = yield models_1.Order.create({
                orderID: orderId,
                vendorId: vendorId,
                items: cartItems,
                totalAmount: netAmount,
                paidAmount: amount,
                orderDate: new Date(),
                orderStatus: 'Waiting',
                remarks: '',
                deliveryId: '',
                readyTime: 45
            });
            if (profile) {
                profile.cart = [];
                profile.orders.push(currentOrder);
                const profileSaveResponse = yield profile.save();
                // update current transaction
                if (currentTransaction) {
                    currentTransaction.vendorId = vendorId;
                    currentTransaction.orderId = orderId;
                    currentTransaction.status = 'CONFIRMED';
                    yield currentTransaction.save();
                    assignOrderForDelivery(currentOrder._id, vendorId);
                }
                return res.status(200).json(profileSaveResponse);
            }
        }
        else {
            return res.status(400).json({ message: 'unable to create Order!' });
        }
    }
    return res.status(401).json({ message: 'Unauthorized' });
});
exports.CreateOrder = CreateOrder;
const GetOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_model_1.Customer.findById(customer._id).populate("orders");
        if (profile) {
            return res.status(200).json(profile.orders);
        }
    }
});
exports.GetOrders = GetOrders;
const GetOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (orderId) {
        const order = yield Customer_model_1.Customer.findById(orderId).populate("orders");
        res.status(200).json(order === null || order === void 0 ? void 0 : order.orders);
    }
});
exports.GetOrderById = GetOrderById;
const VerifyOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const offerId = req.params.id;
    const user = req.user;
    if (user) {
        const appliedOffer = yield models_1.Offer.findById(offerId);
        if (appliedOffer) {
            if (appliedOffer.promoType === "USER") {
            }
            else {
                if (appliedOffer.isActive) {
                    return res.status(200).json({ message: 'Offer is valid', Offer: appliedOffer });
                }
            }
        }
    }
    return res.status(400).json({ message: 'Offer is not valid' });
});
exports.VerifyOffer = VerifyOffer;
const CreatePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const { amount, paymentMode, offerId } = req.body;
    let payableAmount = Number(amount);
    if (offerId) {
        const appliedOffer = yield models_1.Offer.findById(offerId);
        if (appliedOffer) {
            if (appliedOffer.isActive) {
                payableAmount = (payableAmount - appliedOffer.offerAmount);
            }
        }
    }
    //    peform payment gateway charge API call
    // right after payment gateway success/failure response
    //    create record in Transition
    const transaction = yield Transaction_1.Transaction.create({
        customer: customer === null || customer === void 0 ? void 0 : customer._id,
        vendorId: '',
        orderId: '',
        orderValue: payableAmount,
        offerUsed: offerId || 'NA',
        status: 'OPEN',
        paymentMode: paymentMode,
        paymentResponse: 'Payment is Cash on Delivery'
    });
    return res.status(200).json(transaction);
    //    return transition ID
});
exports.CreatePayment = CreatePayment;
//# sourceMappingURL=Custom.controller.js.map