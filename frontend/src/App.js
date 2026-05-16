import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Dashboard from "./Dashboard";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const [managerGoals, setManagerGoals] = useState([]);

  const [loadingGoals, setLoadingGoals] = useState(false);
  const [loadingManager, setLoadingManager] = useState(false);

  const [goal, setGoal] = useState({
    thrustArea: "",
    title: "",
    description: "",
    uomType: "numeric",
    target: "",
    weightage: ""
  });

  const [updates, setUpdates] = useState({});

  // ---------------- SAFE USER ID ----------------
  const getUserId = () => user?.id || user?._id;

  // ---------------- TOKEN HEADER FIX ----------------
  const getTokenHeader = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    };
  };

  // ---------------- FETCH GOALS ----------------
  const fetchGoals = async (employeeId) => {
    try {
      setLoadingGoals(true);

      const res = await axios.get(
        `http://localhost:5000/api/goals/${employeeId}`,
        getTokenHeader()
      );

      setGoals(res.data || []);
    } catch (err) {
      console.log(err?.response?.data || err.message);
      setGoals([]);
    } finally {
      setLoadingGoals(false);
    }
  };

  // ---------------- FETCH MANAGER GOALS ----------------
  const fetchManagerGoals = async () => {
    try {
      setLoadingManager(true);

      const res = await axios.get(
        "http://localhost:5000/api/goals/manager/all",
        getTokenHeader()
      );

      setManagerGoals(res.data || []);
    } catch (err) {
      console.log(err?.response?.data || err.message);
      setManagerGoals([]);
    } finally {
      setLoadingManager(false);
    }
  };

  // ---------------- LOAD USER ----------------
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      const uid = parsedUser?.id || parsedUser?._id;

      if (uid) fetchGoals(uid);
      if (parsedUser?.role === "manager") fetchManagerGoals();
    }
  }, []);

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const loggedUser = res.data.user;

      setUser(loggedUser);

      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("token", res.data.token);

      const uid = loggedUser?.id || loggedUser?._id;

      if (uid) fetchGoals(uid);
      if (loggedUser?.role === "manager") fetchManagerGoals();

      alert("Login Successful");
    } catch (err) {
      console.log(err?.response?.data || err.message);
      alert("Login Failed");
    }
  };

  // ---------------- CREATE GOAL ----------------
  const createGoal = async () => {
    try {
      const uid = getUserId();

      if (!uid) {
        alert("User not found");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/goals/create",
        { employeeId: uid, ...goal },
        getTokenHeader()
      );

      setGoal({
        thrustArea: "",
        title: "",
        description: "",
        uomType: "numeric",
        target: "",
        weightage: ""
      });

      fetchGoals(uid);
      alert("Goal Created");
    } catch (err) {
      console.log(err?.response?.data || err.message);
      alert("Error creating goal");
    }
  };

  // ---------------- UPDATE PROGRESS ----------------
  const updateProgress = async (goalId, achievement, status) => {
    try {
      const uid = getUserId();

      await axios.put(
        `http://localhost:5000/api/goals/update-progress/${goalId}`,
        { achievement, status },
        getTokenHeader()
      );

      fetchGoals(uid);
    } catch (err) {
      console.log(err?.response?.data || err.message);
      alert("Update Failed");
    }
  };

  // ---------------- APPROVAL ----------------
  const handleApproval = async (goalId, approved) => {
    try {
      await axios.put(
        `http://localhost:5000/api/goals/approve/${goalId}`,
        { approved },
        getTokenHeader()
      );

      fetchManagerGoals();
    } catch (err) {
      console.log(err?.response?.data || err.message);
      alert("Approval failed");
    }
  };

  // ---------------- LOGIN SCREEN ----------------
  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h1>Goal Portal Login</h1>

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  // ---------------- DASHBOARD ----------------
  return (
    <div className="container">
      <div className="card">

        <h1>Welcome {user.name}</h1>

        <button
          onClick={() => {
            localStorage.clear();
            setUser(null);
            setGoals([]);
            setManagerGoals([]);
          }}
        >
          Logout
        </button>

        {/* EMPLOYEE */}
        {user.role === "employee" && (
          <>
            <h2>Employee Dashboard</h2>

            <h3>Create Goal</h3>

            <input placeholder="Thrust Area"
              value={goal.thrustArea}
              onChange={(e) => setGoal({ ...goal, thrustArea: e.target.value })}
            />

            <input placeholder="Goal Title"
              value={goal.title}
              onChange={(e) => setGoal({ ...goal, title: e.target.value })}
            />

            <input placeholder="Description"
              value={goal.description}
              onChange={(e) => setGoal({ ...goal, description: e.target.value })}
            />

            <select
              value={goal.uomType}
              onChange={(e) => setGoal({ ...goal, uomType: e.target.value })}
            >
              <option value="numeric">Numeric</option>
              <option value="percentage">Percentage</option>
              <option value="timeline">Timeline</option>
              <option value="zero">Zero Based</option>
            </select>

            <input type="number" placeholder="Target"
              value={goal.target}
              onChange={(e) => setGoal({ ...goal, target: e.target.value })}
            />

            <input type="number" placeholder="Weightage"
              value={goal.weightage}
              onChange={(e) => setGoal({ ...goal, weightage: e.target.value })}
            />

            <button onClick={createGoal}>Create Goal</button>

            <Dashboard goals={goals} />

            {goals.map((g) => (
              <div className="goalCard" key={g._id}>
                <h3>{g.title}</h3>

                <input
                  placeholder="Achievement"
                  onChange={(e) =>
                    setUpdates({
                      ...updates,
                      [g._id]: {
                        ...updates[g._id],
                        achievement: e.target.value
                      }
                    })
                  }
                />

                <select
                  onChange={(e) =>
                    setUpdates({
                      ...updates,
                      [g._id]: {
                        ...updates[g._id],
                        status: e.target.value
                      }
                    })
                  }
                >
                  <option value="Not Started">Not Started</option>
                  <option value="On Track">On Track</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  onClick={() =>
                    updateProgress(
                      g._id,
                      updates[g._id]?.achievement,
                      updates[g._id]?.status
                    )
                  }
                >
                  Update
                </button>
              </div>
            ))}
          </>
        )}

        {/* MANAGER */}
        {user.role === "manager" && (
          <>
            <hr />
            <h2>Manager Dashboard</h2>

            <Dashboard goals={managerGoals} />

            {managerGoals.map((g) => (
              <div className="goalCard" key={g._id}>
                <h3>{g.title}</h3>
                <p>{g.employeeId?.name}</p>

                <button onClick={() => handleApproval(g._id, true)}>
                  Approve
                </button>
                <button onClick={() => handleApproval(g._id, false)}>
                  Reject
                </button>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

export default App;