import React, { useEffect, useState } from "react";
import axios from "axios";

function Goals({ user }) {
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        if (user) {
            fetchGoals();
        }
    }, [user]);

    const fetchGoals = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/goals/${user.id}`
            );
            setGoals(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h2>Your Goals</h2>

            {goals.map((g) => (
                <div key={g._id} style={{ border: "1px solid black", margin: 10 }}>
                    <h3>{g.title}</h3>
                    <p>Area: {g.thrustArea}</p>
                    <p>Target: {g.target}</p>
                    <p>Achievement: {g.achievement}</p>
                    <p>Status: {g.status}</p>
                </div>
            ))}
        </div>
    );
}

export default Goals;