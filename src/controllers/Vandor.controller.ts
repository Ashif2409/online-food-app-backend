import {
    Request,
    Response,
    NextFunction
} from 'express'
import {
    CreateFoodInput,
    CreateOfferInputs,
    EditVandorInput,
    VandorLoginInput
} from '../dto'
import {
    Food,
    Offer,
    Order,
    Vandor
} from '../models';
import {
    GenerateSignature,
    PasswordValidate
} from '../utility'
import cloudinary from '../config/Cloudanary';
import fs from 'fs'
export const VandorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const {
        email,
        password
    } = < VandorLoginInput > req.body;
    const vandor = await Vandor.findOne({
        email: email
    });
    if (vandor) {
        const verify = await PasswordValidate(password, vandor.password, vandor.salt);
        if (!verify) {
            return res.json({
                "message": "Your password is wrong"
            })
        }
        const signature = GenerateSignature({
            _id: vandor.id,
            email: vandor.email,
            foodTypes: vandor.foodType,
            name: vandor.name
        })
        return res.json(signature);
    }
    return res.json({
        "message": "Vandor not found with this mail"
    })
}

export const GetVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const existingUser = await Vandor.findById(user._id);
        return res.json(existingUser);
    }
    return res.json({
        "message": "vandor information is not available"
    })
}

export const UpdateVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        phone,
        address,
        foodTypes
    } = < EditVandorInput > req.body;
    const user = req.user;
    if (user) {
        const existingUser = await Vandor.findById(user._id);
        if (existingUser) {
            existingUser.name = name;
            existingUser.phone = phone;
            existingUser.address = address;
            existingUser.foodType = foodTypes;
            const savedResult = await existingUser.save();
            return res.status(200).json(savedResult);
        }
        return res.status(404).json({
            "msg": "User not found"
        });
    }
    return res.status(404).json({
        "message": "vandor information is not available"
    })
}

export const UpdateVandorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        try {
            const vandor = await Vandor.findById(user._id);

            if (vandor) {
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

                fs.unlinkSync(coverImagePath);

                vandor.coverImages.push(uploadResponse.secure_url);

                const result = await vandor.save();
                return res.json(result);
            } else {
                return res.status(404).json({
                    message: 'Vandor not found'
                });
            }
        } catch (error) {
            console.error("Error updating Vandor cover image:", error);
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
    } else {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};


export const UpdateVandorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const {
        lat,
        lng
    } = req.body;
    if (user) {
        const existingUser = await Vandor.findById(user._id);
        if (existingUser) {
            existingUser.serviceAvailabel = !existingUser.serviceAvailabel;
            if (lat && lng) {
                existingUser.lat = lat;
                existingUser.lng = lng;
            }
            const savedResult = await existingUser.save();
            return res.json(savedResult);
        }
    }
    return res.json({
        "message": "vandor information is not available"
    })
}

export const Addfood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const {
        name,
        description,
        category,
        foodTypes,
        readyTime,
        price
    } = < CreateFoodInput > req.body;

    if (user) {
        const existingUser = await Vandor.findById(user._id);

        if (existingUser !== null) {
            const files = req.files as[Express.Multer.File];
            const images = [];

            for (const file of files) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(file.path, {
                        folder: 'images',
                        use_filename: true,
                        unique_filename: false,
                    });

                    fs.unlinkSync(file.path);
                    images.push(uploadResponse.secure_url);
                } catch (error) {
                    console.error("Error uploading image to Cloudinary:", error);
                    return res.status(500).json({
                        message: 'Error uploading image'
                    });
                }
            }

            const createFood = await Food.create({
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
            const resultSaved = await existingUser.save();
            return res.status(201).json(resultSaved);
        }
    }
    return res.status(404).json({
        message: 'Food not addeds'
    });
};

export const Getfood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const foods = await Food.find();
        if (foods) {
            return res.json(foods);
        } else {
            return res.json({
                "message": "No food available"
            });
        }

    }
    return res.json({
        "message": "food cannot be added"
    })
}

export const GetOffer = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        let currentOffers = Array();
        const offers = await Offer.find().populate('vendors');
        if (offers) {
            offers.map(item => {
                if (item.vendors) {
                    item.vendors.map(vendor => {
                        if (vendor._id.toString() === user._id) {
                            currentOffers.push(item);
                        }
                    })
                }
                if (item.offerType === 'GENERIC') {
                    currentOffers.push(item);
                }
            })
        }
        return res.json(currentOffers);
    }
    return res.json({
        "message": "Offer unavailable"
    });
}
export const AddOffer = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const {
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
            isActive
        } = < CreateOfferInputs > req.body;
        const vendor = await Vandor.findById(user._id);
        if (vendor) {
            const offer = await Offer.create({
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
            })
            return res.status(200).json(offer);
        }
    }
    return res.json({
        "message": "Unable to add offer"
    })
}

export const EditOffer = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const offerId = req.params.id;
    try {
        if (user) {
            const {
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
                isActive
            } = < CreateOfferInputs > req.body;

            const currentOffer = await Offer.findById(offerId);
            if (currentOffer) {
                const vendor = await Vandor.findById(user._id);
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
                    currentOffer.isActive = isActive;
                    const result = await currentOffer.save();
                    return res.status(200).json(result);
                }
            }
            return res.status(404).json({
                "message": "Unable to find offer"
            });
        }
    } catch (error) {
        console.log(error)
        return res.json({
            "message": "Unable to add offer"
        });
    }

};


export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const orders = await Order.find({
            vendorId: user._id
        }).populate('items.food');
        if (orders != null) {
            return res.status(200).json(orders);
        }
    }
    return res.json({
        "message": "Order not found"
    })
}

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id
    if (orderId) {
        const order = await Order.findById(orderId).populate('items.food');
        if (order != null) {
            return res.status(200).json(order);
        }
    }
    return res.json({
        "message": "No Order available"
    })
}

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    const {
        status,
        remarks,
        time
    } = req.body;
    if (orderId) {
        const order = await Order.findById(orderId).populate('items.food');
        if (order) {
            order.orderStatus = status;
            order.remark = remarks;
            if (time) {
                order.readyTime = time;
            }
            const orderResult = await order.save();
            if (orderResult !== null) {
                return res.status(200).json(orderResult);
            }
        }
    }
    return res.json({
        "message": "Unable to process order"
    });
}