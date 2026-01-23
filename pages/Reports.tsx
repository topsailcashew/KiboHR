
import React, { useState } from 'react';
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
  FileSpreadsheet
} from 'lucide-react';

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status?: 'ready' | 'pending' | 'error';
  onDownload: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, icon, color, status = 'ready', onDownload }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color}`}>
          {icon}
        </div>
        {status === 'ready' ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
            <CheckCircle2 size={10} /> Ready
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
      className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all border border-slate-100"
    >
      <Download size={16} />
      Download .xlsx
    </button>
  </div>
);

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'statutory' | 'banking' | 'internal'>('statutory');

  const handleDownload = (name: string) => {
    // In a real app, this would trigger a service like ReportsGenerator
    console.log(`Generating ${name} report...`);
    alert(`${name} has been generated and is ready for download. In the production version, this would download a formatted Excel file complying with TRA/NSSF/Bank standards.`);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'statutory' && (
          <>
            <ReportCard 
              title="NSSF Member Contributions"
              description="Formatted Excel file for the NSSF portal. Includes Gross Pay, Employee (10%) and Employer (10%) contributions."
              icon={<ShieldCheck size={24} />}
              color="bg-blue-50 text-blue-600"
              onDownload={() => handleDownload('NSSF Monthly Contribution')}
            />
            <ReportCard 
              title="TRA P10 Return"
              description="Monthly PAYE return for TRA. Includes detailed breakdown of taxable income and tax due for each employee."
              icon={<FileText size={24} />}
              color="bg-rose-50 text-rose-600"
              onDownload={() => handleDownload('TRA P10 Return')}
            />
            <ReportCard 
              title="SDL & WCF Report"
              description="Skills Development Levy (3.5%) and Workers Compensation Fund (0.5%) employer contribution details."
              icon={<FileSpreadsheet size={24} />}
              color="bg-amber-50 text-amber-600"
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
              onDownload={() => handleDownload('CRDB Disbursement File')}
            />
            <ReportCard 
              title="NMB Salary Disbursement"
              description="CSV/Excel template for NMB Bank's bulk payment system. Includes required beneficiary name formatting."
              icon={<Landmark size={24} />}
              color="bg-indigo-50 text-indigo-600"
              onDownload={() => handleDownload('NMB Disbursement File')}
            />
            <ReportCard 
              title="M-Pesa B2C Batch"
              description="Mobile money disbursement file for employees receiving salaries via Vodacom M-Pesa."
              icon={<FileText size={24} />}
              color="bg-red-50 text-red-600"
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
              onDownload={() => handleDownload('Payroll Variance Analysis')}
            />
            <ReportCard 
              title="HESLB Compliance Audit"
              description="Summary of all student loan deductions. Reconciles 15% Basic Pay deductions for active loanees."
              icon={<CheckCircle2 size={24} />}
              color="bg-cyan-50 text-cyan-600"
              onDownload={() => handleDownload('HESLB Deduction Audit')}
            />
            <ReportCard 
              title="Cost Center Breakdown"
              description="Full breakdown of employment costs across departments, including all employer statutory burdens."
              icon={<PieChart size={24} />}
              color="bg-slate-50 text-slate-600"
              onDownload={() => handleDownload('Cost Center Report')}
            />
          </>
        )}
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <AlertCircle size={48} className="text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Compliance Check Required</h3>
            <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
              Before submitting reports to TRA or NSSF, please ensure all Employee NIDA numbers and TINs are verified. We've detected 2 missing NSSF numbers in your latest cycle.
            </p>
          </div>
          <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center gap-2 group whitespace-nowrap">
            Fix Issues
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
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
