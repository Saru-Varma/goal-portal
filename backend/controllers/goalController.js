const Goal = require("../models/Goal");

// =========================
// CREATE GOAL (UPDATED - WEIGHTAGE FROM 1 ONWARDS)
// =========================
const createGoal = async (req, res) => {
    try {
        const {
            employeeId,
            thrustArea,
            title,
            description,
            uomType,
            target,
            weightage
        } = req.body;

        const weight = Number(weightage);

        // ✅ ONLY BASIC VALIDATION (KEEP SAFE)
        if (isNaN(weight) || weight <= 0) {
            return res.status(400).json({
                message: "Weightage must be greater than 0"
            });
        }

        // ❌ REMOVED:
        // if (weightage < 10) { ... }

        const goal = new Goal({
            employeeId,
            thrustArea,
            title,
            description,
            uomType,
            target,
            weightage,
            status: "submitted"
        });

        await goal.save();

        res.json({
            message: "Goal created successfully",
            goal
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =========================
// GET ALL GOALS (by employee)
// =========================
const getGoalsByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const goals = await Goal.find({ employeeId });

        res.json(goals);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createGoal,
    getGoalsByEmployee
};