const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({

    // 👤 Employee who owns this goal
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // 📌 Department / area
    thrustArea: {
        type: String,
        required: true
    },

    // 🎯 Goal title
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    // 📊 Unit type
    uomType: {
        type: String,
        enum: ["numeric", "percentage", "timeline", "zero"],
        required: true
    },

    // 🎯 Target value
    target: {
        type: Number,
        required: true
    },

    // 📈 Actual achievement
    achievement: {
        type: Number,
        default: 0
    },

    // 📊 Auto-calculated progress
    progressScore: {
        type: Number,
        default: 0
    },

    // ⚖️ Weightage (IMPORTANT RULE)
    weightage: {
        type: Number,
        required: true,
        min: 10,
        max: 100
    },

    // 📌 Status workflow
    status: {
        type: String,
        enum: [
            "draft",
            "submitted",
            "approved",
            "rejected",
            "locked"
        ],
        default: "submitted"
    },

    // 👨‍💼 Manager approval
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model("Goal", GoalSchema);