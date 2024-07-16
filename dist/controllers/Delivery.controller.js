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
exports.UpdateDeliveryUserStatus = exports.EditDeliveryUserProfile = exports.GetDeliveryUserProfile = exports.DeliveryUserLogin = exports.DeliveryUserSignup = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const utility_2 = require("../utility");
const Delivery_model_1 = require("../models/Delivery.model");
const DeliveryUserSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUserInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateDeliveryUserInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(deliveryUserInput);
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password, address, firstName, lastName, pincode } = deliveryUserInput;
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const existingDeliveryUser = yield Delivery_model_1.DeliveryUser.find({ email: email });
    if (existingDeliveryUser.length > 0) {
        return res.status(409).json({ message: "Delivery guy with this email already exist" });
    }
    const result = yield Delivery_model_1.DeliveryUser.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        pincode: pincode,
        address: address,
        verified: false,
        lat: 0,
        lng: 0,
        isAvailable: false
    });
    if (result) {
        const signature = (0, utility_1.GenerateSignature)({
            _id: result._id,
            email: result.email,
            verified: result.verified
        });
        return res.status(201).json({ signature: signature, verified: result.verified, email: result.email });
    }
    return res.status(400).json({ message: 'Error in sending message' });
});
exports.DeliveryUserSignup = DeliveryUserSignup;
const DeliveryUserLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInputs, req.body);
    const loginError = yield (0, class_validator_1.validate)(loginInputs);
    if (loginError.length > 0) {
        return res.status(400).json(loginError);
    }
    const { email, password } = loginInputs;
    const deliveryUser = yield Delivery_model_1.DeliveryUser.findOne({ email: email });
    if (deliveryUser) {
        const validation = yield (0, utility_2.PasswordValidate)(password, deliveryUser.password, deliveryUser.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: deliveryUser._id,
                email: deliveryUser.email,
                verified: deliveryUser.verified
            });
            return res.status(201).json({ signature: signature, verified: deliveryUser.verified, email: deliveryUser.email });
        }
    }
    return res.status(404).json({ message: 'Login error' });
});
exports.DeliveryUserLogin = DeliveryUserLogin;
const GetDeliveryUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUser = req.user;
    if (deliveryUser) {
        const profile = yield Delivery_model_1.DeliveryUser.findById(deliveryUser._id);
        return res.status(200).json(profile);
    }
    return res.status(400).json({ message: "error fetching customer profile" });
});
exports.GetDeliveryUserProfile = GetDeliveryUserProfile;
const EditDeliveryUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUser = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInput, req.body);
    const profileError = yield (0, class_validator_1.validate)(profileInputs);
    const { firstName, lastName, address } = profileInputs;
    if (profileError.length > 0) {
        return res.status(400).json(profileError);
    }
    if (deliveryUser) {
        const profile = yield Delivery_model_1.DeliveryUser.findById(deliveryUser._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            res.status(200).json(result);
        }
    }
    return res.status(400).json({ message: "error fetching deliveryUser profile" });
});
exports.EditDeliveryUserProfile = EditDeliveryUserProfile;
const UpdateDeliveryUserStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUser = req.user;
    if (deliveryUser) {
        const { lat, lng } = req.body;
        const profile = yield Delivery_model_1.DeliveryUser.findById(deliveryUser._id);
        if (profile) {
            if (lat && lng) {
                profile.lng = lng;
                profile.lat = lat;
            }
            profile.isAvailable = !profile.isAvailable;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
    return res.status(400).json({ message: 'Error in Updating status' });
});
exports.UpdateDeliveryUserStatus = UpdateDeliveryUserStatus;
//# sourceMappingURL=Delivery.controller.js.map