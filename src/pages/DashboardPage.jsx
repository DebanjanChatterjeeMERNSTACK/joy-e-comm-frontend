import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DashboardPage = () => {
  // Example data
  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 7000 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 8000 },
  ];

  const pieData = [
    { name: "Electronics", value: 45 },
    { name: "Clothes", value: 25 },
    { name: "Groceries", value: 30 },
  ];

  const COLORS = ["#6366f1", "#22c55e", "#f97316"];

  return (
    <div className="p-4 bg-gray-100  overflow-y-scroll">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">📊 Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <p className="text-gray-500">Total Sales</p>
          <h2 className="text-xl font-bold">₹1,25,000</h2>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <p className="text-gray-500">Orders</p>
          <h2 className="text-xl font-bold">1,250</h2>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <p className="text-gray-500">Customers</p>
          <h2 className="text-xl font-bold">890</h2>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <p className="text-gray-500">Products</p>
          <h2 className="text-xl font-bold">320</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md col-span-2">
          <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Category Sales</h2>
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
