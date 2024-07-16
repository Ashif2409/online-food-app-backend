export interface CreateVandorInput{
    name:string,
    ownerName:string,
    foodType:[string],
    pincode:string,
    address:string,
    phone:string,
    email:string,
    password:string
}

export interface EditVandorInput{
    name:string,
    phone:string,
    address:string,
    foodTypes:[string]
}

export interface VandorLoginInput{
    email:string,
    password:string
}

export interface VandorPayload{
    _id:string,
    email:string,
    name:string,
    foodTypes:[string]
}
export interface CreateOfferInputs{
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