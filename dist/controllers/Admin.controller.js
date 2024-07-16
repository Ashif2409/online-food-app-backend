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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDeliveryUser = exports.VerifyDeliveryUser = exports.GetTransactionByID = exports.GetTransactions = exports.GetVandorByID = exports.GetVandors = exports.CreateVandor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const Transaction_1 = require("../models/Transaction");
const Delivery_model_1 = require("../models/Delivery.model");
const Cloudanary_1 = __importDefault(require("../config/Cloudanary"));
const fs_1 = __importDefault(require("fs"));
const CreateVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, foodType, pincode, address, phone, email, password } = req.body;
    const existingUser = yield models_1.Vandor.findOne({ email });
    if (existingUser) {
        return res.json({ message: "User with this email is already existed" });
    }
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    // Check if file is present
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const coverImagePath = req.file.path;
    const uploadResponse = yield Cloudanary_1.default.uploader.upload(coverImagePath, {
        folder: 'images',
        use_filename: true,
        unique_filename: false
    });
    // Delete the local image file after upload
    fs_1.default.unlinkSync(coverImagePath);
    const createVandor = yield models_1.Vandor.create({
        name: name,
        ownerName: ownerName,
        foodType: foodType,
        pincode: pincode,
        address: address,
        phone: phone,
        email: email,
        password: userPassword,
        salt: salt,
        serviceAvailabel: false,
        coverImages: [uploadResponse.secure_url],
        rating: 0,
        food: [],
        lat: 0,
        lng: 0
    });
    createVandor.save().then(() => res.json(createVandor)).catch(err => res.json({ msg: err }));
});
exports.CreateVandor = CreateVandor;
const GetVandors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const getVandors = yield models_1.Vandor.find();
    if (getVandors) {
        return res.json(getVandors);
    }
    return res.json({ "message": "No vandors found" });
});
exports.GetVandors = GetVandors;
const GetVandorByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandorID = req.params.id;
    const getVandors = yield models_1.Vandor.findById(vandorID);
    if (getVandors) {
        return res.json(getVandors);
    }
    return res.json({ "message": "No vandors found with this userid" });
});
exports.GetVandorByID = GetVandorByID;
const GetTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield Transaction_1.Transaction.find();
    if (transaction) {
        return res.json(transaction);
    }
    return res.json({ "message": "Transaction not available" });
});
exports.GetTransactions = GetTransactions;
const GetTransactionByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.params.id;
    const transaction = yield Transaction_1.Transaction.findById(transactionId);
    if (transaction) {
        return res.json(transaction);
    }
    return res.json({ "message": "No transaction found with this userid" });
});
exports.GetTransactionByID = GetTransactionByID;
const VerifyDeliveryUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, status } = req.body;
    if (_id) {
        const profile = yield Delivery_model_1.DeliveryUser.findById(_id);
        if (profile) {
            profile.verified = status;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
    res.status(400).json({ message: "Unable to verify Delivery User" });
});
exports.VerifyDeliveryUser = VerifyDeliveryUser;
const GetDeliveryUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUser = yield Delivery_model_1.DeliveryUser.find();
    if (deliveryUser) {
        return res.status(200).json(deliveryUser);
    }
    res.status(400).json({ message: "Unable to get Delivery User" });
});
exports.GetDeliveryUser = GetDeliveryUser;
//# sourceMappingURL=Admin.controller.js.map