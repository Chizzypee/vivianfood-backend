const AccountModel = require("../models/account");
const jwt = require("jsonwebtoken");
const { hashSync, compareSync } = require("bcryptjs");
const { isEmailValid } = require("../utils/validaor");
const { config } = require("../config");
const { APIError } = require("../middlwares/error.Api");
const ProfileModel = require("../models/profile");
const { default: mongoose } = require("mongoose");
const AddressModel = require("../models/address");
const OrderModel = require("../models/order");


exports.register = async(req, res, next) =>{      
    try {
        const {username, email, password} = req.body

        if(!username) return next(APIError.badRequest("invalid username"))
        if(!email) return next(APIError.badRequest("invalid email"))
        if(!password) return next(APIError.badRequest("invalid password"))

        if(isEmailValid(email)) return next(APIError.badRequest("nvalid email"))

        const emailExist = await AccountModel.findOne({email}).exec();
        if(emailExist) return next(APIError.badRequest("Email already exist"))

        const hashedPassword = hashSync(password,10)

        const user = {
            username,
            email,
            password:hashedPassword,
            type: "customer"
        };

        const newUser = await AccountModel.create({...user});
        if(!newUser) return next(APIError.badRequest("no user Found"))
        res.status(201).json({sucess:true, msg: "User account created successfully"})
    } catch (error) {
        console.log(error);
    }
}

exports.login = async(req, res, next) =>{
    try {
        let token = req.headers?.authorization?.split("")[1];  //set cookie upon login
        if(!token) token = req.cookie?.bflux;
        if(!token) token = req.headers?.cookie?.split("=")[1];
        
        const{email, password} = req.body
        if(!email)  return next(APIError.notFound("email is required")) 
        if(!password)  return next(APIError.notFound("password is required"))  
        
        const userExist = await AccountModel.findOne({email})
        if(!userExist) return next(APIError.notFound("user not found"))  

        const checkUser = compareSync(password,userExist.password)
        if(!checkUser) return next(APIError.notFound("incorrect password")) 

        if(userExist.refreshtoken.length > 0) return next(APIError.notFound("You're already logged in")) 
        if(userExist.state === "deactivated") return next(APIError.unauthorized("Account has been deactivated"))

        // AUTHENTICATIOON
        const payload = {
            userId: userExist._id.toString(),
            email: userExist.email,
            role: userExist.type,
        };
        const accessToken = jwt.sign(payload, config.ACCESS_TOKEN_SECRET,{expiresIn: "15m"})
        const refreshtoken = jwt.sign(payload ,config.REFRESH_TOKEN_SECRET,{expiresIn: "30m"})
        userExist.refreshtoken = [...userExist.refreshtoken.slice(-2), refreshtoken];
        userExist.save();

        res.cookie(
            "vfood", accessToken,{
                httpOnly: false,
                secure: true,
                sameSite: "none",
                maxAge: 60*60 * 100
            }
        )
 return res.status(200).json({
        success:true,
        msg:"login successfully",
        user:{
            userId: userExist._id.toString(),
            email:userExist.email,
            username: userExist.username,
        },
        accessToken,
        refreshtoken
        
    })
    
    } catch (error) {
        console.log(error); 
    }
}

exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return next(APIError.badRequest("Missing userId"));
        }

        const updates = req.body;   // contains fields user wants to update

        // Find existing profile
        let userProfile = await ProfileModel.findOne({ userId });

        // If no profile exists, create new one
        if (!userProfile) {
            const newProfile = await ProfileModel.create({
                userId,
                firstname: updates.firstname || "",
                middlename: updates.middlename || "",
                surename: updates.surename || "",
                email: updates.email || "",
                gender: updates.gender || "",
                birthdate: updates.birthdate || "",
                phone: updates.phone || "",
                type: "customer"
            });

            return res.status(201).json({
                success: true,
                msg: "Profile created",
                data: newProfile
            });
        }

        // Merge only provided fields — DO NOT overwrite missing ones
        Object.keys(updates).forEach(key => {
            if (updates[key] !== "" && updates[key] !== null && updates[key] !== undefined) {
                userProfile[key] = updates[key];
            }
        });

        const updatedProfile = await userProfile.save();

        return res.status(200).json({
            success: true,
            msg: "Profile updated",
            data: updatedProfile
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message || error
        });
    }
};
exports.updateAddress = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return next(APIError.badRequest("Missing userId"));
        }

        const updates = req.body;   // contains fields user wants to update

        // Find existing profile
        let userAddress = await AddressModel.findOne({ userId });

        // If no profile exists, create new one
        if (!userAddress) {
            const newProfile = await AddressModel.create({
                userId,
                addFirstname: updates.addFirstname || "",
                lastname: updates.lastname || "",
                phone: updates.phone || "",
                addPhone: updates.addPhone || "",
                deliveyAddress: updates.deliveyAddress || "",
                additionalInformation: updates.additionalInformation || "",
                country: updates.country || "",
                city: updates.city || "",
                type: "customer"
            });

            return res.status(201).json({
                success: true,
                msg: "Address created",
                data: newProfile
            });
        }

        // Merge only provided fields — DO NOT overwrite missing ones
        Object.keys(updates).forEach(key => {
            if (updates[key] !== "" && updates[key] !== null && updates[key] !== undefined) {
                userAddress[key] = updates[key];
            }
        });

        const updatedProfile = await userAddress.save();

        return res.status(200).json({
            success: true,
            msg: "Address updated",
            data: updatedProfile
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message || error
        });
    }
};
exports.getProfile = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!userId || userId === "null" || userId === "undefined") {
            return next(APIError.badRequest("Invalid userId"));
        }
        const userProfile = await ProfileModel.findOne({ userId });
        if (!userProfile) {
            return next(APIError.notFound("User profile not found"));
        }
        return res.status(200).json({
            success: true,
            msg: "User profile retrieved successfully",
            data: userProfile
        });

    } catch (error) {
        next(error);
    }
}; 
exports.getAddress = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        if (!userId || userId === "null" || userId === "undefined") {
            return next(APIError.badRequest("Invalid userId"));
        }
        const userAddress = await AddressModel.findOne({ userId });
        if (!userAddress) {
            return next(APIError.notFound("User address not found"));
        }
        return res.status(200).json({
            success: true,
            msg: "User Address retrieved successfully",
            data: userAddress
        });
    } catch (error) {
        next(error);
    }
}; 

function generateReference(){
    return Date.now() + "-"  + Math.floor(Math.random() * 1000)
}
exports.createOrder = async(req, res) =>{
    try {
        const {userId, items, totalAmount, delivery, paymentMethod, reference} = req.body;
        if(!userId || !items?.length || !totalAmount || reference){
            return res.status(400).json({msg: "invalid order data"})
        }
        const order = await OrderModel.create({
            userId,
            items,
            totalAmount,
            delivery,
            paymentMethod,
            status: "pending",
            reference: generateReference(),
        });
        return res.status(201).json({
            success: true,
            msg: "Order Created",
            data: order,
        });
    } catch (error) {
        res.status(500).json({msg: " server error"})
    }
} 


exports.getOrder = async(req, res) =>{
    try {
        const {userId} = req.params;
        if(!userId){
            return res.status(400).json({error: "userId is required"})
        }
        const orders = await OrderModel.find({userId}).sort({createdAt: -1});
        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: " server error"})
    }
}