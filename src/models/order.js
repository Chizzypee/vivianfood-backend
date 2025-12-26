const { model, Schema} = require("mongoose")

const OrderSchema = new Schema({
    userId:{
        type: String,
        ref: "User",
        require: true,
    },
    items:[
        {
            id: String,
            name: String,
            imgSrc: String,
            description: String,
            desc: String,
            price: Number,
            quantity: Number,
            reference: Number,
            deliveryfee: Number,
        }
    ],
    totalAmount:{
        type: Number,
        require: true,
    },
    delivery:[
        {
        email: String,
        country: String,
        firstName: String,
        lastName: String,
        phonenumber: String,
        address: String,
        city: String,
        state: String,
        postalcode: String,
    },
    ],
    paymentMethod:{
        type: String,
        enum:["bank", "paystack"],
        default: "bank",
    },
    status:{
        type: String,
        require: true,
        indexed: true,
        enum: ["pending", "paid", "cancelled"],
    },
    reference:{
        type: String,
        unique: true,
    },
    paymentRaf:{
        type: String,
        default: null,
    }

}, {timestamps: true}
)

const OrderModel = model("Order", OrderSchema)
module.exports = OrderModel;