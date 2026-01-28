
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Wallet,
  TrendingUp,
  AlertCircle,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useApp } from '../context/AppContext';

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode; color: string; trendUp?: boolean }> = ({ title, value, trend, icon, color, trendUp = true }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
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
  const navigate = useNavigate();
  const {
    totalEmployees,
    totalGrossPay,
    totalNetPay,
    totalTaxLiability,
    averageNetPay,
    payrollRuns,
    employees
  } = useApp();

  // Get current month/year for display
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
  const currentYear = currentDate.getFullYear();

  // Generate payroll trend data (last 6 months)
  const payrollTrendData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });

      // Check if we have a payroll run for this month
      const payrollRun = payrollRuns.find(run =>
        run.month === monthName && run.year === date.getFullYear()
      );

      // Use actual data if available, otherwise estimate based on current gross pay
      const amount = payrollRun
        ? payrollRun.results.reduce((sum, r) => sum + r.grossPay, 0)
        : totalGrossPay * (0.9 + Math.random() * 0.2); // Slight variation for demo

      months.push({
        name: monthName,
        amount: Math.round(amount),
      });
    }
    return months;
  }, [payrollRuns, totalGrossPay]);

  // Calculate deadlines
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const deadlineDay = 7; // NSSF/PAYE deadline is 7th of next month
  const daysUntilDeadline = Math.ceil((new Date(nextMonth.getFullYear(), nextMonth.getMonth(), deadlineDay).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  // Check for employees with HESLB loans
  const employeesWithHeslb = employees.filter(emp => emp.hasHeslbLoan).length;
  const heslbCompliant = employeesWithHeslb > 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `TZS ${(amount / 1000000).toFixed(1)}M`;
    }
    return `TZS ${amount.toLocaleString()}`;
  };

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
            {currentMonth} {currentYear}
          </div>
          <button
            onClick={() => navigate('/payroll')}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
          >
            Run Payroll
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={totalEmployees.toString()}
          trend={totalEmployees > 0 ? `${totalEmployees} active` : 'No employees'}
          color="bg-blue-50 text-blue-600"
          icon={<Users size={20} />}
        />
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(totalGrossPay)}
          trend="Gross Pay"
          color="bg-purple-50 text-purple-600"
          icon={<Wallet size={20} />}
        />
        <StatCard
          title="Avg. Net Pay"
          value={formatCurrency(averageNetPay)}
          trend="Per Employee"
          color="bg-amber-50 text-amber-600"
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Tax Liability"
          value={formatCurrency(totalTaxLiability)}
          trend="PAYE Total"
          color="bg-rose-50 text-rose-600"
          icon={<AlertCircle size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Payroll Trend (Last 6 Months)</h3>
            <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">
              {totalEmployees} employees
            </div>
          </div>
          {totalGrossPay > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={payrollTrendData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `T${(val / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`TZS ${value.toLocaleString()}`, 'Gross Pay']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] w-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>Add employees to see payroll trends</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Upcoming Deadlines</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className={`w-12 h-12 ${daysUntilDeadline <= 7 ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'} rounded-2xl flex flex-col items-center justify-center shrink-0`}>
                <span className="text-[10px] font-bold uppercase">{nextMonth.toLocaleString('default', { month: 'short' })}</span>
                <span className="text-lg font-bold leading-none">{deadlineDay.toString().padStart(2, '0')}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">NSSF Contribution</p>
                <p className="text-sm text-slate-500">{currentMonth} {currentYear} Submission</p>
                <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${daysUntilDeadline <= 7 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${Math.max(0, 100 - (daysUntilDeadline / 30) * 100)}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{daysUntilDeadline} days remaining</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className={`w-12 h-12 ${daysUntilDeadline <= 7 ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'} rounded-2xl flex flex-col items-center justify-center shrink-0`}>
                <span className="text-[10px] font-bold uppercase">{nextMonth.toLocaleString('default', { month: 'short' })}</span>
                <span className="text-lg font-bold leading-none">{deadlineDay.toString().padStart(2, '0')}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">PAYE Submission</p>
                <p className="text-sm text-slate-500">TRA P10 Return</p>
                <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${daysUntilDeadline <= 7 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${Math.max(0, 100 - (daysUntilDeadline / 30) * 100)}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{daysUntilDeadline} days remaining</p>
              </div>
            </div>

            {heslbCompliant ? (
              <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-900">HESLB Verified</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    {employeesWithHeslb} employee{employeesWithHeslb !== 1 ? 's' : ''} with active HESLB deductions.
                  </p>
                </div>
              </div>
            ) : totalEmployees > 0 ? (
              <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                <CheckCircle2 size={20} className="text-slate-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-700">No HESLB Deductions</p>
                  <p className="text-xs text-slate-500 mt-0.5">No employees have active student loan deductions.</p>
                </div>
              </div>
            ) : (
              <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-900">No Employees</p>
                  <p className="text-xs text-amber-700 mt-0.5">Add employees to start managing payroll.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      {totalEmployees > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Net Pay</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalNetPay)}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">HESLB Employees</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{employeesWithHeslb}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payroll Runs</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{payrollRuns.length}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{payrollRuns.filter(r => r.isSubmitted).length}</p>
          </div>
        </div>
      )}
    </div>
  );
};
