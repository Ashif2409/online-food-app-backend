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
exports.GetAvailabeOffer = exports.RestaurantById = exports.SearchFoods = exports.GetFoodIn30Min = exports.GetTopRestaurants = exports.GetFoodAvailability = void 0;
const models_1 = require("../models");
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({ pincode: pincode, serviceAvailabel: true })
        .sort([['rating', 'descending']])
        .populate("food");
    if (result) {
        return res.status(200).json({ result });
    }
    res.status(400).json({ "message": "Data not found" });
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({ pincode: pincode, serviceAvailabel: true })
        .sort([['rating', 'descending']])
        .limit(10);
    if (result) {
        return res.status(200).json({ result });
    }
    res.status(400).json({ "message": "Data not found" });
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetFoodIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({ pincode: pincode, serviceAvailabel: false })
        .populate("food");
    if (result) {
        let foodResult = [];
        result.map(vandor => {
            const foods = vandor.food;
            foodResult.push(Object.assign({}, foods.filter(food => food.readyTime <= 30)));
        });
        return res.status(200).json({ foodResult });
    }
    res.status(400).json({ "message": "Data not found" });
});
exports.GetFoodIn30Min = GetFoodIn30Min;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({ pincode: pincode });
    if (result) {
        const foodResults = [];
        result.map(item => foodResults.push(...item.food));
        return res.status(200).json({ foodResults });
    }
    return res.status(400).json({ "message": "Data not found" });
});
exports.SearchFoods = SearchFoods;
const RestaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vandor.find({ pincode: pincode }).populate('food');
    if (result) {
        return res.status(200).json({ result });
    }
    return res.status(400).json({ "message": "Data not found" });
});
exports.RestaurantById = RestaurantById;
const GetAvailabeOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const offers = yield models_1.Offer.find({ pincode: pincode, isActive: true });
    if (offers) {
        return res.status(200).json(offers);
    }
    return res.status(400).json({ "message": "Offer not found" });
});
exports.GetAvailabeOffer = GetAvailabeOffer;
//# sourceMappingURL=Shoping.controller.js.map