import { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

// Sample training history data
const sampleData = [
  { epoch: 1, accuracy: 0.65, loss: 0.75 },
  { epoch: 2, accuracy: 0.72, loss: 0.65 },
  { epoch: 3, accuracy: 0.78, loss: 0.55 },
  { epoch: 4, accuracy: 0.82, loss: 0.45 },
  { epoch: 5, accuracy: 0.85, loss: 0.38 },
];

export default function TrainingHistory() {
  const [data] = useState(sampleData);

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Training History</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="loss" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
