// Currency formatting
export const formatGHS = (amount) => {
  if (!amount && amount !== 0) return 'GHS 0.00';
  return `GHS ${Number(amount).toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Date formatting
export const formatDate = (dateStr) => {
  if (!dateStr) return '___________';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

// Loan calculations
export const calculateLoan = (loanAmount, interestRate, penaltyRate) => {
  const principal = parseFloat(loanAmount) || 0;
  const interest = parseFloat(interestRate) || 0;
  const penalty = parseFloat(penaltyRate) || 0;

  const interestAmount = principal * (interest / 100);
  const totalRepayment = principal + interestAmount;
  const penaltyAmount = totalRepayment * (penalty / 100);
  const amountAfterPenalty = totalRepayment + penaltyAmount;

  return {
    principal,
    interestAmount,
    totalRepayment,
    penaltyAmount,
    amountAfterPenalty,
  };
};

// Agreement number generation
export const generateAgreementNumber = (existingAgreements = []) => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const todayAgreements = existingAgreements.filter((a) =>
    a.agreementNumber?.includes(dateStr)
  );
  const seq = String(todayAgreements.length + 1).padStart(3, '0');
  return `LAG-${dateStr}-${seq}`;
};

// Local storage helpers
const STORAGE_KEY = 'lag_agreements';

export const saveAgreementToHistory = (agreementData) => {
  try {
    const existing = getAgreementHistory();
    const updated = [agreementData, ...existing].slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
};

export const getAgreementHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const deleteAgreementFromHistory = (id) => {
  try {
    const existing = getAgreementHistory();
    const updated = existing.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
};

// Draft storage
const DRAFT_KEY = 'lag_draft';

export const saveDraft = (formData) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...formData, savedAt: new Date().toISOString() }));
    return true;
  } catch {
    return false;
  }
};

export const loadDraft = () => {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
};
