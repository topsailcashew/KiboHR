
import { Employee, PayrollResult, StatutoryRates, EmploymentType } from '../types';
import { DEFAULT_STATUTORY_RATES } from '../constants';

export class PayrollCalculator {
  static calculateNetPay(
    employee: Employee, 
    companyEmployeeCount: number,
    rates: StatutoryRates = DEFAULT_STATUTORY_RATES
  ): PayrollResult {
    // Step 1: Gross Income
    const grossPay = employee.basicPay + 
                     employee.houseAllowance + 
                     employee.transportAllowance + 
                     employee.otherAllowances;

    // Step 2: NSSF Deduction (First Charge)
    const nssfEmployee = grossPay * rates.nssfRateEmployee;
    const taxableIncome = grossPay - nssfEmployee;

    // Step 3: PAYE (July 2025 Mainland Tax Bands)
    let paye = 0;
    if (employee.employmentType === EmploymentType.SECONDARY) {
      paye = taxableIncome * 0.30;
    } else {
      paye = this.calculatePAYE(taxableIncome);
    }

    // Step 4: HESLB (Student Loan)
    let heslbDeduction = 0;
    if (employee.hasHeslbLoan) {
      const calculatedHeslb = employee.basicPay * rates.heslbRate;
      heslbDeduction = Math.min(calculatedHeslb, employee.remainingHeslbBalance);
    }

    // Step 5: Employer Contributions
    // SDL: Only if >= 10 employees
    const sdl = companyEmployeeCount >= 10 ? grossPay * rates.sdlRate : 0;
    const wcf = grossPay * rates.wcfRate;
    const nssfEmployer = grossPay * rates.nssfRateEmployer;

    // Step 6: Net Pay
    const netPay = grossPay - nssfEmployee - paye - heslbDeduction;
    const totalEmployerCost = grossPay + sdl + wcf + nssfEmployer;

    return {
      employeeId: employee.id,
      employeeName: employee.fullName,
      grossPay,
      nssfEmployee,
      taxableIncome,
      paye,
      heslbDeduction,
      sdl,
      wcf,
      nssfEmployer,
      netPay,
      totalEmployerCost
    };
  }

  private static calculatePAYE(taxableIncome: number): number {
    /**
     * July 2025 Mainland Tax Bands:
     * 0 - 270,000 TZS: 0%
     * 270,001 - 520,000 TZS: 8% on excess of 270k
     * 520,001 - 760,000 TZS: 20,000 + 20% on excess of 520k
     * 760,001 - 1,000,000 TZS: 68,000 + 25% on excess of 760k
     * Over 1,000,000 TZS: 128,000 + 30% on excess of 1m
     */
    if (taxableIncome <= 270000) return 0;
    if (taxableIncome <= 520000) return (taxableIncome - 270000) * 0.08;
    if (taxableIncome <= 760000) return 20000 + (taxableIncome - 520000) * 0.20;
    if (taxableIncome <= 1000000) return 68000 + (taxableIncome - 760000) * 0.25;
    return 128000 + (taxableIncome - 1000000) * 0.30;
  }
}
