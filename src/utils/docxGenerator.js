import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
} from 'docx';
import { saveAs } from 'file-saver';

const navy = '1E3A5F';
const lightBlue = 'EBF2FF';

const heading = (text) =>
  new Paragraph({
    children: [new TextRun({ text, bold: true, size: 28, color: navy })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  });

const subheading = (text) =>
  new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 18, color: navy })],
    shading: { type: ShadingType.SOLID, color: lightBlue, fill: lightBlue },
    spacing: { before: 200, after: 80 },
    border: {
      left: { style: BorderStyle.THICK, size: 6, color: navy },
    },
    indent: { left: 100 },
  });

const fieldRow = (label, value) =>
  new Paragraph({
    children: [
      new TextRun({ text: `${label}  `, bold: true, size: 18, color: '888888' }),
      new TextRun({ text: value || '—', size: 18 }),
    ],
    spacing: { after: 40 },
    indent: { left: 200 },
  });

const bodyPara = (text) =>
  new Paragraph({
    children: [new TextRun({ text, size: 20 })],
    spacing: { after: 120, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
  });

const divider = () =>
  new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
    spacing: { before: 100, after: 100 },
  });

const signBlock = (role, name) => [
  new Paragraph({
    children: [new TextRun({ text: role, bold: true, size: 22, color: navy })],
    spacing: { before: 200, after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: `Name:  ${name}`, size: 20 })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [
      new TextRun({ text: 'Signature:  ', size: 20 }),
      new TextRun({
        text: '___________________________________',
        size: 20,
        color: 'AAAAAA',
      }),
    ],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [
      new TextRun({ text: 'Date:  ', size: 20 }),
      new TextRun({
        text: '___________________________________',
        size: 20,
        color: 'AAAAAA',
      }),
    ],
    spacing: { after: 120 },
  }),
];

export const generateDOCX = async (agreementData) => {
  const a = agreementData;

  const children = [
    // Title
    new Paragraph({
      children: [
        new TextRun({
          text: 'LOAN AGREEMENT',
          bold: true,
          size: 36,
          color: navy,
          allCaps: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Reference: ${a.agreementNumber}`, size: 18, color: '666666' }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Generated: ${a.generatedDate}`, size: 18, color: '666666' }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    divider(),

    // Intro
    bodyPara(`This Agreement is made on ${a.generatedDate}, between:`),

    // Lender
    subheading('Lender'),
    fieldRow('Name:', a.lenderName),
    fieldRow('Phone:', a.lenderPhone),
    fieldRow('Address:', a.lenderAddress),

    // Borrower
    subheading('Borrower'),
    fieldRow('Name:', a.borrowerName),
    fieldRow('Phone:', a.borrowerPhone),
    fieldRow('Ghana Card No:', a.borrowerGhanaCard),
    fieldRow('Address:', a.borrowerAddress),
    fieldRow('Occupation:', a.borrowerOccupation),

    // Loan Details
    subheading('Loan Details'),
    fieldRow('Loan Amount:', a.loanAmount),
    fieldRow('Interest Rate:', a.interestRate),
    fieldRow('Interest Amount:', a.interestAmount),
    fieldRow('Total Repayment:', a.totalRepayment),
    fieldRow('Date Funds Given:', a.dateLoanGiven),
    fieldRow('Due Date:', a.dueDate),
    fieldRow('Penalty Rate:', a.penaltyRate),
    fieldRow('Penalty Amount:', a.penaltyAmount),
    fieldRow('Amount After Penalty:', a.amountAfterPenalty),

    // Witness
    subheading('Witness'),
    fieldRow('Name:', a.witnessName),
    fieldRow('Phone:', a.witnessPhone),
    fieldRow('Address:', a.witnessAddress),

    divider(),

    // Terms
    subheading('Terms and Conditions'),
    bodyPara(
      `The Lender agrees to lend the Borrower the sum of ${a.loanAmount} on ${a.dateLoanGiven}.`
    ),
    bodyPara(
      `The Borrower agrees to repay the loan together with ${a.interestRate} interest, making a total repayment amount of ${a.totalRepayment}.`
    ),
    bodyPara(`The repayment shall be made in full on or before ${a.dueDate}.`),
    bodyPara(
      `If the Borrower fails to repay the amount due by the agreed date, a ${a.penaltyRate} penalty shall be applied to the outstanding amount. The revised total amount payable after the penalty shall be ${a.amountAfterPenalty}.`
    ),
    bodyPara(
      `Should the Borrower fail to settle the outstanding amount after the due date, the Borrower agrees that the Lender may take lawful legal action to recover the debt, including any associated legal and recovery costs.`
    ),
    bodyPara(
      `Both parties confirm that they have read, understood, and agreed to the terms of this Agreement.`
    ),

    divider(),

    // Signatures
    new Paragraph({
      children: [new TextRun({ text: 'SIGNATURES', bold: true, size: 24, color: navy })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 120 },
    }),

    ...signBlock('LENDER', a.lenderName),
    ...signBlock('BORROWER', a.borrowerName),
    ...signBlock('WITNESS', a.witnessName),
  ];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${a.agreementNumber}.docx`);
};
