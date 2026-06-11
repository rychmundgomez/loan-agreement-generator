import { useEffect, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  User, Phone, MapPin, CreditCard, Briefcase,
  DollarSign, Percent, Calendar, Users, RotateCcw,
  Save, Zap, Calculator
} from 'lucide-react';
import {
  calculateLoan,
  formatGHS,
  generateAgreementNumber,
  saveAgreementToHistory,
  getAgreementHistory,
  saveDraft,
  loadDraft,
  clearDraft,
} from '../utils/helpers';
import { buildAgreementText } from '../utils/agreementBuilder';

const DEFAULT_VALUES = {
  lenderName: 'Richmond Makafui Gamor',
  lenderPhone: '',
  lenderAddress: '',
  borrowerName: '',
  borrowerPhone: '',
  borrowerGhanaCard: '',
  borrowerAddress: '',
  borrowerOccupation: '',
  loanAmount: '',
  interestRate: '',
  dateLoanGiven: '',
  dueDate: '',
  penaltyRate: '15',
  witnessName: '',
  witnessPhone: '',
  witnessAddress: '',
};

const InputField = ({ label, name, register, errors, placeholder, type = 'text', icon: Icon, rules = {} }) => (
  <div>
    <label className="form-label">{label}</label>
    <div className="relative">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={14} />
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className={`form-input ${Icon ? 'pl-9' : ''} ${errors[name] ? 'border-red-400 focus:ring-red-400' : ''}`}
      />
    </div>
    {errors[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name].message || 'This field is required'}</p>
    )}
  </div>
);

const SectionCard = ({ title, icon: Icon, color = 'blue', children }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400',
    green: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
  };

  return (
    <div className="card overflow-hidden">
      <div className="section-header">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon size={15} />
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{title}</h3>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
};

export default function LoanForm({ onGenerated, showToast, initialData, onEditConsumed }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES });

  const watched = useWatch({ control });

  // Load draft or initial edit data on mount
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([k, v]) => setValue(k, v));
      onEditConsumed?.();
      return;
    }
    const draft = loadDraft();
    if (draft) {
      const { savedAt, ...fields } = draft;
      Object.entries(fields).forEach(([k, v]) => setValue(k, v));
    }
  }, [initialData]);

  const calcs = calculateLoan(watched.loanAmount, watched.interestRate, watched.penaltyRate);

  const handleReset = () => {
    reset(DEFAULT_VALUES);
    clearDraft();
    showToast('Form cleared', 'info');
  };

  const handleSaveDraft = () => {
    saveDraft(watched);
    showToast('Draft saved locally');
  };

  const onSubmit = (data) => {
    const history = getAgreementHistory();
    const agreementNumber = generateAgreementNumber(history);
    const agreement = buildAgreementText(data, calcs, agreementNumber);

    // Save to history
    saveAgreementToHistory({
      id: Date.now().toString(),
      agreementNumber,
      createdAt: new Date().toISOString(),
      borrowerName: data.borrowerName,
      loanAmount: data.loanAmount,
      formData: data,
      ...agreement,
    });

    clearDraft();
    onGenerated(agreement);
  };

  const CalcRow = ({ label, value, highlight = false, accent = false }) => (
    <div className={`calc-row border-b border-gray-100 dark:border-gray-700/50 last:border-0 ${highlight ? 'font-semibold' : ''}`}>
      <span className={`text-xs ${highlight ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
        {label}
      </span>
      <span className={`font-mono text-xs ${accent ? 'text-blue-600 dark:text-blue-400 font-bold' : highlight ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">New Agreement</h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleSaveDraft} className="btn-secondary text-xs py-1.5 px-3">
            <Save size={12} />
            Save Draft
          </button>
          <button type="button" onClick={handleReset} className="btn-secondary text-xs py-1.5 px-3">
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Lender */}
        <SectionCard title="Lender Details" icon={User} color="blue">
          <div className="sm:col-span-2">
            <InputField
              label="Full Name"
              name="lenderName"
              register={register}
              errors={errors}
              icon={User}
              placeholder="e.g. Richmond Makafui Gamor"
              rules={{ required: true }}
            />
          </div>
          <InputField
            label="Phone Number"
            name="lenderPhone"
            register={register}
            errors={errors}
            icon={Phone}
            placeholder="+233 XX XXX XXXX"
            rules={{ required: true }}
          />
          <InputField
            label="Address"
            name="lenderAddress"
            register={register}
            errors={errors}
            icon={MapPin}
            placeholder="Accra, Ghana"
            rules={{ required: true }}
          />
        </SectionCard>

        {/* Borrower */}
        <SectionCard title="Borrower Details" icon={Users} color="purple">
          <div className="sm:col-span-2">
            <InputField
              label="Full Name"
              name="borrowerName"
              register={register}
              errors={errors}
              icon={User}
              placeholder="Borrower's full name"
              rules={{ required: true }}
            />
          </div>
          <InputField
            label="Phone Number"
            name="borrowerPhone"
            register={register}
            errors={errors}
            icon={Phone}
            placeholder="+233 XX XXX XXXX"
            rules={{ required: true }}
          />
          <InputField
            label="Ghana Card Number"
            name="borrowerGhanaCard"
            register={register}
            errors={errors}
            icon={CreditCard}
            placeholder="GHA-XXXXXXXXX-X"
            rules={{ required: true }}
          />
          <div className="sm:col-span-2">
            <InputField
              label="Residential Address"
              name="borrowerAddress"
              register={register}
              errors={errors}
              icon={MapPin}
              placeholder="Borrower's home address"
              rules={{ required: true }}
            />
          </div>
          <div className="sm:col-span-2">
            <InputField
              label="Occupation"
              name="borrowerOccupation"
              register={register}
              errors={errors}
              icon={Briefcase}
              placeholder="e.g. Teacher, Trader, Nurse"
              rules={{ required: true }}
            />
          </div>
        </SectionCard>

        {/* Loan Details */}
        <SectionCard title="Loan Details" icon={DollarSign} color="green">
          <InputField
            label="Loan Amount (GHS)"
            name="loanAmount"
            register={register}
            errors={errors}
            icon={DollarSign}
            type="number"
            placeholder="e.g. 5000"
            rules={{ required: true, min: { value: 1, message: 'Must be greater than 0' } }}
          />
          <InputField
            label="Interest Rate (%)"
            name="interestRate"
            register={register}
            errors={errors}
            icon={Percent}
            type="number"
            placeholder="e.g. 10"
            rules={{ required: true, min: { value: 0, message: 'Cannot be negative' } }}
          />
          <InputField
            label="Date Loan Is Given"
            name="dateLoanGiven"
            register={register}
            errors={errors}
            icon={Calendar}
            type="date"
            rules={{ required: true }}
          />
          <InputField
            label="Due Date"
            name="dueDate"
            register={register}
            errors={errors}
            icon={Calendar}
            type="date"
            rules={{ required: true }}
          />
          <div className="sm:col-span-2">
            <InputField
              label="Penalty Rate (%)"
              name="penaltyRate"
              register={register}
              errors={errors}
              icon={Percent}
              type="number"
              placeholder="e.g. 15"
              rules={{ required: true, min: { value: 0, message: 'Cannot be negative' } }}
            />
          </div>

          {/* Live Calculator */}
          {calcs.principal > 0 && (
            <div className="sm:col-span-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Calculator size={13} className="text-blue-500" />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Live Calculations
                </span>
              </div>
              <div className="space-y-0.5">
                <CalcRow label="Principal" value={formatGHS(calcs.principal)} />
                <CalcRow label={`Interest (${watched.interestRate || 0}%)`} value={formatGHS(calcs.interestAmount)} />
                <CalcRow label="Total Repayment" value={formatGHS(calcs.totalRepayment)} highlight />
                <CalcRow label={`Penalty (${watched.penaltyRate || 0}%)`} value={formatGHS(calcs.penaltyAmount)} />
                <CalcRow label="Amount After Penalty" value={formatGHS(calcs.amountAfterPenalty)} highlight accent />
              </div>
            </div>
          )}
        </SectionCard>

        {/* Witness */}
        <SectionCard title="Witness Details" icon={User} color="orange">
          <div className="sm:col-span-2">
            <InputField
              label="Full Name"
              name="witnessName"
              register={register}
              errors={errors}
              icon={User}
              placeholder="Witness full name"
              rules={{ required: true }}
            />
          </div>
          <InputField
            label="Phone Number"
            name="witnessPhone"
            register={register}
            errors={errors}
            icon={Phone}
            placeholder="+233 XX XXX XXXX"
            rules={{ required: true }}
          />
          <InputField
            label="Address"
            name="witnessAddress"
            register={register}
            errors={errors}
            icon={MapPin}
            placeholder="Witness address"
            rules={{ required: true }}
          />
        </SectionCard>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center py-3 text-sm"
        >
          <Zap size={15} />
          {isSubmitting ? 'Generating…' : 'Generate Agreement'}
        </button>
      </form>
    </div>
  );
}
