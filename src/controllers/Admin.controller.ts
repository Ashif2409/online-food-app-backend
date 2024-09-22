import {
    Request,
    Response,
    NextFunction
} from 'express'
import {
    CreateVandorInput
} from '../dto'
import {
    Vandor
} from '../models';
import {
    GeneratePassword,
    GenerateSalt
} from '../utility';
import {
    Transaction
} from '../models/Transaction';
import {
    DeliveryUser
} from '../models/Delivery.model';
import cloudinary from '../config/Cloudanary';
import fs from 'fs';

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        ownerName,
        foodType,
        pincode,
        address,
        phone,
        email,
        password
    } = < CreateVandorInput > req.body;
    try {
        const existingUser = await Vandor.findOne({
            email
        })
        if (existingUser) {
            return res.json({
                message: "User with this email is already existed"
            });
        }

        const salt = await GenerateSalt()
        const userPassword = await GeneratePassword(password, salt);

        // Check if file is present
        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded'
            });
        }

        const coverImagePath = req.file.path;
        const uploadResponse = await cloudinary.uploader.upload(coverImagePath, {
            folder: 'images',
            use_filename: true,
            unique_filename: false
        });

        // Delete the local image file after upload
        fs.unlinkSync(coverImagePath);
        const createVandor = await Vandor.create({
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
        })

        await createVandor.save();
        return res.status(201).send(createVandor);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }


}



export const GetVandors = async (req: Request, res: Response, next: NextFunction) => {
    const getVandors = await Vandor.find();
    if (getVandors) {
        return res.status(200).json(getVandors);
    }
    return res.status(404).json({
        "message": "No vandors found"
    })
}

export const GetVandorByID = async (req: Request, res: Response, next: NextFunction) => {
    const vandorID = req.params.id;
    const getVandors = await Vandor.findById(vandorID);
    if (getVandors) {
        return res.json(getVandors);
    }
    return res.json({
        "message": "No vandors found with this userid"
    });
}

export const VerifyDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {
    const {
        _id,
        status
    } = req.body;
    if (_id) {
        const profile = await DeliveryUser.findById(_id);
        if (profile) {
            profile.verified = status;
            const result = await profile.save();
            return res.status(200).json(result);
        }
    }
    res.status(400).json({
        message: "Unable to verify Delivery User"
    });
}

export const GetDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {

    const deliveryUser = await DeliveryUser.find();
    if (deliveryUser) {
        return res.status(200).json(deliveryUser);
    }

    res.status(400).json({
        message: "Unable to get Delivery User"
    });
}

export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await Transaction.find();
    if (transaction) {
        return res.json(transaction);
    }
    return res.json({
        "message": "Transaction not available"
    })
}

export const GetTransactionByID = async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = req.params.id;
    const transaction = await Transaction.findById(transactionId);
    if (transaction) {
        return res.json(transaction);
    }
    return res.json({
        "message": "No transaction found with this userid"
    });
}