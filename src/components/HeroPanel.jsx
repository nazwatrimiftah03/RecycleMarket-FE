import { TrendingUp, Award, Target, Users } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "Jan", value: 2400, growth: 2100 },
  { month: "Feb", value: 1398, growth: 2800 },
  { month: "Mar", value: 9800, growth: 3900 },
  { month: "Apr", value: 3908, growth: 4300 },
  { month: "May", value: 4800, growth: 4800 },
  { month: "Jun", value: 3800, growth: 5300 },
];

const achievementStats = [
  { label: "Total Revenue", value: "$45,231", change: "+20.1%", icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50" },
  { label: "Achievements", value: "156", change: "+12%", icon: Award, color: "text-purple-600", bgColor: "bg-purple-50" },
  { label: "Goals Met", value: "89%", change: "+5.3%", icon: Target, color: "text-blue-600", bgColor: "bg-blue-50" },
  { label: "Active Users", value: "2,845", change: "+18.2%", icon: Users, color: "text-orange-600", bgColor: "bg-orange-50" },
];

export function HeroPanel() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your projects today.</p>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 border-b border-gray-200">
        {achievementStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{stat.label}</span>
                <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-gray-900">{stat.value}</span>
                <span className={stat.color}>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div>
          <h3 className="text-gray-900 mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-gray-900 mb-4">Growth Metrics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="growth" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
