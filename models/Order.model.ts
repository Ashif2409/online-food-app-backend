import mongoose, { Schema, Document } from 'mongoose';

export interface OrderDoc extends Document {
    orderID: string;
    vendorId: string;
    items: { food: mongoose.Types.ObjectId; unit: number }[];
    totalAmount: number;
    paidAmount: number;
    orderDate: Date;
    orderStatus: string; // waiting, failed, accept, under-process, ready
    remark: string;
    deliveryId: string;
    readyTime: number;
}

const OrderSchema = new Schema({
    orderID: { type: String, required: true },
    vendorId: { type: String, required: true },
    items: [{
        food: { type: Schema.Types.ObjectId, ref: 'food', required: true },
        unit: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date },
    paidAmount: { type: Number, required: true },
    orderStatus: { type: String },
    remark: { type: String },
    deliveryId: { type: String },
    readyTime: { type: Number }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

const Order = mongoose.model<OrderDoc>('order', OrderSchema);
export { Order };
