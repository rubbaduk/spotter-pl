'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

type CompetitionData = {
  date: string;
  meetName: string;
  squat: number;
  bench: number;
  deadlift: number;
  total: number;
};

type ProgressionChartProps = {
  data: CompetitionData[];
  athleteName: string;
};

export default function ProgressionChart({ data, athleteName }: ProgressionChartProps) {
  const [visibleLines, setVisibleLines] = useState({
    squat: true,
    bench: true,
    deadlift: true,
    total: true,
  });

  if (!data || data.length === 0) {
    return (
      <div className="card bg-base-100 shadow-lg mb-8">
        <div className="card-body">
          <h3 className="card-title text-lg">Competition Progression</h3>
          <p className="text-sm opacity-60">No competition data available</p>
        </div>
      </div>
    );
  }

  const toggleLine = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [line]: !prev[line] }));
  };

  const chartData = data.map(comp => ({
    date: comp.date,
    meetName: comp.meetName,
    squat: comp.squat > 0 ? comp.squat : null,
    bench: comp.bench > 0 ? comp.bench : null,
    deadlift: comp.deadlift > 0 ? comp.deadlift : null,
    total: comp.total > 0 ? comp.total : null,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-3 border border-base-300 rounded-lg shadow-lg">
          <p className="font-semibold text-sm mb-1">{label}</p>
          <p className="text-xs opacity-60 mb-2">{payload[0]?.payload?.meetName}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value ? `${entry.value} kg` : '—'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card bg-base-100 shadow-lg mb-8">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title text-lg">Competition Progression</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => toggleLine('squat')}
              className={`btn btn-xs ${visibleLines.squat ? 'bg-[#3b82f6]' : 'btn-ghost'}`}
            >
              Squat
            </button>
            <button
              onClick={() => toggleLine('bench')}
              className={`btn btn-xs ${visibleLines.bench ? 'bg-[#10b981]' : 'btn-ghost'}`}
            >
              Bench
            </button>
            <button
              onClick={() => toggleLine('deadlift')}
              className={`btn btn-xs ${visibleLines.deadlift ? 'bg-[#ef4444]' : 'btn-ghost'}`}
            >
              Deadlift
            </button>
            <button
              onClick={() => toggleLine('total')}
              className={`btn btn-xs ${visibleLines.total ? 'bg-[#8b5cf6]' : 'btn-ghost'}`}
            >
              Total
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            {visibleLines.squat && (
              <Line
                type="monotone"
                dataKey="squat"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Squat"
                connectNulls
              />
            )}
            {visibleLines.bench && (
              <Line
                type="monotone"
                dataKey="bench"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Bench"
                connectNulls
              />
            )}
            {visibleLines.deadlift && (
              <Line
                type="monotone"
                dataKey="deadlift"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Deadlift"
                connectNulls
              />
            )}
            {visibleLines.total && (
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Total"
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        <p className="text-xs opacity-50 mt-4 text-center">
          Showing {data.length} competition{data.length !== 1 ? 's' : ''} for {athleteName}
        </p>
      </div>
    </div>
  );
}
