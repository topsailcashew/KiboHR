
import React from 'react';
import { X, User, Briefcase, Landmark, ShieldCheck, Mail, Phone, Calendar, CreditCard, Receipt, Edit3 } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeDetailsModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (employee: Employee) => void;
}

const DetailSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
      <div className="text-blue-600">{icon}</div>
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h4>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
      {children}
    </div>
  </div>
);

const DetailItem: React.FC<{ label: string; value: string | number | React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
    <div className="text-sm font-semibold text-slate-900">{value}</div>
  </div>
);

export const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({ employee, isOpen, onClose, onEdit }) => {
  if (!isOpen || !employee) return null;

  const grossPay = employee.basicPay + employee.houseAllowance + employee.transportAllowance + employee.otherAllowances;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 py-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-200">
              {employee.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{employee.fullName}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><Mail size={14} /> {employee.email}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {new Date(employee.startDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-200 shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          <DetailSection title="Personal Information" icon={<User size={16} />}>
            <DetailItem label="Full Name" value={employee.fullName} />
            <DetailItem label="Mobile Number" value={employee.mobileNumber || 'Not provided'} />
            <DetailItem label="NIDA Number" value={employee.nidaNumber} />
            <DetailItem label="Email Address" value={employee.email} />
          </DetailSection>

          <DetailSection title="Employment Details" icon={<Briefcase size={16} />}>
            <DetailItem label="Contract Type" value={<span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100 uppercase">{employee.contractType}</span>} />
            <DetailItem label="Employment Type" value={<span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 uppercase">{employee.employmentType}</span>} />
            <DetailItem label="Basic Pay (Monthly)" value={`TZS ${employee.basicPay.toLocaleString()}`} />
            <DetailItem label="Start Date" value={new Date(employee.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
          </DetailSection>

          <DetailSection title="Compensation Summary" icon={<CreditCard size={16} />}>
            <DetailItem label="Basic Pay" value={`TZS ${employee.basicPay.toLocaleString()}`} />
            <DetailItem label="House Allowance" value={`TZS ${employee.houseAllowance.toLocaleString()}`} />
            <DetailItem label="Transport Allowance" value={`TZS ${employee.transportAllowance.toLocaleString()}`} />
            <DetailItem label="Other Allowances" value={`TZS ${employee.otherAllowances.toLocaleString()}`} />
            <div className="md:col-span-2 pt-2 border-t border-slate-100 mt-2">
              <DetailItem
                label="Total Gross Pay"
                value={<span className="text-lg text-blue-600">TZS {grossPay.toLocaleString()}</span>}
              />
            </div>
          </DetailSection>

          <DetailSection title="Statutory Information" icon={<ShieldCheck size={16} />}>
            <DetailItem label="TIN Number" value={employee.tinNumber} />
            <DetailItem label="NSSF Number" value={employee.nssfNumber} />
            <DetailItem label="HESLB Loan Status" value={employee.hasHeslbLoan ? <span className="text-rose-600">Active Deduction (15%)</span> : 'No Active Loan'} />
            {employee.hasHeslbLoan && (
              <DetailItem label="Remaining HESLB Balance" value={`TZS ${employee.remainingHeslbBalance.toLocaleString()}`} />
            )}
          </DetailSection>

          <DetailSection title="Financial & Banking" icon={<Landmark size={16} />}>
            <DetailItem label="Bank Name" value={employee.bankShortCode} />
            <DetailItem label="Account Number" value={employee.bankAccountNumber} />
          </DetailSection>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
          <button className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Receipt size={18} />
            Generate Statement
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(employee)}
              className="flex-[2] px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Edit3 size={18} />
              Edit Employee
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
