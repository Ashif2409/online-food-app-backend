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
exports.EditOffer = exports.AddOffer = exports.GetOffer = exports.ProcessOrder = exports.GetOrderDetails = exports.GetCurrentOrders = exports.Getfood = exports.Addfood = exports.UpdateVandorService = exports.UpdateVandorCoverImage = exports.UpdateVandorProfile = exports.GetVandorProfile = exports.VandorLogin = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const Cloudanary_1 = __importDefault(require("../config/Cloudanary"));
const fs_1 = __importDefault(require("fs"));
const VandorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const vandor = yield models_1.Vandor.findOne({ email: email });
    if (vandor) {
        const verify = yield (0, utility_1.PasswordValidate)(password, vandor.password, vandor.salt);
        if (!verify) {
            return res.json({ "message": "Your password is wrong" });
        }
        const signature = (0, utility_1.GenerateSignature)({
            _id: vandor.id,
            email: vandor.email,
            foodTypes: vandor.foodType,
            name: vandor.name
        });
        return res.json(signature);
    }
    return res.json({ "message": "Vandor not found with this mail" });
});
exports.VandorLogin = VandorLogin;
const GetVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingUser = yield models_1.Vandor.findById(user._id);
        return res.json(existingUser);
    }
    return res.json({ "message": "vandor information is not available" });
});
exports.GetVandorProfile = GetVandorProfile;
const UpdateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, address, foodTypes } = req.body;
    const user = req.user;
    if (user) {
        const existingUser = yield models_1.Vandor.findById(user._id);
        if (existingUser) {
            existingUser.name = name;
            existingUser.phone = phone;
            existingUser.address = address;
            existingUser.foodType = foodTypes;
            const savedResult = yield existingUser.save();
            res.json(savedResult);
        }
        return res.json({ "msg": "User not found" });
    }
    return res.json({ "message": "vandor information is not available" });
});
exports.UpdateVandorProfile = UpdateVandorProfile;
const UpdateVandorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        try {
            const vandor = yield models_1.Vandor.findById(user._id);
            if (vandor) {
                if (!req.file) {
                    return res.status(400).json({ message: 'No file uploaded' });
                }
                const coverImagePath = req.file.path;
                const uploadResponse = yield Cloudanary_1.default.uploader.upload(coverImagePath, {
                    folder: 'images',
                    use_filename: true,
                    unique_filename: false
                });
                fs_1.default.unlinkSync(coverImagePath);
                vandor.coverImages.push(uploadResponse.secure_url);
                const result = yield vandor.save();
                return res.json(result);
            }
            else {
                return res.status(404).json({ message: 'Vandor not found' });
            }
        }
        catch (error) {
            console.error("Error updating Vandor cover image:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});
exports.UpdateVandorCoverImage = UpdateVandorCoverImage;
const UpdateVandorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { lat, lng } = req.body;
    if (user) {
        const existingUser = yield models_1.Vandor.findById(user._id);
        if (existingUser) {
            existingUser.serviceAvailabel = !existingUser.serviceAvailabel;
            if (lat && lng) {
                existingUser.lat = lat;
                existingUser.lng = lng;
            }
            const savedResult = yield existingUser.save();
            return res.json(savedResult);
        }
    }
    return res.json({ "message": "vandor information is not available" });
});
exports.UpdateVandorService = UpdateVandorService;
const Addfood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { name, description, category, foodTypes, readyTime, price } = req.body;
    if (user) {
        const existingUser = yield models_1.Vandor.findById(user._id);
        if (existingUser !== null) {
            const files = req.files;
            const images = [];
            for (const file of files) {
                try {
                    const uploadResponse = yield Cloudanary_1.default.uploader.upload(file.path, {
                        folder: 'images',
                        use_filename: true,
                        unique_filename: false,
                    });
                    fs_1.default.unlinkSync(file.path);
                    images.push(uploadResponse.secure_url);
                }
                catch (error) {
                    console.error("Error uploading image to Cloudinary:", error);
                    return res.status(500).json({ message: 'Error uploading image' });
                }
            }
            const createFood = yield models_1.Food.create({
                vandorId: existingUser._id,
                name,
                description,
                category,
                images,
                readyTime,
                foodTypes,
                price,
                rating: 0,
            });
            existingUser.food.push(createFood);
            const resultSaved = yield existingUser.save();
            return res.status(201).json(resultSaved);
        }
    }
    return res.status(404).json({ message: 'Food not addeds' });
});
exports.Addfood = Addfood;
const Getfood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find();
        if (foods) {
            return res.json(foods);
        }
        else {
            return res.json({ "message": "No food available" });
        }
    }
    return res.json({ "message": "food cannot be added" });
});
exports.Getfood = Getfood;
const GetCurrentOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const orders = yield models_1.Order.find({ vendorId: user._id }).populate('items.food');
        if (orders != null) {
            return res.status(200).json(orders);
        }
    }
    return res.json({ "message": "Order not found" });
});
exports.GetCurrentOrders = GetCurrentOrders;
const GetOrderDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (orderId) {
        const order = yield models_1.Order.findById(orderId).populate('items.food');
        if (order != null) {
            return res.status(200).json(order);
        }
    }
    return res.json({ "message": "No Order available" });
});
exports.GetOrderDetails = GetOrderDetails;
const ProcessOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const { status, remarks, time } = req.body;
    if (orderId) {
        const order = yield models_1.Order.findById(orderId).populate('items.food');
        if (order) {
            order.orderStatus = status;
            order.remark = remarks;
            if (time) {
                order.readyTime = time;
            }
            const orderResult = yield order.save();
            if (orderResult !== null) {
                return res.status(200).json(orderResult);
            }
        }
    }
    return res.json({ "message": "Unable to process order" });
});
exports.ProcessOrder = ProcessOrder;
const GetOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        let currentOffers = Array();
        const offers = yield models_1.Offer.find().populate('vendors');
        if (offers) {
            offers.map(item => {
                if (item.vendors) {
                    item.vendors.map(vendor => {
                        if (vendor._id.toString() === user._id) {
                            currentOffers.push(item);
                        }
                    });
                }
                if (item.offerType === 'GENERIC') {
                    currentOffers.push(item);
                }
            });
        }
        return res.json(currentOffers);
    }
    return res.json({ "message": "Offer unavailable" });
});
exports.GetOffer = GetOffer;
const AddOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { title, description, offerType, offerAmount, pincode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = req.body;
        const vendor = yield models_1.Vandor.findById(user._id);
        if (vendor) {
            const offer = yield models_1.Offer.create({
                title,
                description,
                offerType,
                offerAmount,
                pincode,
                promocode,
                promoType,
                startValidity,
                endValidity,
                bank,
                bins,
                minValue,
                isActive,
                vendors: [vendor],
            });
            return res.status(200).json(offer);
        }
    }
    return res.json({ "message": "Unable to add offer" });
});
exports.AddOffer = AddOffer;
const EditOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const offerId = req.params.id;
    if (user) {
        const { title, description, offerType, offerAmount, pincode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = req.body;
        const currentOffer = yield models_1.Offer.findById(offerId);
        if (currentOffer) {
            const vendor = yield models_1.Vandor.findById(user._id);
            if (vendor) {
                currentOffer.title = title;
                currentOffer.description = description;
                currentOffer.offerType = offerType;
                currentOffer.offerAmount = offerAmount;
                currentOffer.pincode = pincode;
                currentOffer.promocode = promocode;
                currentOffer.promoType = promoType;
                currentOffer.startValidity = startValidity;
                currentOffer.endValidity = endValidity;
                currentOffer.bank = bank;
                currentOffer.bins = bins;
                currentOffer.minValue = minValue;
                const result = yield currentOffer.save();
                return res.status(200).json(result);
            }
        }
    }
    return res.json({ "message": "Unable to add offer" });
});
exports.EditOffer = EditOffer;
//# sourceMappingURL=Vandor.controller.js.map