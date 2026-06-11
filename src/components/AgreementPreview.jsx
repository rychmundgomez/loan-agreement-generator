import { useState } from 'react';
import {
  FileText, Download, Printer, Copy, FileDown,
  CheckCircle, Eye
} from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import { generateDOCX } from '../utils/docxGenerator';
import { getAgreementBodyText } from '../utils/agreementBuilder';

export default function AgreementPreview({ agreement, showToast }) {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingDOCX, setLoadingDOCX] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePDF = async () => {
    if (!agreement) return;
    setLoadingPDF(true);
    try {
      await generatePDF(agreement);
      showToast('PDF downloaded successfully!');
    } catch (e) {
      showToast('Failed to generate PDF', 'error');
      console.error(e);
    } finally {
      setLoadingPDF(false);
    }
  };

  const handleDOCX = async () => {
    if (!agreement) return;
    setLoadingDOCX(true);
    try {
      await generateDOCX(agreement);
      showToast('Word document downloaded!');
    } catch (e) {
      showToast('Failed to generate DOCX', 'error');
      console.error(e);
    } finally {
      setLoadingDOCX(false);
    }
  };

  const handleCopy = async () => {
    if (!agreement) return;
    try {
      await navigator.clipboard.writeText(getAgreementBodyText(agreement));
      setCopied(true);
      showToast('Agreement text copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  const handlePrint = () => {
    if (!agreement) return;
    const printContent = document.getElementById('print-area');
    if (!printContent) return;
    const w = window.open('', '_blank');
    w.document.write(`
      <html>
        <head>
          <title>${agreement.agreementNumber}</title>
          <style>
            body { font-family: Georgia, serif; margin: 40px; color: #111; line-height: 1.8; }
            h1 { text-align: center; letter-spacing: 0.1em; color: #1e3a5f; }
            .ref { text-align: center; color: #888; font-size: 12px; margin-bottom: 24px; }
            .section-title { background: #f0f4ff; padding: 6px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; color: #1e3a5f; margin-top: 20px; }
            .field { margin: 6px 0 6px 16px; font-size: 13px; }
            .field strong { color: #666; margin-right: 8px; }
            .terms p { font-size: 13px; margin-bottom: 12px; text-align: justify; }
            .sig { margin-top: 20px; }
            .sig-role { font-weight: bold; color: #1e3a5f; }
            .sig-line { margin: 8px 0; font-size: 13px; }
            .sig-line span { display: inline-block; width: 220px; border-bottom: 1px solid #333; margin-left: 8px; }
            hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
            @page { margin: 1.5cm; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 300);
  };

  if (!agreement) {
    return (
      <div className="card flex flex-col items-center justify-center min-h-[500px] text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
          <FileText size={28} className="text-blue-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No agreement yet
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
          Fill in the form on the left and click <strong>Generate Agreement</strong> to preview the document here.
        </p>
      </div>
    );
  }

  const a = agreement;

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle size={15} className="text-emerald-500" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Agreement Ready</h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button onClick={handleCopy} className="btn-secondary text-xs py-1.5 px-3">
            {copied ? <CheckCircle size={12} className="text-emerald-500" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button onClick={handlePrint} className="btn-secondary text-xs py-1.5 px-3">
            <Printer size={12} />
            Print
          </button>
          <button
            onClick={handleDOCX}
            disabled={loadingDOCX}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            <FileDown size={12} />
            {loadingDOCX ? 'Generating…' : 'DOCX'}
          </button>
          <button
            onClick={handlePDF}
            disabled={loadingPDF}
            className="btn-primary text-xs py-1.5 px-3"
          >
            <Download size={12} />
            {loadingPDF ? 'Generating…' : 'PDF'}
          </button>
        </div>
      </div>

      {/* Document Preview */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <Eye size={15} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Document Preview</span>
          <span className="ml-auto font-mono text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
            {a.agreementNumber}
          </span>
        </div>

        {/* Printable Area */}
        <div
          id="print-area"
          className="p-6 sm:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm leading-relaxed max-h-[72vh] overflow-y-auto"
        >
          {/* Title */}
          <h1 className="text-center text-xl font-bold tracking-widest text-[#1e3a5f] dark:text-blue-300 mb-1 font-serif">
            LOAN AGREEMENT
          </h1>
          <div className="ref text-center text-xs text-gray-400 mb-1">
            Reference: {a.agreementNumber}
          </div>
          <div className="text-center text-xs text-gray-400 mb-6">
            Generated: {a.generatedDate}
          </div>
          <hr className="border-[#1e3a5f]/20 mb-6" />

          <p className="mb-6 text-sm leading-loose">
            This Agreement is made on <strong>{a.generatedDate}</strong>, between:
          </p>

          {/* Lender */}
          <DocSection title="Lender">
            <DocField label="Name" value={a.lenderName} />
            <DocField label="Phone" value={a.lenderPhone} />
            <DocField label="Address" value={a.lenderAddress} />
          </DocSection>

          {/* Borrower */}
          <DocSection title="Borrower">
            <DocField label="Name" value={a.borrowerName} />
            <DocField label="Phone Number" value={a.borrowerPhone} />
            <DocField label="Ghana Card Number" value={a.borrowerGhanaCard} />
            <DocField label="Address" value={a.borrowerAddress} />
            <DocField label="Occupation" value={a.borrowerOccupation} />
          </DocSection>

          {/* Loan */}
          <DocSection title="Loan Details">
            <DocField label="Loan Amount" value={a.loanAmount} />
            <DocField label="Interest Rate" value={a.interestRate} />
            <DocField label="Interest Amount" value={a.interestAmount} />
            <DocField label="Total Repayment" value={a.totalRepayment} />
            <DocField label="Date Funds Given" value={a.dateLoanGiven} />
            <DocField label="Due Date" value={a.dueDate} />
            <DocField label="Penalty Rate" value={a.penaltyRate} />
            <DocField label="Penalty Amount" value={a.penaltyAmount} />
            <DocField label="Amount After Penalty" value={a.amountAfterPenalty} />
          </DocSection>

          {/* Witness */}
          <DocSection title="Witness">
            <DocField label="Name" value={a.witnessName} />
            <DocField label="Phone" value={a.witnessPhone} />
            <DocField label="Address" value={a.witnessAddress} />
          </DocSection>

          <hr className="border-gray-200 dark:border-gray-700 my-6" />

          {/* Body Text */}
          <div className="space-y-4 text-sm leading-loose font-serif text-gray-800 dark:text-gray-200">
            <p>
              The Lender agrees to lend the Borrower the sum of <strong>{a.loanAmount}</strong> on{' '}
              <strong>{a.dateLoanGiven}</strong>.
            </p>
            <p>
              The Borrower agrees to repay the loan together with <strong>{a.interestRate}</strong> interest,
              making a total repayment amount of <strong>{a.totalRepayment}</strong>.
            </p>
            <p>
              The repayment shall be made in full on or before <strong>{a.dueDate}</strong>.
            </p>
            <p>
              If the Borrower fails to repay the amount due by the agreed date, a{' '}
              <strong>{a.penaltyRate}</strong> penalty shall be applied to the outstanding amount. The
              revised total amount payable after the penalty shall be{' '}
              <strong>{a.amountAfterPenalty}</strong>.
            </p>
            <p>
              Should the Borrower fail to settle the outstanding amount after the due date, the Borrower
              agrees that the Lender may take lawful legal action to recover the debt, including any
              associated legal and recovery costs.
            </p>
            <p>
              Both parties confirm that they have read, understood, and agreed to the terms of this
              Agreement.
            </p>
          </div>

          <hr className="border-gray-200 dark:border-gray-700 my-6" />

          {/* Signatures */}
          <h2 className="text-center font-bold tracking-widest text-[#1e3a5f] dark:text-blue-300 text-sm mb-6">
            SIGNATURES
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <SigBlock role="LENDER" name={a.lenderName} />
            <SigBlock role="BORROWER" name={a.borrowerName} />
            <SigBlock role="WITNESS" name={a.witnessName} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DocSection({ title, children }) {
  return (
    <div className="mb-5">
      <div className="section-title bg-[#f0f4ff] dark:bg-blue-900/20 text-[#1e3a5f] dark:text-blue-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded mb-2 border-l-4 border-[#1e3a5f] dark:border-blue-400">
        {title}
      </div>
      <div className="space-y-1 pl-3">{children}</div>
    </div>
  );
}

function DocField({ label, value }) {
  return (
    <div className="field flex gap-2 text-sm">
      <strong className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide min-w-[130px]">
        {label}:
      </strong>
      <span className="text-gray-800 dark:text-gray-200">{value || '—'}</span>
    </div>
  );
}

function SigBlock({ role, name }) {
  return (
    <div className="sig">
      <p className="sig-role font-bold text-[#1e3a5f] dark:text-blue-300 text-sm mb-2">{role}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">Name: {name}</p>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Signature:</span>
        <span className="flex-1 border-b border-gray-400 dark:border-gray-600 h-5" />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Date:</span>
        <span className="w-40 border-b border-gray-400 dark:border-gray-600 h-5" />
      </div>
    </div>
  );
}
