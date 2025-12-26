const { model, Schema} = require("mongoose")

const ProfileSchema = new Schema({
    userId:{
        type: String,
        ref: "User",
        require: true,
    },
    firstname:{
        type: String,
        require: true,
    },
    addFirstname:{
        type: String,
        require: true,
    },
    middlename:{
        type: String,
        require: true,
    },
    lastname:{
        type: String,
        require: true,
    },
    surename:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
    },
    gender:{
        type: String,
        require: true,
    },
     male:{
        type: String,
        require: true,
    },
    female:{
        type: String,
        require: true,
    },
    birthdate:{
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
    password:{
        type: String,
        require: true,
    },
    pin:{
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

const ProfileModel = model("Profile", ProfileSchema)
module.exports = ProfileModel;