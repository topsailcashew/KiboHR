
import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal } from 'lucide-react';
import { MOCK_EMPLOYEES } from '../constants';
import { NewEmployeeModal } from '../components/NewEmployeeModal';
import { EmployeeDetailsModal } from '../components/EmployeeDetailsModal';
import { Employee } from '../types';

export const Employees: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES as Employee[]);

  const handleAddEmployee = (newEmp: Partial<Employee>) => {
    const fullEmp: Employee = {
      ...newEmp,
      id: `emp_${Date.now()}`,
      hasHeslbLoan: false,
      remainingHeslbBalance: 0,
      houseAllowance: 0,
      transportAllowance: 0,
      otherAllowances: 0,
      mobileNumber: '',
      startDate: new Date().toISOString().split('T')[0],
      nssfNumber: 'Pending', // Placeholder for mock
    } as Employee;
    
    setEmployees([fullEmp, ...employees]);
  };

  const handleRowClick = (emp: Employee) => {
    setSelectedEmployee(emp);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Employees</h2>
          <p className="text-slate-500 text-sm">Manage your workforce and their compensation details.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl w-full max-w-xs border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search by name..." className="bg-transparent border-none focus:ring-0 text-sm w-full" />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={16} />
              Filter
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payroll Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Salary</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr 
                  key={emp.id} 
                  onClick={() => handleRowClick(emp)}
                  className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {emp.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{emp.fullName}</p>
                        <p className="text-xs text-slate-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase border border-emerald-100">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700">TIN: {emp.tinNumber}</p>
                      <p className="text-xs text-slate-400">NIDA: {emp.nidaNumber.slice(0, 5)}...{emp.nidaNumber.slice(-4)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-sm font-bold text-slate-900">TZS {(emp.basicPay).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{emp.contractType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-semibold">Showing {employees.length} employees</p>
          <div className="flex gap-2">
            <button disabled className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed">Prev</button>
            <button className="px-4 py-2 bg-blue-600 text-white border border-blue-600 rounded-xl text-xs font-bold shadow-md shadow-blue-200">1</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Next</button>
          </div>
        </div>
      </div>

      <NewEmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddEmployee} 
      />

      <EmployeeDetailsModal 
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
};
