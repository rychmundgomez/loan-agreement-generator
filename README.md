# Loan Agreement Generator

A professional admin portal for generating, previewing, and exporting loan agreements as PDF and Word documents.

## Features

- Multi-section form with validation (Lender, Borrower, Loan, Witness details)
- Live real-time calculations (interest, repayment, penalties)
- Auto-generated agreement number (LAG-YYYYMMDD-001)
- Document preview in-browser
- Export as PDF (jsPDF) or Word DOCX
- Print agreement
- Copy agreement text to clipboard
- Save draft locally (LocalStorage)
- Agreement history with search, view, edit, and delete
- Dark mode support
- Mobile responsive

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Navigate into the project
cd loan-agreement-generator

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready for deployment.

---

## Deploy to Netlify

### Option A: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Option B: Netlify Dashboard

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **Add new site → Import an existing project**
3. Connect your Git repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Click **Deploy site**

The included `netlify.toml` handles redirects automatically.

---

## Project Structure

```
src/
├── components/
│   ├── LoanForm.jsx         # Admin input form
│   ├── AgreementPreview.jsx # Document preview + export actions
│   ├── HistoryPanel.jsx     # Saved agreements list + detail view
│   └── Toast.jsx            # Notification component
├── utils/
│   ├── helpers.js           # Calculations, formatting, LocalStorage
│   ├── agreementBuilder.js  # Agreement text assembly
│   ├── pdfGenerator.js      # jsPDF export
│   └── docxGenerator.js     # docx package export
├── App.jsx                  # Root component, dark mode, layout
├── main.jsx                 # React entry point
└── index.css                # Tailwind + custom styles
```

---

## Agreement Number Format

```
LAG-YYYYMMDD-001
```

Example: `LAG-20260611-001`

Sequence resets daily and increments per new agreement generated that day.

---

## Tech Stack

| Layer | Library |
|---|---|
| UI Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Form Management | React Hook Form |
| PDF Export | jsPDF |
| DOCX Export | docx + file-saver |
| Icons | Lucide React |
| Deployment | Netlify |
