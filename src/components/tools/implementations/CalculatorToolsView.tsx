import React, { useState, useMemo } from 'react';
import { ToolDefinition } from '../../../types';
import { 
  Calculator, Percent, Calendar, Clock, CreditCard, 
  Receipt, Tag, Compass, Sparkles, ArrowRight, Table 
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { 
  calculateEmi, 
  calculateGst, 
  calculateExactAge, 
  calculateDateDifference, 
  convertLandArea, 
  LAND_CONVERSION_FACTORS 
} from '../../../services/toolEngine/calculatorEngine';

interface CalculatorToolsViewProps {
  tool: ToolDefinition;
}

export const CalculatorToolsView: React.FC<CalculatorToolsViewProps> = ({ tool }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // 1. Percentage State
  const [percX, setPercX] = useState<number>(18);
  const [percY, setPercY] = useState<number>(500);

  // 2. Age State
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');

  // 3. Date Difference State
  const [dateStart, setDateStart] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState<string>(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [isInclusive, setIsInclusive] = useState<boolean>(false);

  // 4. EMI State
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(10);

  // 5. GST State
  const [gstAmount, setGstAmount] = useState<number>(1000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  // 6. Discount State
  const [originalPrice, setOriginalPrice] = useState<number>(1500);
  const [discountPercent, setDiscountPercent] = useState<number>(20);

  // 7. Land Area Unit Converter State
  const [unitVal, setUnitVal] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('acre');
  const [toUnit, setToUnit] = useState<string>('bigha_up');

  // Calculations using production calculatorEngine
  const emiData = useMemo(() => {
    return calculateEmi(loanAmount, interestRate, tenureYears);
  }, [loanAmount, interestRate, tenureYears]);

  const gstData = useMemo(() => {
    return calculateGst(gstAmount, gstRate, gstType);
  }, [gstAmount, gstRate, gstType]);

  const ageData = useMemo(() => {
    try {
      return calculateExactAge(birthDate);
    } catch {
      return null;
    }
  }, [birthDate]);

  const dateDiffData = useMemo(() => {
    try {
      return calculateDateDifference(dateStart, dateEnd, isInclusive);
    } catch {
      return null;
    }
  }, [dateStart, dateEnd, isInclusive]);

  const landAreaResult = useMemo(() => {
    return convertLandArea(unitVal, fromUnit, toUnit);
  }, [unitVal, fromUnit, toUnit]);

  return (
    <div className="space-y-6">
      {/* 1. PERCENTAGE CALCULATOR */}
      {tool.slug === 'percentage-calculator' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              What is X% of Y?
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">What is</span>
                <input
                  type="number"
                  value={percX}
                  onChange={(e) => setPercX(parseFloat(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">% of</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={percY}
                  onChange={(e) => setPercY(parseFloat(e.target.value) || 0)}
                  className="w-28 px-3 py-1.5 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">=</span>
              </div>
              <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                {((percX / 100) * percY).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              X is what percent of Y?
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="number"
                value={percX}
                onChange={(e) => setPercX(parseFloat(e.target.value) || 0)}
                className="w-20 px-3 py-1.5 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">is what % of</span>
              <input
                type="number"
                value={percY}
                onChange={(e) => setPercY(parseFloat(e.target.value) || 0)}
                className="w-28 px-3 py-1.5 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">=</span>
              <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                {percY > 0 ? ((percX / percY) * 100).toFixed(2) : 0}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. AGE CALCULATOR */}
      {tool.slug === 'age-calculator' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {isHindi ? 'जन्म तिथि चुनें:' : 'Select Date of Birth:'}
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
            />
          </div>

          {ageData && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-center">
                  <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Years</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{ageData.years}</span>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-center">
                  <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Months</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{ageData.months}</span>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-center">
                  <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Days</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{ageData.days}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Day of Week Born:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{ageData.dayOfWeekBorn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Days Lived:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{ageData.totalDays.toLocaleString()} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Hours:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{ageData.totalHours.toLocaleString()} Hours</span>
                </div>
                <div className="flex justify-between text-blue-600 dark:text-blue-400 font-bold">
                  <span>Days to Next Birthday:</span>
                  <span>{ageData.daysUntilNextBirthday} Days ({ageData.nextBirthdayDayOfWeek})</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. DATE DIFFERENCE */}
      {tool.slug === 'date-difference' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Start Date
              </label>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                End Date
              </label>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={isInclusive}
              onChange={(e) => setIsInclusive(e.target.checked)}
              className="rounded accent-blue-600"
            />
            <span>Include end date in calculation (Inclusive)</span>
          </label>

          {dateDiffData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
                <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Total Days</span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{dateDiffData.totalDays}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
                <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Total Weeks</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-200">{dateDiffData.totalWeeks}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
                <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Business Days</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{dateDiffData.businessDays}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
                <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Years / Months</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1 block">
                  {dateDiffData.years}y {dateDiffData.months}m {dateDiffData.days}d
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. EMI CALCULATOR */}
      {tool.slug === 'emi-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(1000, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Loan Tenure (Years)
              </label>
              <input
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-center">
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Monthly EMI</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                ₹{emiData.monthlyEmi.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Total Interest Payable</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                ₹{emiData.totalInterest.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Total Payment (P + I)</span>
              <span className="text-xl font-black text-slate-800 dark:text-slate-200">
                ₹{emiData.totalPayment.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Amortization Snapshot Table */}
          {emiData.amortizationPreview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Table className="w-3.5 h-3.5" />
                <span>Annual Amortization Schedule (First {emiData.amortizationPreview.length} Years)</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold">
                    <tr>
                      <th className="p-2.5">Year</th>
                      <th className="p-2.5">Principal Paid</th>
                      <th className="p-2.5">Interest Paid</th>
                      <th className="p-2.5">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
                    {emiData.amortizationPreview.map(row => (
                      <tr key={row.year} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                        <td className="p-2.5 font-bold">Year {row.year}</td>
                        <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-medium">₹{row.principalPaid.toLocaleString()}</td>
                        <td className="p-2.5 text-amber-600 dark:text-amber-400 font-medium">₹{row.interestPaid.toLocaleString()}</td>
                        <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">₹{row.remainingBalance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. GST CALCULATOR */}
      {tool.slug === 'gst-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                value={gstAmount}
                onChange={(e) => setGstAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                GST Rate (%)
              </label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              >
                <option value={5}>5% (Basic Goods)</option>
                <option value={12}>12% (Standard)</option>
                <option value={18}>18% (Services & General)</option>
                <option value={28}>28% (Luxury / Sin)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Calculation Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGstType('exclusive')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    gstType === 'exclusive'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  GST Exclusive
                </button>
                <button
                  onClick={() => setGstType('inclusive')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    gstType === 'inclusive'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  GST Inclusive
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Net Amount (Excl. Tax):</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">₹{gstData.netAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total GST ({gstRate}%):</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">₹{gstData.gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pl-4">
              <span>CGST ({(gstRate / 2).toFixed(1)}%):</span>
              <span>₹{gstData.cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pl-4">
              <span>SGST ({(gstRate / 2).toFixed(1)}%):</span>
              <span>₹{gstData.sgst.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between text-sm font-black text-blue-600 dark:text-blue-400">
              <span>Final Total Amount:</span>
              <span>₹{gstData.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. DISCOUNT CALCULATOR */}
      {tool.slug === 'discount-calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center">
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">You Save</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ₹{((originalPrice * discountPercent) / 100).toFixed(2)}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-center">
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Final Price to Pay</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                ₹{(originalPrice - (originalPrice * discountPercent) / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 7. LAND AREA / UNIT CONVERTER */}
      {tool.slug === 'unit-converter' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Value to Convert
              </label>
              <input
                type="number"
                value={unitVal}
                onChange={(e) => setUnitVal(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                From Unit
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-medium"
              >
                <option value="acre">Acre (43,560 sq ft)</option>
                <option value="bigha_up">Bigha (Standard UP - 27,225 sq ft)</option>
                <option value="guntha">Guntha (1,089 sq ft / 121 sq yd)</option>
                <option value="biswa">Biswa (1,361.25 sq ft)</option>
                <option value="hectare">Hectare (107,639 sq ft)</option>
                <option value="sqft">Square Feet (sq ft)</option>
                <option value="sqyard">Square Yard / Gaj (9 sq ft)</option>
                <option value="sqmeter">Square Meter</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                To Unit
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-medium"
              >
                <option value="bigha_up">Bigha (Standard UP - 27,225 sq ft)</option>
                <option value="acre">Acre (43,560 sq ft)</option>
                <option value="guntha">Guntha (1,089 sq ft / 121 sq yd)</option>
                <option value="biswa">Biswa (1,361.25 sq ft)</option>
                <option value="hectare">Hectare (107,639 sq ft)</option>
                <option value="sqft">Square Feet (sq ft)</option>
                <option value="sqyard">Square Yard / Gaj (9 sq ft)</option>
                <option value="sqmeter">Square Meter</option>
              </select>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-center">
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Exact Converted Area</span>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {landAreaResult.toLocaleString()} <span className="text-base font-bold text-slate-600 dark:text-slate-300 capitalize">{toUnit.replace('_up', ' (UP)')}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Formula: {unitVal} {fromUnit} = {(unitVal * (LAND_CONVERSION_FACTORS[fromUnit] || 1)).toLocaleString()} sq ft
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
