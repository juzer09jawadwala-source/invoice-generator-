# 🧾 AI-Powered Smart Invoice Generator

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-API-8E75C2?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A modern, high-performance web application for creating, managing, and exporting professional client invoices. Equipped with **Google Gemini AI** for intelligent line-item generation, dynamic **UPI QR code generation** for immediate mobile payments, and pixel-perfect **client-side PDF export**.

---

## ✨ Key Features

- **🤖 AI-Powered Invoice Generation**: Integrate Google Gemini AI (`@google/genai`) to draft complete itemized invoices, project scopes, and pricing estimates from simple natural language prompts.
- **💳 Dynamic UPI QR Code Generation**: Automatically generates scan-and-pay UPI QR codes based on payment address and invoice total, enabling one-tap mobile payments for Indian banking & global gateways.
- **📄 Pixel-Perfect PDF Export & Print**: High-fidelity client-side PDF compilation powered by `html2pdf.js` and dedicated printable view via `react-to-print`.
- **📊 Real-Time Financial Calculations**: Instantaneous subtotal, custom tax/GST rates, discounts, shipping, and currency switching formatted with tabular figures.
- **⚡ Modern UI & Motion**: Built on React 19 and Tailwind CSS v4 with fluid transitions powered by `motion` (Framer Motion) and Lucide iconography.
- **🗂️ Reusable Item & Client Directory**: Add, edit, remove, and re-order invoice line items with ease using TanStack Table primitives.

---

## 🛠️ Tech Stack & Dependencies

| Tool | Purpose |
| :--- | :--- |
| **React 19 + TypeScript** | Core framework with modern hooks and strong type safety |
| **Vite 6** | Lightning-fast development tooling and optimized production builds |
| **Tailwind CSS v4** | Modern utility-first styling with custom typography and CSS variables |
| **@google/genai** | Official Google GenAI SDK for Gemini model integration |
| **Motion** | Fluid UI animations and interactive micro-interactions |
| **@tanstack/react-table** | Headless tabular state management for line items |
| **qrcode.react** | Dynamic vector and canvas QR code rendering |
| **html2pdf.js & react-to-print** | Document generation and print styling |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/) *(optional, for AI drafting)*

### 1. Clone & Install
```bash
git clone https://github.com/juzer09jawadwala-source/invoice-generator-.git
cd invoice-generator-
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```text
├── src/
│   ├── components/          # AppShell, InvoiceBuilder, PDFPreview, UPIModal
│   ├── types/               # TypeScript interfaces for invoices and items
│   ├── utils/               # PDF export helpers, currency formatters
│   ├── App.tsx              # Main application orchestrator
│   ├── index.css            # Tailwind design tokens & font definitions
│   └── main.tsx             # Application entry point
├── public/                  # Static assets and template logos
├── index.html               # HTML5 root shell
├── tailwind.config.js       # Design system configuration
├── vite.config.ts           # Vite bundler configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 📄 License

This project is licensed under the MIT License.