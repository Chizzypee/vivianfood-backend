const AccountModel = require("../models/account");
const { hashSync, compareSync } = require("bcryptjs");
// const { congig } = required("../config")


exports.register = async(req, res) =>{      
    try {
        const {username, email, password} = req.body

        if(!username) return res.status(400).json({msg: 'invalid username'})
        if(!email) return res.status(400).json({msg: 'invalid email'})
        if(!password) return res.status(400).json({msg: 'invalid password'});

        const emailExist = await AccountModel.findOne({email}).exec();
        if(emailExist) return res.status(400).json({mag: "Email already exist"})

        const hashedPassword = hashSync(password,10)

        const user = {
            username,
            email,
            password:hashedPassword,
            type: "user"
        };

        const newUser = await AccountModel.create({...user});
        if(!newUser) return res.status(401).json({msg: "No user found"});
        res.status(201).json({sucess:true, msg: "User account created successfully"})
    } catch (error) {
        console.log(error);
    }
}

exports.login = async(req, res) =>{
    try {
        let token = req.headers?.authorization?.split("")[1];  //set cookie upon login
        if(!token) token = req.cookie?.bflux;
        if(!token) token = req.headers?.cookie?.split("=")[1];
        
        const{email, password} = req.body
        if(!email)  return res.status(400).json({msg: 'invalid email'}) 
        if(!password)  return res.status(400).json({msg: 'invalid password'}); 
        
        const userExist = await AccountModel.findOne({email})
        if(!userExist) return res.status(400).json({msg: 'user not found'}); 

        const checkUser = compareSync(password,userExist.password)
        if(!checkUser) return res.status(400).json({msg: 'incorrect password'});
    
 return res.status(200).json({
        success:true,
        msg:"login successfully",
        user:{
            email:userExist.email,
        },
        
    })
    
    } catch (error) {
        console.log(error); 
    }
}
