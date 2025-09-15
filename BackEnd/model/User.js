const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId;
        }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator', 'superadmin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'active'
    },
    loginCount: {
        type: Number,
        default: 0
    },
    lastLoginDate: {
        type: Date,
        default: null
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastActivityDate: {
        type: Date,
        default: Date.now
    }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);