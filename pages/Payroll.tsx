
import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  Download,
  FileCheck,
  Send,
  FileDown,
  Users,
  History,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { usePayroll } from '../context/AppContext';
import { PayrollResult } from '../types';

export const Payroll: React.FC = () => {
  const {
    employees,
    processPayroll,
    submitPayroll,
    payrollRuns,
    getLatestPayrollRun,
    totalGrossPay,
    totalNetPay,
    totalTaxLiability,
    statutoryRates
  } = usePayroll();

  const [results, setResults] = useState<PayrollResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Get current month/year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
  const currentYear = currentDate.getFullYear();

  // Calculate days until end of month
  const lastDay = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const daysRemaining = lastDay - currentDate.getDate();

  const calculatePayroll = () => {
    if (employees.length === 0) {
      alert('No employees to process. Please add employees first.');
      return;
    }

    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      const payrollResults = processPayroll(currentMonth, currentYear);
      setResults(payrollResults);
      const latestRun = getLatestPayrollRun();
      if (latestRun) {
        setCurrentRunId(latestRun.id);
      }
      setIsProcessing(false);
    }, 1500);
  };

  const handleSubmitToTRA = () => {
    if (currentRunId) {
      submitPayroll(currentRunId);
      alert('Payroll submitted to TRA successfully! P10 return has been marked as submitted.');
    }
  };

  const handleDownloadPayslip = (res: PayrollResult) => {
    const employee = employees.find(e => e.id === res.employeeId);
    if (!employee) return;

    console.log(`Generating individual payslip for ${res.employeeName}...`);
    alert(`Generating official PDF payslip for ${res.employeeName} (${currentMonth} ${currentYear}).\n\nThis document includes:\n• Taxable Income Breakdown\n• Statutory Deductions (NSSF, PAYE, HESLB)\n• Employer Contributions\n• Compliance Watermark`);
  };

  const handleDownloadAll = () => {
    alert(`Generating ${results.length} payslip PDFs for ${currentMonth} ${currentYear}...\n\nAll payslips will be compiled into a ZIP file.`);
  };

  const currentRun = currentRunId ? payrollRuns.find(r => r.id === currentRunId) : null;
  const isSubmitted = currentRun?.isSubmitted || false;

  const totalNetPayCalc = results.reduce((sum, r) => sum + r.netPay, 0);
  const totalTax = results.reduce((sum, r) => sum + r.paye, 0);
  const totalNssf = results.reduce((sum, r) => sum + r.nssfEmployee, 0);
  const totalHeslb = results.reduce((sum, r) => sum + r.heslbDeduction, 0);
  const totalGross = results.reduce((sum, r) => sum + r.grossPay, 0);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/30">
              {currentMonth} {currentYear} Cycle
            </div>
            <span className="text-slate-400">•</span>
            <span className="text-slate-400 text-sm font-medium">{daysRemaining} days remaining</span>
            {isSubmitted && (
              <>
                <span className="text-slate-400">•</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
                  Submitted
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-slate-400 font-medium mb-2">
                {results.length > 0 ? 'Net Disbursement' : 'Estimated Net Disbursement'}
              </p>
              <h1 className="text-5xl font-bold tracking-tight">
                TZS {results.length > 0 ? totalNetPayCalc.toLocaleString() : (totalNetPay > 0 ? totalNetPay.toLocaleString() : '--')}
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                {employees.length} employee{employees.length !== 1 ? 's' : ''} in payroll
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={calculatePayroll}
                disabled={isProcessing || employees.length === 0}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl shadow-blue-500/20"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator size={20} className="group-hover:rotate-12 transition-transform" />
                    Process Payroll
                  </>
                )}
              </button>
              {results.length > 0 && !isSubmitted && (
                <button
                  onClick={handleSubmitToTRA}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-500/20"
                >
                  <Send size={20} />
                  Submit to TRA
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payroll History Toggle */}
      {payrollRuns.length > 0 && (
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <History size={16} />
          Payroll History ({payrollRuns.length} runs)
          {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}

      {/* Payroll History */}
      {showHistory && payrollRuns.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h4 className="text-sm font-bold text-slate-700">Previous Payroll Runs</h4>
          </div>
          <div className="divide-y divide-slate-100">
            {payrollRuns.slice(0, 5).map((run) => (
              <div
                key={run.id}
                onClick={() => {
                  setResults(run.results);
                  setCurrentRunId(run.id);
                }}
                className={`px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors ${currentRunId === run.id ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{run.month} {run.year}</p>
                    <p className="text-xs text-slate-500">
                      {run.results.length} employees • {new Date(run.processedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      TZS {run.results.reduce((s, r) => s + r.netPay, 0).toLocaleString()}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${run.isSubmitted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {run.isSubmitted ? 'Submitted' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Payslip Summary</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadAll}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all border border-slate-200"
                  >
                    <Download size={16} />
                    Download All
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">PAYE (Tax)</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Pay</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((res) => (
                      <tr key={res.employeeId} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{res.employeeName}</p>
                          <p className="text-xs text-slate-500">ID: {res.employeeId}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-medium text-slate-700">TZS {res.grossPay.toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-medium text-rose-600">TZS {res.paye.toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-slate-900">TZS {res.netPay.toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => handleDownloadPayslip(res)}
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm"
                            title="Download Payslip PDF"
                          >
                            <FileDown size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Payroll Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 font-medium">Total Gross Salary</span>
                  <span className="text-sm font-bold text-slate-900">TZS {totalGross.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 font-medium">NSSF (Employee {statutoryRates.nssfRateEmployee * 100}%)</span>
                  <span className="text-sm font-bold text-slate-900">-TZS {totalNssf.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 font-medium">PAYE Tax Liability</span>
                  <span className="text-sm font-bold text-rose-600">-TZS {totalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500 font-medium">HESLB Deductions</span>
                  <span className="text-sm font-bold text-slate-900">-TZS {totalHeslb.toLocaleString()}</span>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900">Net Disbursement</span>
                  <span className="text-xl font-black text-blue-600">TZS {totalNetPayCalc.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <FileCheck size={16} className="text-blue-500" />
                Statutory Files
              </h4>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700 transition-all group">
                  <span className="text-sm font-semibold">NSSF Contribution File</span>
                  <Download size={18} className="text-slate-500 group-hover:text-white" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700 transition-all group">
                  <span className="text-sm font-semibold">TRA P10 Return (Excel)</span>
                  <Download size={18} className="text-slate-500 group-hover:text-white" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700 transition-all group">
                  <span className="text-sm font-semibold">Bank TISS Transfer</span>
                  <Download size={18} className="text-slate-500 group-hover:text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
          {employees.length > 0 ? (
            <>
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Calculator size={40} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Run Payroll?</h3>
              <p className="text-slate-500 max-w-sm mb-8">
                Click the button above to start the calculation engine for the {currentMonth} {currentYear} cycle.
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
                <CheckCircle2 size={16} />
                Compliance Verified: Mainland 2025
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                <Users size={40} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Employees Yet</h3>
              <p className="text-slate-500 max-w-sm mb-8">
                Add employees to your organization before running payroll.
              </p>
              <a
                href="#/employees"
                className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Users size={16} />
                Add Employees
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};
