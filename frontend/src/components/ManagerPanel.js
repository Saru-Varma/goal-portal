import React, { useEffect, useState } from "react";
import axios from "axios";

function ManagerPanel() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH ALL GOALS
  const fetchGoals = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/goals/manager/all"
      );

      setGoals(res.data);
      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // APPROVE / REJECT
  const updateApproval = async (goalId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/goals/approve/${goalId}`,
        {
          approved: status === "Approved"
        }
      );

      fetchGoals();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manager Dashboard</h1>

      {loading ? (
        <p>Loading goals...</p>
      ) : goals.length === 0 ? (
        <p>No goals found</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Title</th>
              <th>Area</th>
              <th>Target</th>
              <th>Achievement</th>
              <th>Status</th>
              <th>Score</th>
              <th>Approval</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {goals.map((g) => (
              <tr key={g._id}>
                <td>{g.employeeId?.name}</td>
                <td>{g.title}</td>
                <td>{g.thrustArea}</td>
                <td>{g.target}</td>
                <td>{g.achievement}</td>
                <td>{g.status}</td>
                <td>{g.progressScore}%</td>

                <td>
                  {g.approved ? "Approved" : "Pending"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      updateApproval(g._id, "Approved")
                    }
                    style={{
                      background: "green",
                      color: "white",
                      marginRight: "5px"
                    }}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateApproval(g._id, "Rejected")
                    }
                    style={{
                      background: "red",
                      color: "white"
                    }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManagerPanel;