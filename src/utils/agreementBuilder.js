import { formatGHS, formatDate } from './helpers';

export const buildAgreementText = (data, calculations, agreementNumber) => {
  const today = formatDate(new Date().toISOString().slice(0, 10));

  return {
    agreementNumber,
    generatedDate: today,
    lenderName: data.lenderName,
    lenderPhone: data.lenderPhone,
    lenderAddress: data.lenderAddress,
    borrowerName: data.borrowerName,
    borrowerPhone: data.borrowerPhone,
    borrowerGhanaCard: data.borrowerGhanaCard,
    borrowerAddress: data.borrowerAddress,
    borrowerOccupation: data.borrowerOccupation,
    loanAmount: formatGHS(calculations.principal),
    interestRate: `${data.interestRate}%`,
    interestAmount: formatGHS(calculations.interestAmount),
    totalRepayment: formatGHS(calculations.totalRepayment),
    penaltyRate: `${data.penaltyRate}%`,
    penaltyAmount: formatGHS(calculations.penaltyAmount),
    amountAfterPenalty: formatGHS(calculations.amountAfterPenalty),
    dateLoanGiven: formatDate(data.dateLoanGiven),
    dueDate: formatDate(data.dueDate),
    witnessName: data.witnessName,
    witnessPhone: data.witnessPhone,
    witnessAddress: data.witnessAddress,
  };
};

export const getAgreementBodyText = (a) => `LOAN AGREEMENT

Agreement Number: ${a.agreementNumber}
Date: ${a.generatedDate}

This Agreement is made on ${a.generatedDate}, between:

LENDER
Name: ${a.lenderName}
Phone: ${a.lenderPhone}
Address: ${a.lenderAddress}

BORROWER
Name: ${a.borrowerName}
Phone Number: ${a.borrowerPhone}
Ghana Card Number: ${a.borrowerGhanaCard}
Address: ${a.borrowerAddress}
Occupation: ${a.borrowerOccupation}

The Lender agrees to lend the Borrower the sum of ${a.loanAmount} on ${a.dateLoanGiven}.

The Borrower agrees to repay the loan together with ${a.interestRate} interest, making a total repayment amount of ${a.totalRepayment}.

The repayment shall be made in full on or before ${a.dueDate}.

If the Borrower fails to repay the amount due by the agreed date, a ${a.penaltyRate} penalty shall be applied to the outstanding amount.

The revised total amount payable after the penalty shall be ${a.amountAfterPenalty}.

Should the Borrower fail to settle the outstanding amount after the due date, the Borrower agrees that the Lender may take lawful legal action to recover the debt, including any associated legal and recovery costs.

Both parties confirm that they have read, understood, and agreed to the terms of this Agreement.

LENDER
Name: ${a.lenderName}
Signature: ___________________________
Date: ___________________________

BORROWER
Name: ${a.borrowerName}
Signature: ___________________________
Date: ___________________________

WITNESS
Name: ${a.witnessName}
Phone: ${a.witnessPhone}
Address: ${a.witnessAddress}
Signature: ___________________________
Date: ___________________________`;
