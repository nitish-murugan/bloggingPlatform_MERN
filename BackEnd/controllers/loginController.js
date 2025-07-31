const userObj = require('../model/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginFn = async (request, response)=>{
    try{
        const {email, password} = request.body;
        const isUser = await userObj.findOne({email: email});
        if(!isUser){
            return response.status(404).json({
                success: false,
                message: "User not found with the email"
            });
        }

        const isPassword = await bcryptjs.compare(password,isUser.password);
        if(!isPassword){
            return response.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }
        
        const accessToken = jwt.sign({
            username: isUser.username,
            email: isUser.email,
            firstName: isUser.firstName,
            lastName: isUser.lastName
        }, process.env.JWT_PRIVATE_KEY,{
            "expiresIn": "10m"
        });

        return response.status(200).json({
            success: true,
            message: "User logged in successfully",
            token: accessToken,
            user: {
                username: isUser.username,
                email: isUser.email,
                firstName: isUser.firstName,
                lastName: isUser.lastName
            }
        });

    } catch(e){
        console.log(`Error occured while login ${e}`);
        return response.status(500).json({
            success: false,
            message: "Error in login",
        });
    }
}

const registerFn = async (request, response)=>{
    try{
        const {username, firstName, lastName, email, password} = request.body;
        const isUser = await userObj.findOne({email: email});
        if(isUser){
            return response.status(409).json({
                success: false,
                message: "User already exists"
            });
        }
        
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const addedUser = await userObj.create({
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        });
        
        // Generate token for the new user
        const accessToken = jwt.sign({
            username: addedUser.username,
            email: addedUser.email,
            firstName: addedUser.firstName,
            lastName: addedUser.lastName
        }, process.env.JWT_PRIVATE_KEY,{
            "expiresIn": "10m"
        });
        
        return response.status(201).json({
            success: true,
            message: "User registered successfully",
            token: accessToken,
            user: {
                username: addedUser.username,
                email: addedUser.email,
                firstName: addedUser.firstName,
                lastName: addedUser.lastName
            }
        });
        
    } catch(e){
        console.log(`Error occured while registering ${e}`);
        return response.status(500).json({
            success: false,
            message: "Error occured while registering, please try again!"
        });
    }
}

module.exports = {loginFn, registerFn};