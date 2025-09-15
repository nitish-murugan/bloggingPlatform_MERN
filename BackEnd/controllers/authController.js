const userObj = require('../model/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginFn = async (request, response)=>{
    try{
        const {email, password} = request.body;
        const isUser = await userObj.findOne({email: email});
        if(!isUser){
            console.log("Error 1");
            return response.status(404).json({
                success: false,
                message: "User not found with the email"
            });
        }

        const isPassword = await bcryptjs.compare(password,isUser.password);
        if(!isPassword){
            console.log("Error 2");
            return response.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }
        
        const accessToken = jwt.sign({
            username: isUser.username,
            email: isUser.email,
            firstName: isUser.firstName,
            lastName: isUser.lastName,
            role: isUser.role,
            id: isUser._id
        }, process.env.JWT_PRIVATE_KEY,{
            "expiresIn": "10m"
        });

        const updatedUser = await userObj.findByIdAndUpdate(isUser._id, {
            $inc: { loginCount: 1 },
            lastLoginDate: new Date(),
            isOnline: true,
            lastActivityDate: new Date()
        }, { new: true });

        console.log("Success 1");

        return response.status(200).json({
            success: true,
            message: "User logged in successfully",
            token: accessToken,
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                role: updatedUser.role,
                status: updatedUser.status,
                loginCount: updatedUser.loginCount,
                lastLoginDate: updatedUser.lastLoginDate,
                createdAt: updatedUser.createdAt
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

const googleSignInFn = async (request, response) => {
    try {
        const { credential } = request.body;
        
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, given_name: firstName, family_name: lastName, picture } = payload;
        
        let user = await userObj.findOne({ 
            $or: [
                { email: email },
                { googleId: googleId }
            ]
        });
        
        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                user.profilePicture = picture;
                await user.save();
            }
            
            user = await userObj.findByIdAndUpdate(user._id, {
                $inc: { loginCount: 1 },
                lastLoginDate: new Date(),
                isOnline: true,
                lastActivityDate: new Date()
            }, { new: true });
            
        } else {
            user = await userObj.create({
                username: email.split('@')[0],
                firstName: firstName || name.split(' ')[0] || 'User',
                lastName: lastName || name.split(' ').slice(1).join(' ') || '',
                email: email,
                googleId: googleId,
                profilePicture: picture,
                role: 'user',
                status: 'active',
                loginCount: 1,
                lastLoginDate: new Date(),
                isOnline: true,
                lastActivityDate: new Date(),
                createdAt: new Date()
            });
        }
        
        const accessToken = jwt.sign({
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            id: user._id
        }, process.env.JWT_PRIVATE_KEY, {
            "expiresIn": "10m"
        });
        
        return response.status(200).json({
            success: true,
            message: "Google sign-in successful",
            token: accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                status: user.status,
                profilePicture: user.profilePicture,
                loginCount: user.loginCount,
                lastLoginDate: user.lastLoginDate,
                createdAt: user.createdAt
            }
        });
        
    } catch (error) {
        console.log(`Error in Google sign-in: ${error}`);
        return response.status(401).json({
            success: false,
            message: "Invalid Google credential"
        });
    }
};

module.exports = {loginFn, registerFn, googleSignInFn};