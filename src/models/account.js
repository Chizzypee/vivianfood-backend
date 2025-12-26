const { model, Schema} = require("mongoose")

const AccountSchema = new Schema({
    username:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
    },
    password:{
        type: String,
        require: true,
    },
    refreshtoken:{
        type: [],
    },
    type:{
        type: String,
        require: true,
        indexed: true,
        enum: ["admin", "customer"]
    },
    state:{
        type: String,
        require: true,
        enum: ["active", "suspended", "deactivated",],
        default: "active",
    }

}, {timestamps: true}
)

const AccountModel = model("Account", AccountSchema)
module.exports = AccountModel;