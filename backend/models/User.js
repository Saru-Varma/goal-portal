const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    // 🔥 ROLE SYSTEM (IMPORTANT FOR HACKATHON)
    role: {
        type: String,
        enum: ["employee", "manager", "admin"],
        default: "employee"
    }
});

module.exports = mongoose.model("User", UserSchema);