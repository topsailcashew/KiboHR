
import React, { useState, useMemo } from 'react';
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
  Legend
} from 'recharts';
import { useAnalytics } from '../context/AppContext';
import { PayrollCalculator } from '../services/payrollCalculator';

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
  const {
    employees,
    totalEmployees,
    totalGrossPay,
    totalNetPay,
    totalTaxLiability,
    totalEmployerCost,
    salaryDistribution,
    employeesByBank,
    payrollRuns
  } = useAnalytics();

  // Calculate cost by bank (as a proxy for department since we don't have departments)
  const costByBank = useMemo(() => {
    const colors = ['#2563eb', '#7c3aed', '#059669', '#ea580c', '#db2777'];
    return Object.entries(employeesByBank).map(([bank, count], index) => {
      const bankEmployees = employees.filter(e => e.bankShortCode === bank);
      const totalCost = bankEmployees.reduce((sum, emp) => {
        const result = PayrollCalculator.calculateNetPay(emp, employees.length);
        return sum + result.grossPay;
      }, 0);
      return {
        name: bank,
        value: totalCost,
        count,
        color: colors[index % colors.length]
      };
    });
  }, [employees, employeesByBank]);

  // Calculate statutory trends from payroll runs
  const statutoryTrend = useMemo(() => {
    if (payrollRuns.length === 0) {
      // Generate sample data based on current employees
      const months = ['Jul', 'Aug', 'Sep', 'Oct'];
      return months.map((month, index) => {
        const factor = 0.9 + (index * 0.05);
        return {
          month,
          paye: Math.round(totalTaxLiability * factor),
          nssf: Math.round(totalGrossPay * 0.1 * factor),
          sdl: Math.round(totalGrossPay * 0.035 * factor)
        };
      });
    }

    // Use actual payroll run data
    return payrollRuns.slice(0, 4).reverse().map(run => ({
      month: run.month,
      paye: run.results.reduce((sum, r) => sum + r.paye, 0),
      nssf: run.results.reduce((sum, r) => sum + r.nssfEmployee, 0),
      sdl: run.results.reduce((sum, r) => sum + r.sdl, 0)
    }));
  }, [payrollRuns, totalTaxLiability, totalGrossPay]);

  // Calculate metrics
  const avgTaxBurden = totalGrossPay > 0 ? ((totalTaxLiability / totalGrossPay) * 100).toFixed(1) : '0';
  const netPayRatio = totalGrossPay > 0 ? ((totalNetPay / totalGrossPay) * 100).toFixed(1) : '0';

  // Calculate median salary
  const medianSalary = useMemo(() => {
    if (employees.length === 0) return 0;
    const salaries = employees.map(e => e.basicPay).sort((a, b) => a - b);
    const mid = Math.floor(salaries.length / 2);
    return salaries.length % 2 !== 0 ? salaries[mid] : (salaries[mid - 1] + salaries[mid]) / 2;
  }, [employees]);

  // Calculate top 5% average
  const top5PercentAvg = useMemo(() => {
    if (employees.length === 0) return 0;
    const salaries = employees.map(e => e.basicPay).sort((a, b) => b - a);
    const top5Count = Math.max(1, Math.ceil(salaries.length * 0.05));
    const top5Salaries = salaries.slice(0, top5Count);
    return top5Salaries.reduce((sum, s) => sum + s, 0) / top5Salaries.length;
  }, [employees]);

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `TZS ${(amount / 1000000).toFixed(1)}M`;
    }
    return `TZS ${amount.toLocaleString()}`;
  };

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
          value={formatCurrency(totalEmployerCost)}
          subValue={totalEmployees > 0 ? `${totalEmployees} employees` : 'No data'}
          isPositive={true}
          icon={<TrendingUp size={20} />}
        />
        <MetricCard
          title="Avg. Tax Burden"
          value={`${avgTaxBurden}%`}
          subValue="PAYE Rate"
          isPositive={parseFloat(avgTaxBurden) < 25}
          icon={<PieIcon size={20} />}
        />
        <MetricCard
          title="Net Pay Ratio"
          value={`${netPayRatio}%`}
          subValue="Take-home"
          isPositive={parseFloat(netPayRatio) > 65}
          icon={<BarChart3 size={20} />}
        />
        <MetricCard
          title="Headcount"
          value={totalEmployees.toString()}
          subValue={totalEmployees > 0 ? 'Active' : 'No employees'}
          isPositive={true}
          icon={<Users size={20} />}
        />
      </div>

      {totalEmployees > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cost by Bank (Department Proxy) */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Cost by Bank</h3>
                  <p className="text-xs text-slate-500 mt-1">Total Gross Salary by payment method</p>
                </div>
                <Building className="text-slate-300" size={24} />
              </div>
              <div className="h-[350px] w-full flex flex-col md:flex-row items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costByBank}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {costByBank.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 shrink-0 px-4">
                  {costByBank.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs font-bold text-slate-600">{item.name}</span>
                      <span className="text-xs font-medium text-slate-400">
                        {item.count} emp • {(item.value / 1000000).toFixed(1)}M
                      </span>
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
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => formatCurrency(value)}
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
                  Understanding the spread of compensation across your talent pool.
                  {salaryDistribution.find(s => s.range === '1-3M')?.count > 0 &&
                    ` Most employees fall within the 1M - 3M TZS bracket.`
                  }
                </p>
                <div className="space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Median Basic Pay</p>
                    <p className="text-xl font-bold">{formatCurrency(medianSalary)}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Top 5% Average</p>
                    <p className="text-xl font-bold">{formatCurrency(top5PercentAvg)}</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-2/3 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryDistribution} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="range"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 'bold' }}
                      width={60}
                    />
                    <Tooltip
                      cursor={{ fill: '#ffffff05' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }}
                      formatter={(value: number) => [`${value} employees`, 'Count']}
                    />
                    <Bar
                      dataKey="count"
                      name="Employees"
                      fill="#3b82f6"
                      radius={[0, 8, 8, 0]}
                      barSize={30}
                    >
                      {salaryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.15} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Gross Pay</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(totalGrossPay)}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Net Pay</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(totalNetPay)}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">PAYE Liability</p>
              <p className="text-2xl font-bold text-rose-600 mt-2">{formatCurrency(totalTaxLiability)}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payroll Runs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{payrollRuns.length}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <BarChart3 size={40} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Analytics Data</h3>
          <p className="text-slate-500 max-w-sm mb-8">
            Add employees and run payroll to see workforce analytics and insights.
          </p>
          <a
            href="#/employees"
            className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Users size={16} />
            Add Employees
          </a>
        </div>
      )}
    </div>
  );
};
