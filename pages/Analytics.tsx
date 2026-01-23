
import React, { useState } from 'react';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3, 
  Users, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Building
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';

const costByDept = [
  { name: 'Engineering', value: 45000000, color: '#2563eb' },
  { name: 'Marketing', value: 15000000, color: '#7c3aed' },
  { name: 'Operations', value: 25000000, color: '#059669' },
  { name: 'Sales', value: 20000000, color: '#ea580c' },
  { name: 'HR', value: 8000000, color: '#db2777' },
];

const statutoryTrend = [
  { month: 'Jul', paye: 12500000, nssf: 8200000, sdl: 2800000 },
  { month: 'Aug', paye: 12800000, nssf: 8400000, sdl: 2900000 },
  { month: 'Sep', paye: 13200000, nssf: 8600000, sdl: 3000000 },
  { month: 'Oct', paye: 14500000, nssf: 9200000, sdl: 3200000 },
];

const salaryRange = [
  { range: '0-1M', count: 45 },
  { range: '1-3M', count: 62 },
  { range: '3-5M', count: 18 },
  { range: '5M+', count: 3 },
];

const MetricCard: React.FC<{ title: string; value: string; subValue: string; isPositive: boolean; icon: React.ReactNode }> = ({ title, value, subValue, isPositive, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {subValue}
      </div>
    </div>
    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
  </div>
);

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Quarterly');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Workforce Analytics</h2>
          <p className="text-slate-500 mt-2">Deep insights into compensation, compliance, and human capital costs.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          >
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Yearly</option>
          </select>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            <Download size={16} />
            Export Data
          </button>
        </div>
      </div>

      {/* High-level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total CTC (Cost to Co)" 
          value="TZS 113.4M" 
          subValue="4.2% vs last Q" 
          isPositive={true} 
          icon={<TrendingUp size={20} />} 
        />
        <MetricCard 
          title="Avg. Tax Burden" 
          value="24.8%" 
          subValue="0.5% decrease" 
          isPositive={false} 
          icon={<PieIcon size={20} />} 
        />
        <MetricCard 
          title="Net Pay Ratio" 
          value="68.2%" 
          subValue="Stable" 
          isPositive={true} 
          icon={<BarChart3 size={20} />} 
        />
        <MetricCard 
          title="Headcount Growth" 
          value="+14" 
          subValue="8.1% growth" 
          isPositive={true} 
          icon={<Users size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Breakdown */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cost by Department</h3>
              <p className="text-xs text-slate-500 mt-1">Total Gross Salary distribution</p>
            </div>
            <Building className="text-slate-300" size={24} />
          </div>
          <div className="h-[350px] w-full flex flex-col md:flex-row items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costByDept}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {costByDept.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `TZS ${(value / 1000000).toFixed(1)}M`}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 shrink-0 px-4">
              {costByDept.map((dept) => (
                <div key={dept.name} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dept.color }}></div>
                  <span className="text-xs font-bold text-slate-600">{dept.name}</span>
                  <span className="text-xs font-medium text-slate-400">{(dept.value / 1000000).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statutory Trend */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Statutory Liability Trends</h3>
              <p className="text-xs text-slate-500 mt-1">PAYE, NSSF, and SDL obligations</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
              <Info size={12} /> FY 2025
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statutoryTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
                <Bar dataKey="paye" name="PAYE (Tax)" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="nssf" name="NSSF" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="sdl" name="SDL" fill="#059669" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Salary Distribution */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#3b82f615,transparent)]"></div>
        <div className="relative z-10 flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3">
            <h3 className="text-2xl font-bold mb-4 tracking-tight">Salary Distribution</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Understanding the spread of compensation across your talent pool. Most employees fall within the 1M - 3M TZS bracket.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Median Basic Pay</p>
                <p className="text-xl font-bold">TZS 2,450,000</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Top 5% Average</p>
                <p className="text-xl font-bold">TZS 7,800,000</p>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryRange} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="range" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 'bold'}}
                  width={60}
                />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }}
                />
                <Bar 
                  dataKey="count" 
                  name="Employees" 
                  fill="#3b82f6" 
                  radius={[0, 8, 8, 0]} 
                  barSize={30}
                >
                  {salaryRange.map((entry, index) => (
                    <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.15} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
