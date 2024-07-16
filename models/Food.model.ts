import mongoose, { Schema, Document } from 'mongoose';

export interface FoodDoc extends Document {
    vandorId: string;
    name: string;
    description: string;
    category?: string;
    foodTypes: string;
    readyTime: number;
    price: number;
    rating: number;
    images: string[];
}

const FoodSchema = new Schema<FoodDoc>({
    vandorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    foodTypes: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number },
    images: { type: [String] }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }
});

const Food = mongoose.model<FoodDoc>('food', FoodSchema);

export { Food };
