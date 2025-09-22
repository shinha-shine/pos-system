const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        verified: {
            type: Boolean,
            default: true
        },
        role: {
            type: String,
            enum: ['admin', 'cashier', 'customer'],
            required: true,
            },
        phone: { 
            type: String 
        },       // Optional extra field
        shiftTime: { 
            type: String 
        },   // Optional extra field
    },
    { timestamps: true }
);

const Users = mongoose.model("users", userSchema);
module.exports = Users;
