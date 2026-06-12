import jsPDF from 'jspdf';

export const generatePDF = (agreementData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  const pageNum = { current: 1 };

  const addPage = () => {
    doc.addPage();
    pageNum.current++;
    y = margin;
    addHeader();
  };

  const checkPageBreak = (needed = 10) => {
    if (y + needed > pageH - margin - 10) {
      addPage();
    }
  };

  const addHeader = () => {
    // Header bar
    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, pageW, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`LOAN AGREEMENT  |  Ref: ${agreementData.agreementNumber}`, margin, 8);
    doc.text(`Page ${pageNum.current}`, pageW - margin, 8, { align: 'right' });
    doc.setTextColor(0, 0, 0);
  };

  const line = (x1, y1, x2, y2, color = [200, 200, 200]) => {
    doc.setDrawColor(...color);
    doc.line(x1, y1, x2, y2);
    doc.setDrawColor(0, 0, 0);
  };

  const sectionTitle = (title) => {
    checkPageBreak(14);
    doc.setFillColor(243, 246, 253);
    doc.roundedRect(margin, y, contentW, 8, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 95);
    doc.text(title.toUpperCase(), margin + 3, y + 5.5);
    doc.setTextColor(0, 0, 0);
    y += 11;
  };

  const field = (label, value, indent = 0) => {
    checkPageBreak(11);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(120, 120, 140);
    doc.text(label, margin + indent, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 50);
    const lines = doc.splitTextToSize(value || '—', contentW - indent - 45);
    doc.text(lines, margin + indent + 45, y);
    y += lines.length * 5.5 + 1;
  };

  const bodyText = (text) => {
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 60);
    const lines = doc.splitTextToSize(text, contentW);
    lines.forEach((line_text) => {
      checkPageBreak(7);
      doc.text(line_text, margin, y);
      y += 6;
    });
  };

  const signatureBlock = (role, name) => {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 95);
    doc.text(role, margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 60);
    doc.text(`Name: ${name}`, margin, y);
    y += 8;
    doc.text('Signature:', margin, y);
    line(margin + 22, y, margin + 90, y, [80, 80, 80]);
    y += 7;
    doc.text('Date:', margin, y);
    line(margin + 14, y, margin + 70, y, [80, 80, 80]);
    y += 10;
  };

  const a = agreementData;

  // ── Page 1 ──────────────────────────────
  addHeader();
  y = 20;

  // Title block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 95);
  doc.text('LOAN AGREEMENT', pageW / 2, y, { align: 'center' });
  y += 7;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 140);
  doc.text(`Reference: ${a.agreementNumber}`, pageW / 2, y, { align: 'center' });
  y += 4;
  doc.text(`Generated: ${a.generatedDate}`, pageW / 2, y, { align: 'center' });
  y += 8;
  line(margin, y, pageW - margin, y, [30, 58, 95]);
  y += 8;

  // Intro
  bodyText(`This Agreement is made on ${a.generatedDate}, between:`);
  y += 3;

  // Lender
  sectionTitle('Lender');
  field('Name:', a.lenderName);
  field('Phone:', a.lenderPhone);
  field('Address:', a.lenderAddress);
  y += 3;

  // Borrower
  sectionTitle('Borrower');
  field('Name:', a.borrowerName);
  field('Phone:', a.borrowerPhone);
  field('Ghana Card No:', a.borrowerGhanaCard);
  field('Address:', a.borrowerAddress);
  field('Occupation:', a.borrowerOccupation);
  y += 3;

  // Loan Details
  sectionTitle('Loan Details');
  field('Loan Amount:', a.loanAmount);
  field('Interest Rate:', a.interestRate);
  field('Interest Amount:', a.interestAmount);
  field('Total Repayment:', a.totalRepayment);
  field('Date Funds Given:', a.dateLoanGiven);
  field('Due Date:', a.dueDate);
  field('Penalty Rate:', a.penaltyRate);
  field('Penalty Amount:', a.penaltyAmount);
  field('Amount After Penalty:', a.amountAfterPenalty);
  y += 3;

  // Witness
  sectionTitle('Witness');
  field('Name:', a.witnessName);
  field('Phone:', a.witnessPhone);
  field('Address:', a.witnessAddress);
  y += 5;

  // Terms
  checkPageBreak(20);
  line(margin, y, pageW - margin, y);
  y += 8;
  sectionTitle('Terms and Conditions');

  bodyText(`The Lender agrees to lend the Borrower the sum of ${a.loanAmount} on ${a.dateLoanGiven}.`);
  y += 2;

  bodyText(`The Borrower agrees to repay the loan together with ${a.interestRate} interest, making a total repayment amount of ${a.totalRepayment}.`);
  y += 2;

  bodyText(`The repayment shall be made in full on or before ${a.dueDate}.`);
  y += 2;

  bodyText(`If the Borrower fails to repay the amount due by the agreed date, a ${a.penaltyRate} penalty shall be applied to the outstanding amount. The revised total amount payable after the penalty shall be ${a.amountAfterPenalty}.`);
  y += 2;

  bodyText(`Should the Borrower fail to settle the outstanding amount after the due date, the Borrower agrees that the Lender may take lawful legal action to recover the debt, including any associated legal and recovery costs.`);
  y += 2;

  bodyText(`Both parties confirm that they have read, understood, and agreed to the terms of this Agreement.`);
  y += 6;

  // Signatures
  line(margin, y, pageW - margin, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 95);
  doc.text('SIGNATURES', pageW / 2, y, { align: 'center' });
  y += 8;

  signatureBlock('LENDER', a.lenderName);
  y += 2;
  signatureBlock('BORROWER', a.borrowerName);
  y += 2;
  signatureBlock('WITNESS', a.witnessName);

  // Footer
  const totalPages = pageNum.current;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(30, 58, 95);
    doc.rect(0, pageH - 10, pageW, 10, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(180, 200, 230);
    doc.text('CONFIDENTIAL — For authorized parties only', margin, pageH - 4);
    doc.text(`${a.agreementNumber}`, pageW - margin, pageH - 4, { align: 'right' });
  }

  doc.save(`${a.agreementNumber}.pdf`);
};
