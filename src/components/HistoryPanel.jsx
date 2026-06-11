import { useState, useEffect } from 'react';
import {
  Search, Trash2, Edit3, FileText, Calendar,
  DollarSign, User, ChevronRight, Inbox
} from 'lucide-react';
import {
  getAgreementHistory,
  deleteAgreementFromHistory,
  formatGHS,
  formatDate,
} from '../utils/helpers';

export default function HistoryPanel({ showToast, onEdit }) {
  const [agreements, setAgreements] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = () => setAgreements(getAgreementHistory());

  useEffect(() => {
    load();
  }, []);

  const filtered = agreements.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.borrowerName?.toLowerCase().includes(q) ||
      a.agreementNumber?.toLowerCase().includes(q) ||
      String(a.loanAmount)?.includes(q)
    );
  });

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this agreement from history?')) return;
    deleteAgreementFromHistory(id);
    load();
    if (selected?.id === id) setSelected(null);
    showToast('Agreement deleted', 'info');
  };

  const handleEdit = (agreement) => {
    onEdit(agreement.formData);
    showToast('Agreement loaded for editing', 'info');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* List Panel */}
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Agreement History
          </h2>
          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {agreements.length} total
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or reference…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9 text-xs"
          />
        </div>

        {/* List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-12 text-center">
              <Inbox size={28} className="text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {search ? 'No results found' : 'No agreements saved yet'}
              </p>
            </div>
          ) : (
            filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className={`w-full text-left card p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all ${
                  selected?.id === a.id
                    ? 'border-blue-400 dark:border-blue-600 ring-1 ring-blue-400 dark:ring-blue-600'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {a.borrowerName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                        {a.agreementNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => handleDelete(a.id, e)}
                      className="w-6 h-6 rounded flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                    <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 pl-11">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono font-medium">
                    {formatGHS(a.loanAmount)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(a.createdAt).toLocaleDateString('en-GH', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="lg:col-span-3">
        {selected ? (
          <div className="card overflow-hidden sticky top-20">
            <div className="section-header justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <FileText size={15} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    {selected.borrowerName}
                  </p>
                  <p className="text-xs font-mono text-blue-500">{selected.agreementNumber}</p>
                </div>
              </div>
              <button
                onClick={() => handleEdit(selected)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                <Edit3 size={12} />
                Edit & Re-generate
              </button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5">
              {/* Borrower */}
              <DetailSection title="Borrower" icon={User}>
                <DetailRow label="Name" value={selected.borrowerName} />
                <DetailRow label="Phone" value={selected.borrowerPhone} />
                <DetailRow label="Ghana Card" value={selected.borrowerGhanaCard} />
                <DetailRow label="Address" value={selected.borrowerAddress} />
                <DetailRow label="Occupation" value={selected.borrowerOccupation} />
              </DetailSection>

              {/* Loan */}
              <DetailSection title="Loan" icon={DollarSign}>
                <DetailRow label="Amount" value={formatGHS(selected.loanAmount)} mono />
                <DetailRow label="Interest Rate" value={`${selected.formData?.interestRate}%`} />
                <DetailRow label="Total Repayment" value={selected.totalRepayment} mono />
                <DetailRow label="Penalty Rate" value={`${selected.formData?.penaltyRate}%`} />
                <DetailRow label="Amount After Penalty" value={selected.amountAfterPenalty} mono highlight />
              </DetailSection>

              {/* Dates */}
              <DetailSection title="Dates" icon={Calendar}>
                <DetailRow label="Date Given" value={selected.dateLoanGiven} />
                <DetailRow label="Due Date" value={selected.dueDate} />
                <DetailRow
                  label="Generated"
                  value={new Date(selected.createdAt).toLocaleString('en-GH')}
                />
              </DetailSection>
            </div>
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center min-h-[300px] text-center p-8">
            <FileText size={28} className="text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Select an agreement from the list to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailSection({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className="text-blue-500" />
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 space-y-2 border border-gray-100 dark:border-gray-700/50">
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono = false, highlight = false }) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <span className="text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
      <span
        className={`text-right ${
          highlight
            ? 'font-bold text-blue-600 dark:text-blue-400'
            : mono
            ? 'font-mono text-gray-800 dark:text-gray-200'
            : 'text-gray-800 dark:text-gray-200'
        }`}
      >
        {value || '—'}
      </span>
    </div>
  );
}
