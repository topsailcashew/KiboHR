
import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  Landmark,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  FileSpreadsheet,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status?: 'ready' | 'pending' | 'error';
  disabled?: boolean;
  onDownload: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, icon, color, status = 'ready', disabled, onDownload }) => (
  <div className={`bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex flex-col justify-between ${disabled ? 'opacity-60' : ''}`}>
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color}`}>
          {icon}
        </div>
        {status === 'ready' ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
            <CheckCircle2 size={10} /> Ready
          </span>
        ) : status === 'error' ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full border border-rose-100 uppercase tracking-wider">
            <AlertCircle size={10} /> Error
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 uppercase tracking-wider">
            <Clock size={10} /> Pending
          </span>
        )}
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2 mb-6">{description}</p>
    </div>
    <button
      onClick={onDownload}
      disabled={disabled}
      className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all border border-slate-100 disabled:hover:bg-slate-50 disabled:hover:text-slate-400 disabled:cursor-not-allowed"
    >
      <Download size={16} />
      Download .xlsx
    </button>
  </div>
);

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'statutory' | 'banking' | 'internal'>('statutory');
  const { employees, payrollRuns, totalEmployees, statutoryRates } = useApp();

  // Check compliance issues
  const complianceIssues = useMemo(() => {
    const issues: string[] = [];
    const missingNssf = employees.filter(e => !e.nssfNumber || e.nssfNumber === 'Pending').length;
    const missingTin = employees.filter(e => !e.tinNumber || e.tinNumber === 'Pending').length;
    const missingNida = employees.filter(e => !e.nidaNumber || e.nidaNumber.length !== 20).length;

    if (missingNssf > 0) issues.push(`${missingNssf} missing NSSF number${missingNssf > 1 ? 's' : ''}`);
    if (missingTin > 0) issues.push(`${missingTin} missing TIN number${missingTin > 1 ? 's' : ''}`);
    if (missingNida > 0) issues.push(`${missingNida} invalid NIDA number${missingNida > 1 ? 's' : ''}`);

    return issues;
  }, [employees]);

  const hasPayrollData = payrollRuns.length > 0;
  const latestRun = payrollRuns[0];

  // Get current month/year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const handleDownload = (name: string) => {
    if (!hasPayrollData) {
      alert('No payroll data available. Please run payroll first before generating reports.');
      return;
    }

    // Generate report summary based on actual data
    const totalGross = latestRun.results.reduce((s, r) => s + r.grossPay, 0);
    const totalNssf = latestRun.results.reduce((s, r) => s + r.nssfEmployee + r.nssfEmployer, 0);
    const totalPaye = latestRun.results.reduce((s, r) => s + r.paye, 0);
    const totalSdl = latestRun.results.reduce((s, r) => s + r.sdl, 0);
    const totalWcf = latestRun.results.reduce((s, r) => s + r.wcf, 0);
    const totalNet = latestRun.results.reduce((s, r) => s + r.netPay, 0);

    let reportDetails = '';

    switch (name) {
      case 'NSSF Monthly Contribution':
        reportDetails = `
NSSF Report Summary (${latestRun.month} ${latestRun.year}):
• Total Employees: ${latestRun.results.length}
• Total Gross Pay: TZS ${totalGross.toLocaleString()}
• Employee Contribution (${statutoryRates.nssfRateEmployee * 100}%): TZS ${(totalGross * statutoryRates.nssfRateEmployee).toLocaleString()}
• Employer Contribution (${statutoryRates.nssfRateEmployer * 100}%): TZS ${(totalGross * statutoryRates.nssfRateEmployer).toLocaleString()}
• Total NSSF Due: TZS ${totalNssf.toLocaleString()}`;
        break;

      case 'TRA P10 Return':
        reportDetails = `
TRA P10 Return Summary (${latestRun.month} ${latestRun.year}):
• Total Employees: ${latestRun.results.length}
• Total Taxable Income: TZS ${latestRun.results.reduce((s, r) => s + r.taxableIncome, 0).toLocaleString()}
• Total PAYE Tax Due: TZS ${totalPaye.toLocaleString()}
• Submission Status: ${latestRun.isSubmitted ? 'Submitted' : 'Pending'}`;
        break;

      case 'SDL & WCF Returns':
        reportDetails = `
SDL & WCF Report (${latestRun.month} ${latestRun.year}):
• Total Employees: ${latestRun.results.length}
• SDL (${statutoryRates.sdlRate * 100}%): TZS ${totalSdl.toLocaleString()}
• WCF (${statutoryRates.wcfRate * 100}%): TZS ${totalWcf.toLocaleString()}
• Total Employer Contribution: TZS ${(totalSdl + totalWcf).toLocaleString()}`;
        break;

      case 'CRDB Disbursement File':
      case 'NMB Disbursement File':
        const bankCode = name.includes('CRDB') ? 'CRDB' : 'NMB';
        const bankEmployees = latestRun.results.filter(r => {
          const emp = employees.find(e => e.id === r.employeeId);
          return emp?.bankShortCode === bankCode;
        });
        reportDetails = `
${bankCode} Bank Transfer File (${latestRun.month} ${latestRun.year}):
• Employees Paid via ${bankCode}: ${bankEmployees.length}
• Total Disbursement: TZS ${bankEmployees.reduce((s, r) => s + r.netPay, 0).toLocaleString()}`;
        break;

      default:
        reportDetails = `
Report: ${name}
Period: ${latestRun.month} ${latestRun.year}
• Total Employees: ${latestRun.results.length}
• Total Net Pay: TZS ${totalNet.toLocaleString()}`;
    }

    alert(`${name} has been generated and is ready for download.${reportDetails}\n\nIn production, this would download a formatted Excel file complying with TRA/NSSF/Bank standards.`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Reports & Returns</h2>
          <p className="text-slate-500 mt-2 max-w-lg">
            Generate and export regulatory files for Tanzanian authorities and banking systems.
          </p>
        </div>
        <div className="flex p-1 bg-slate-200/50 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('statutory')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'statutory' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Statutory
          </button>
          <button
            onClick={() => setActiveTab('banking')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'banking' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Banking
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'internal' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Internal
          </button>
        </div>
      </div>

      {/* Status Bar */}
      {hasPayrollData && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <span className="text-sm font-medium text-emerald-800">
              Latest payroll data available: <span className="font-bold">{latestRun.month} {latestRun.year}</span> ({latestRun.results.length} employees)
            </span>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${latestRun.isSubmitted ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-700'}`}>
            {latestRun.isSubmitted ? 'Submitted' : 'Pending Submission'}
          </span>
        </div>
      )}

      {!hasPayrollData && totalEmployees > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
          <Clock className="text-amber-600" size={20} />
          <span className="text-sm font-medium text-amber-800">
            No payroll data available. <a href="#/payroll" className="underline font-bold">Run payroll</a> to generate reports.
          </span>
        </div>
      )}

      {totalEmployees === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
          <Users className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Employees Yet</h3>
          <p className="text-slate-500 mb-4">Add employees and run payroll to generate reports.</p>
          <a href="#/employees" className="text-blue-600 font-bold text-sm hover:underline">Add Employees</a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'statutory' && (
          <>
            <ReportCard
              title="NSSF Member Contributions"
              description={`Formatted Excel file for the NSSF portal. Includes Gross Pay, Employee (${statutoryRates.nssfRateEmployee * 100}%) and Employer (${statutoryRates.nssfRateEmployer * 100}%) contributions.`}
              icon={<ShieldCheck size={24} />}
              color="bg-blue-50 text-blue-600"
              status={hasPayrollData ? 'ready' : 'pending'}
              disabled={!hasPayrollData}
              onDownload={() => handleDownload('NSSF Monthly Contribution')}
            />
            <ReportCard
              title="TRA P10 Return"
              description="Monthly PAYE return for TRA. Includes detailed breakdown of taxable income and tax due for each employee."
              icon={<FileText size={24} />}
              color="bg-rose-50 text-rose-600"
              status={hasPayrollData ? 'ready' : 'pending'}
              disabled={!hasPayrollData}
              onDownload={() => handleDownload('TRA P10 Return')}
            />
            <ReportCard
              title="SDL & WCF Report"
              description={`Skills Development Levy (${statutoryRates.sdlRate * 100}%) and Workers Compensation Fund (${statutoryRates.wcfRate * 100}%) employer contribution details.`}
              icon={<FileSpreadsheet size={24} />}
              color="bg-amber-50 text-amber-600"
              status={hasPayrollData ? 'ready' : 'pending'}
              disabled={!hasPayrollData}
              onDownload={() => handleDownload('SDL & WCF Returns')}
            />
          </>
        )}

        {activeTab === 'banking' && (
          <>
            <ReportCard
              title="CRDB Bulk Transfer"
              description="Standard TISS file format for CRDB Bank bulk salary payments. Validates account numbers (14 digits)."
              icon={<Landmark size={24} />}
              color="bg-emerald-50 text-emerald-600"
              status={hasPayrollData ? 'ready' : 'pending'}
              disabled={!hasPayrollData}
              onDownload={() => handleDownload('CRDB Disbursement File')}
            />
            <ReportCard
              title="NMB Salary Disbursement"
              description="CSV/Excel template for NMB Bank's bulk payment system. Includes required beneficiary name formatting."
              icon={<Landmark size={24} />}
              color="bg-indigo-50 text-indigo-600"
              status={hasPayrollData ? 'ready' : 'pending'}
              disabled={!hasPayrollData}
              onDownload={() => handleDownload('NMB Disbursement File')}
            />
            <ReportCard
              title="M-Pesa B2C Batch"
              description="Mobile money disbursement file for employees receiving salaries via Vodacom M-Pesa."
              icon={<FileText size={24} />}
              color="bg-red-50 text-red-600"
              status={hasPayrollData ? 'ready' : 'pending'}
              disabled={!hasPayrollData}
              onDownload={() => handleDownload('M-Pesa Batch Payment')}
            />
          </>
        )}

        {activeTab === 'internal' && (
          <>
            <ReportCard
              title="Payroll Variance"
              description="Compare current month vs previous month. Highlights salary increases, new hires, and terminations."
              icon={<BarChart3 size={24} />}
              color="bg-purple-50 text-purple-600"
              status={payrollRuns.length >= 2 ? 'ready' : 'pending'}
              disabled={payrollRuns.length < 2}
              onDownload={() => handleDownload('Payroll Variance Analysis')}
            />
            <ReportCard
              title="HESLB Compliance Audit"
              description={`Summary of all student loan deductions. Reconciles ${statutoryRates.heslbRate * 100}% Basic Pay deductions for active loanees.`}
              icon={<CheckCircle2 size={24} />}
              color="bg-cyan-50 text-cyan-600"
              status={hasPayrollData ? 'ready' : 'pending'}
              disabled={!hasPayrollData}
              onDownload={() => handleDownload('HESLB Deduction Audit')}
            />
            <ReportCard
              title="Cost Center Breakdown"
              description="Full breakdown of employment costs across departments, including all employer statutory burdens."
              icon={<PieChart size={24} />}
              color="bg-slate-50 text-slate-600"
              status={hasPayrollData ? 'ready' : 'pending'}
              disabled={!hasPayrollData}
              onDownload={() => handleDownload('Cost Center Report')}
            />
          </>
        )}
      </div>

      {complianceIssues.length > 0 && totalEmployees > 0 && (
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 bg-amber-600 rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <AlertCircle size={48} className="text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Compliance Check Required</h3>
              <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
                Before submitting reports to TRA or NSSF, please verify employee data. Issues found: {complianceIssues.join(', ')}.
              </p>
            </div>
            <a
              href="#/employees"
              className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center gap-2 group whitespace-nowrap"
            >
              Fix Issues
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      )}

      {complianceIssues.length === 0 && totalEmployees > 0 && hasPayrollData && (
        <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center shrink-0">
              <CheckCircle2 size={48} className="text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">All Systems Compliant</h3>
              <p className="text-emerald-100 max-w-2xl text-lg leading-relaxed">
                All employee records are verified. Your {currentMonth} {currentYear} statutory returns are ready for submission.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PieChart: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);
