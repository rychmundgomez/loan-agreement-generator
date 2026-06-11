import { useState, useEffect } from 'react';
import { Moon, Sun, FileText, History, PlusCircle } from 'lucide-react';
import LoanForm from './components/LoanForm';
import AgreementPreview from './components/AgreementPreview';
import HistoryPanel from './components/HistoryPanel';
import Toast from './components/Toast';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('lag_dark') === 'true';
  });
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'history'
  const [generatedAgreement, setGeneratedAgreement] = useState(null);
  const [toast, setToast] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('lag_dark', darkMode);
  }, [darkMode]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  const handleGenerated = (agreement) => {
    setGeneratedAgreement(agreement);
    showToast('Agreement generated successfully!');
  };

  const handleEditAgreement = (data) => {
    setEditData(data);
    setActiveTab('form');
    setGeneratedAgreement(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-gray-900 dark:text-white text-sm">
                Loan Agreement Generator
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 block leading-none">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Nav tabs */}
          <nav className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'form'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <PlusCircle size={13} />
              New Agreement
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <History size={13} />
              History
            </button>
          </nav>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'form' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <LoanForm
              onGenerated={handleGenerated}
              showToast={showToast}
              initialData={editData}
              onEditConsumed={() => setEditData(null)}
            />
            <AgreementPreview
              agreement={generatedAgreement}
              showToast={showToast}
            />
          </div>
        ) : (
          <HistoryPanel
            showToast={showToast}
            onEdit={handleEditAgreement}
          />
        )}
      </main>

      {/* Toast */}
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} />}
    </div>
  );
}
