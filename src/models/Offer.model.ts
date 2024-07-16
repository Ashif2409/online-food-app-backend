import mongoose,{Schema,Document} from 'mongoose'

export interface OfferDoc extends Document{
    offerType:string,
    vendors:[any],
    title:string,
    description:string,
    minValue:number,//minimum order amount should be 300
    offerAmount:number,
    startValidity:Date,
    endValidity:Date,
    promocode:string,//week40
    promoType:string, //bank//user//all/card
    bank:[any],
    bins:[any],
    pincode:string,
    isActive:boolean,
    
}

const OfferSchema = new Schema({
    offerType:{type:String,require:true},
    vendors:[{
        type:Schema.Types.ObjectId, ref:'Vandor',
    }],
    title:{type:String,require:true},
    description:{type:String},
    minValue:{type:Number , require:true},//minimum order amount should be 300
    offerAmount:{type:Number , require:true},
    startValidity:{type:Date},
    endValidity:{type:Date},
    promocode:{type:String,require:true},//week40
    promoType:{type:String,require:true}, //bank//user//all/card
    bank:[
        {
            type:String
        }
    ],
    bins:[{
        type:Number
    }],
    pincode:{type:String,require:true},
    isActive:{type:Boolean},
},{
    toJSON:{
        transform(doc,ret){
            delete ret.__v;
        }
    },
    timestamps:true
})

const Offer = mongoose.model<OfferDoc>('offer',OfferSchema);
export {Offer};