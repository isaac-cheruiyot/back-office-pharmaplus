"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Apr 1", prescriptions: 4000, otc: 2400 },
  { name: "Apr 5", prescriptions: 3000, otc: 1398 },
  { name: "Apr 10", prescriptions: 2000, otc: 9800 },
  { name: "Apr 15", prescriptions: 2780, otc: 3908 },
  { name: "Apr 20", prescriptions: 1890, otc: 4800 },
  { name: "Apr 25", prescriptions: 2390, otc: 3800 },
  { name: "Apr 30", prescriptions: 3490, otc: 4300 },
]

export function SalesChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[300px] bg-slate-100 animate-pulse rounded-md" />
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="prescriptions" stroke="#15803d" strokeWidth={2} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="otc" stroke="#ef4444" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
