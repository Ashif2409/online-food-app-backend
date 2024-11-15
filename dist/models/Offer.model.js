"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OfferSchema = new mongoose_1.Schema({
    offerType: { type: String, require: true },
    vendors: [{
            type: mongoose_1.Schema.Types.ObjectId, ref: 'Vandor',
        }],
    title: { type: String, require: true },
    description: { type: String },
    minValue: { type: Number, require: true }, //minimum order amount should be 300
    offerAmount: { type: Number, require: true },
    startValidity: { type: Date },
    endValidity: { type: Date },
    promocode: { type: String, require: true }, //week40
    promoType: { type: String, require: true }, //bank//user//all/card
    bank: [
        {
            type: String
        }
    ],
    bins: [{
            type: Number
        }],
    pincode: { type: String, require: true },
    isActive: { type: Boolean },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        }
    },
    timestamps: true
});
const Offer = mongoose_1.default.model('offer', OfferSchema);
exports.Offer = Offer;
//# sourceMappingURL=Offer.model.js.map