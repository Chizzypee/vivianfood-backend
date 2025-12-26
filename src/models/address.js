const { model, Schema} = require("mongoose")

const AddressSchema = new Schema({
    userId:{
        type: String,
        ref: "User",
        require: true,
    },
    addFirstname:{
        type: String,
        require: true,
    },
    lastname:{
        type: String,
        require: true,
    },
    phone:{
        type: String,
        require: true,
    },
    addPhone:{
        type: String,
        require: true,
    }, 
    city:{
        type: String,
        require: true,
    },
    deliveyAddress:{
        type: String,
        require: true,
    },
    additionalInformation:{
        type: String,
        require: true,
    },
    country:{
        type: String,
        require: true,
    },
    type:{
        type: String,
        require: true,
        indexed: true,
        enum: ["admin", "customer"]
    }

}, {timestamps: true}
)

const AddressModel = model("Address", AddressSchema)
module.exports = AddressModel;