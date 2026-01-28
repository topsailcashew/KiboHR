
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Employee, PayrollResult, PayrollRun, StatutoryRates } from '../types';
import { MOCK_EMPLOYEES, DEFAULT_STATUTORY_RATES } from '../constants';
import { PayrollCalculator } from '../services/payrollCalculator';

// Company Settings Interface
interface CompanySettings {
  legalName: string;
  tinNumber: string;
  website: string;
  phone: string;
  nssfEmployerNumber: string;
  registrationDate: string;
  address: string;
  bankName: string;
  bankShortCode: string;
  bankAccountNumber: string;
  currency: string;
  logo: string | null;
}

// Notification Settings Interface
interface NotificationSettings {
  taxDeadlineReminders: boolean;
  salaryDisbursementStatus: boolean;
  employeeSelfOnboarding: boolean;
}

// Full App State Interface
interface AppState {
  // Employees
  employees: Employee[];
  addEmployee: (employee: Partial<Employee>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;

  // Statutory Rates
  statutoryRates: StatutoryRates;
  updateStatutoryRates: (rates: Partial<StatutoryRates>) => void;

  // Company Settings
  companySettings: CompanySettings;
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;

  // Notification Settings
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;

  // Payroll
  payrollRuns: PayrollRun[];
  currentPayrollResults: PayrollResult[];
  processPayroll: (month: string, year: number) => PayrollResult[];
  submitPayroll: (runId: string) => void;
  getPayrollRun: (id: string) => PayrollRun | undefined;
  getLatestPayrollRun: () => PayrollRun | undefined;

  // Computed Values
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalTaxLiability: number;
  averageNetPay: number;
  totalEmployerCost: number;
  employeesByBank: Record<string, number>;
  employeesByContractType: Record<string, number>;
  salaryDistribution: { range: string; count: number }[];
}

const AppContext = createContext<AppState | undefined>(undefined);

// Default Company Settings
const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  legalName: 'KiboHR Tanzania Ltd',
  tinNumber: '123-456-789',
  website: 'https://kibohr.co.tz',
  phone: '+255 700 000 000',
  nssfEmployerNumber: 'EMP987654321',
  registrationDate: '2020-05-15',
  address: 'Suite 402, Golden Jubilee Towers, Dar es Salaam',
  bankName: 'CRDB Bank PLC',
  bankShortCode: 'CRDB',
  bankAccountNumber: '0150123456789',
  currency: 'TZS',
  logo: null,
};

// Default Notification Settings
const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  taxDeadlineReminders: true,
  salaryDisbursementStatus: true,
  employeeSelfOnboarding: false,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core State
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [statutoryRates, setStatutoryRates] = useState<StatutoryRates>(DEFAULT_STATUTORY_RATES);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(DEFAULT_COMPANY_SETTINGS);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [currentPayrollResults, setCurrentPayrollResults] = useState<PayrollResult[]>([]);

  // Employee CRUD Operations
  const addEmployee = useCallback((employeeData: Partial<Employee>) => {
    const newEmployee: Employee = {
      id: `emp_${Date.now()}`,
      fullName: employeeData.fullName || '',
      email: employeeData.email || '',
      nidaNumber: employeeData.nidaNumber || '',
      tinNumber: employeeData.tinNumber || 'Pending',
      nssfNumber: employeeData.nssfNumber || 'Pending',
      bankAccountNumber: employeeData.bankAccountNumber || '',
      bankShortCode: employeeData.bankShortCode!,
      employmentType: employeeData.employmentType!,
      contractType: employeeData.contractType!,
      basicPay: employeeData.basicPay || 0,
      houseAllowance: employeeData.houseAllowance || 0,
      transportAllowance: employeeData.transportAllowance || 0,
      otherAllowances: employeeData.otherAllowances || 0,
      hasHeslbLoan: employeeData.hasHeslbLoan || false,
      remainingHeslbBalance: employeeData.remainingHeslbBalance || 0,
      mobileNumber: employeeData.mobileNumber || '',
      startDate: employeeData.startDate || new Date().toISOString().split('T')[0],
    };
    setEmployees(prev => [newEmployee, ...prev]);
  }, []);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === id ? { ...emp, ...updates } : emp
    ));
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  }, []);

  const getEmployee = useCallback((id: string) => {
    return employees.find(emp => emp.id === id);
  }, [employees]);

  // Settings Operations
  const updateStatutoryRates = useCallback((rates: Partial<StatutoryRates>) => {
    setStatutoryRates(prev => ({ ...prev, ...rates }));
  }, []);

  const updateCompanySettings = useCallback((settings: Partial<CompanySettings>) => {
    setCompanySettings(prev => ({ ...prev, ...settings }));
  }, []);

  const updateNotificationSettings = useCallback((settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  }, []);

  // Payroll Operations
  const processPayroll = useCallback((month: string, year: number) => {
    const results = employees.map(emp =>
      PayrollCalculator.calculateNetPay(emp, employees.length, statutoryRates)
    );

    setCurrentPayrollResults(results);

    // Create a new payroll run
    const newRun: PayrollRun = {
      id: `run_${Date.now()}`,
      month,
      year,
      isSubmitted: false,
      results,
      processedAt: new Date().toISOString(),
    };

    setPayrollRuns(prev => [newRun, ...prev]);

    return results;
  }, [employees, statutoryRates]);

  const submitPayroll = useCallback((runId: string) => {
    setPayrollRuns(prev => prev.map(run =>
      run.id === runId ? { ...run, isSubmitted: true } : run
    ));
  }, []);

  const getPayrollRun = useCallback((id: string) => {
    return payrollRuns.find(run => run.id === id);
  }, [payrollRuns]);

  const getLatestPayrollRun = useCallback(() => {
    return payrollRuns[0];
  }, [payrollRuns]);

  // Computed Values
  const computedValues = useMemo(() => {
    // Calculate payroll for all employees to get current totals
    const currentResults = employees.map(emp =>
      PayrollCalculator.calculateNetPay(emp, employees.length, statutoryRates)
    );

    const totalGrossPay = currentResults.reduce((sum, r) => sum + r.grossPay, 0);
    const totalNetPay = currentResults.reduce((sum, r) => sum + r.netPay, 0);
    const totalTaxLiability = currentResults.reduce((sum, r) => sum + r.paye, 0);
    const totalEmployerCost = currentResults.reduce((sum, r) => sum + r.totalEmployerCost, 0);
    const averageNetPay = employees.length > 0 ? totalNetPay / employees.length : 0;

    // Group employees by bank
    const employeesByBank = employees.reduce((acc, emp) => {
      acc[emp.bankShortCode] = (acc[emp.bankShortCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group employees by contract type
    const employeesByContractType = employees.reduce((acc, emp) => {
      acc[emp.contractType] = (acc[emp.contractType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Salary distribution
    const salaryRanges = [
      { min: 0, max: 1000000, label: '0-1M' },
      { min: 1000000, max: 3000000, label: '1-3M' },
      { min: 3000000, max: 5000000, label: '3-5M' },
      { min: 5000000, max: Infinity, label: '5M+' },
    ];

    const salaryDistribution = salaryRanges.map(range => ({
      range: range.label,
      count: employees.filter(emp => emp.basicPay >= range.min && emp.basicPay < range.max).length,
    }));

    return {
      totalEmployees: employees.length,
      totalGrossPay,
      totalNetPay,
      totalTaxLiability,
      averageNetPay,
      totalEmployerCost,
      employeesByBank,
      employeesByContractType,
      salaryDistribution,
    };
  }, [employees, statutoryRates]);

  const value: AppState = {
    // Employees
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,

    // Statutory Rates
    statutoryRates,
    updateStatutoryRates,

    // Company Settings
    companySettings,
    updateCompanySettings,

    // Notification Settings
    notificationSettings,
    updateNotificationSettings,

    // Payroll
    payrollRuns,
    currentPayrollResults,
    processPayroll,
    submitPayroll,
    getPayrollRun,
    getLatestPayrollRun,

    // Computed Values
    ...computedValues,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useApp = (): AppState => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Helper hooks for specific functionality
export const useEmployees = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, getEmployee, totalEmployees } = useApp();
  return { employees, addEmployee, updateEmployee, deleteEmployee, getEmployee, totalEmployees };
};

export const usePayroll = () => {
  const {
    payrollRuns,
    currentPayrollResults,
    processPayroll,
    submitPayroll,
    getPayrollRun,
    getLatestPayrollRun,
    employees,
    statutoryRates,
    totalGrossPay,
    totalNetPay,
    totalTaxLiability,
    totalEmployerCost,
  } = useApp();
  return {
    payrollRuns,
    currentPayrollResults,
    processPayroll,
    submitPayroll,
    getPayrollRun,
    getLatestPayrollRun,
    employees,
    statutoryRates,
    totalGrossPay,
    totalNetPay,
    totalTaxLiability,
    totalEmployerCost,
  };
};

export const useSettings = () => {
  const {
    statutoryRates,
    updateStatutoryRates,
    companySettings,
    updateCompanySettings,
    notificationSettings,
    updateNotificationSettings,
  } = useApp();
  return {
    statutoryRates,
    updateStatutoryRates,
    companySettings,
    updateCompanySettings,
    notificationSettings,
    updateNotificationSettings,
  };
};

export const useAnalytics = () => {
  const {
    employees,
    totalEmployees,
    totalGrossPay,
    totalNetPay,
    totalTaxLiability,
    averageNetPay,
    totalEmployerCost,
    employeesByBank,
    employeesByContractType,
    salaryDistribution,
    payrollRuns,
  } = useApp();
  return {
    employees,
    totalEmployees,
    totalGrossPay,
    totalNetPay,
    totalTaxLiability,
    averageNetPay,
    totalEmployerCost,
    employeesByBank,
    employeesByContractType,
    salaryDistribution,
    payrollRuns,
  };
};
