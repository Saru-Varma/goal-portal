const User = require("../models/User");

// 🔐 LOGIN FUNCTION
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // check password (simple hackathon version)
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // send user data to frontend
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = { loginUser };