const router = require("express").Router();
const Goal = require("../models/Goal");
const auth = require("../middleware/auth");

// ===============================
// CREATE GOAL (NO LIMIT WEIGHTAGE)
// ===============================
router.post("/create", auth, async (req, res) => {
  try {
    const { employeeId, weightage } = req.body;

    const weight = Number(weightage);

    // ✅ only required validation
    if (isNaN(weight) || weight < 1) {
      return res.status(400).json({
        message: "Weightage must be at least 1"
      });
    }

    const goal = new Goal({
      ...req.body,
      weightage: weight
    });

    await goal.save();

    res.json({
      message: "Goal created successfully",
      goal,
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
});

// ===============================
// GET EMPLOYEE GOALS
// ===============================
router.get("/:employeeId", auth, async (req, res) => {
  try {
    const goals = await Goal.find({
      employeeId: req.params.employeeId,
    });

    res.json(goals);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// ===============================
// MANAGER APPROVE / REJECT
// ===============================
router.put("/approve/:goalId", auth, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json("Access denied");
    }

    const { approved } = req.body;

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.goalId,
      {
        approved,
        status: approved ? "Approved" : "Rejected",
      },
      { new: true }
    );

    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// ===============================
// MANAGER DASHBOARD
// ===============================
router.get("/manager/all", auth, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json("Access denied");
    }

    const goals = await Goal.find().populate(
      "employeeId",
      "name email role"
    );

    res.json(goals);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// ===============================
// UPDATE PROGRESS
// ===============================
router.put("/update-progress/:goalId", auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId);

    if (!goal) {
      return res.status(404).json("Goal not found");
    }

    let progressScore = 0;

    if (
      goal.uomType === "numeric" ||
      goal.uomType === "percentage"
    ) {
      const achievement = Number(req.body.achievement);
      const target = Number(goal.target);

      progressScore =
        target > 0
          ? Math.min(100, (achievement / target) * 100)
          : 0;
    } else if (goal.uomType === "zero") {
      progressScore =
        Number(req.body.achievement) === 0 ? 100 : 0;
    } else if (goal.uomType === "timeline") {
      progressScore =
        req.body.status === "Completed" ? 100 : 50;
    }

    if (req.body.status === "Completed") {
      progressScore = 100;
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.goalId,
      {
        achievement: req.body.achievement,
        status: req.body.status,
        progressScore,
      },
      { new: true }
    );

    res.json(updatedGoal);

  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;