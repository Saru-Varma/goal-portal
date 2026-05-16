import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard({ goals }) {

  const completed = goals.filter(g => g.status === "Completed").length;
  const pending = goals.filter(g => g.status !== "Completed").length;

  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending }
  ];

  const COLORS = ["#22c55e", "#f97316"];

  return (
    <div style={{ marginTop: 20 }}>

      <h2>📊 Performance Dashboard</h2>

      {/* PIE CHART */}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={80}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* BAR CHART */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={goals}>
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="progressScore" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}