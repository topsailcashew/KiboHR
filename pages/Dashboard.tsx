
import React from 'react';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Jan', amount: 45000000 },
  { name: 'Feb', amount: 46200000 },
  { name: 'Mar', amount: 44800000 },
  { name: 'Apr', amount: 48500000 },
  { name: 'May', amount: 49200000 },
  { name: 'Jun', amount: 51000000 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode; color: string }> = ({ title, value, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
        {trend}
      </span>
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Karibu, Admin!</h2>
          <p className="text-slate-500 mt-1">Here's what's happening with your payroll today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600">
            <Calendar size={18} />
            Oct 2025
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
            Run Payroll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Employees" 
          value="128" 
          trend="+12%" 
          color="bg-blue-50 text-blue-600"
          icon={<Users size={20} />}
        />
        <StatCard 
          title="Monthly Payroll" 
          value="TZS 51.0M" 
          trend="+3.2%" 
          color="bg-purple-50 text-purple-600"
          icon={<Wallet size={20} />}
        />
        <StatCard 
          title="Avg. Net Pay" 
          value="TZS 1.2M" 
          trend="+0.8%" 
          color="bg-amber-50 text-amber-600"
          icon={<TrendingUp size={20} />}
        />
        <StatCard 
          title="Tax Liability" 
          value="TZS 14.5M" 
          trend="+4.5%" 
          color="bg-rose-50 text-rose-600"
          icon={<AlertCircle size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Payroll Trend (Last 6 Months)</h3>
            <select className="bg-slate-50 border-none text-xs font-semibold rounded-lg focus:ring-0">
              <option>All Depts</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `T${val/1000000}M`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Upcoming Deadlines</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold uppercase">Nov</span>
                <span className="text-lg font-bold leading-none">07</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">NSSF Contribution</p>
                <p className="text-sm text-slate-500">October 2025 Submission</p>
                <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[70%]" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold uppercase">Nov</span>
                <span className="text-lg font-bold leading-none">07</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">PAYE Submission</p>
                <p className="text-sm text-slate-500">TRA P10 Return</p>
                <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[40%]" />
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-900">HESLB Verified</p>
                <p className="text-xs text-emerald-700 mt-0.5">All student loan deductions are up to date for current cycle.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
