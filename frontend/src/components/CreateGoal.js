import React, { useState } from "react";
import axios from "axios";

function CreateGoal({ user }) {

    const [form, setForm] = useState({
        thrustArea: "",
        title: "",
        description: "",
        uomType: "numeric",
        target: "",
        weightage: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:5000/api/goals/create", {
                ...form,
                employeeId: user.id
            });

            alert("Goal Created!");
        } catch (err) {
            alert(err.response.data);
        }
    };

    return (
        <div>
            <h2>Create Goal</h2>

            <input name="title" placeholder="Title" onChange={handleChange} />
            <input name="thrustArea" placeholder="Thrust Area" onChange={handleChange} />
            <input name="description" placeholder="Description" onChange={handleChange} />
            <input name="target" placeholder="Target" onChange={handleChange} />
            <input name="weightage" placeholder="Weightage" onChange={handleChange} />

            <button onClick={handleSubmit}>Create Goal</button>
        </div>
    );
}

export default CreateGoal;