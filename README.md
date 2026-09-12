# ResolveAI — Autonomous Customer Support Intelligence Platform

> **Build Bengaluru Hackathon — Customer Support Track**

ResolveAI is an enterprise autonomous customer-support intelligence platform. It does not simply answer questions. It investigates a customer's situation across enterprise data, identifies root cause, determines optimal resolution, safely executes low-risk actions, and escalates complex/risky cases with complete context.

---

## Core Flow
`Customer` -> `Ingest` -> `Investigate` -> `Gather Evidence` -> `Qwen Reasoning` -> `Root Cause` -> `Risk Check` -> `Decide` -> `Act/Escalate` -> `Respond` -> `Audit Trail`

---

## 🚀 Quick Start Guide

### 1. Start Express Backend API (Port 5000)
```bash
cd server
npm start
```

### 2. Start React Frontend UI (Port 3000)
```bash
cd client
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 🎯 The Killer Demo Flow

1. Click **Customer Chat Widget** in the top navigation bar.
2. Click **Load Demo Complaint** (or type: *"My order hasn't arrived and I was charged twice. I already contacted support yesterday."*).
3. Watch ResolveAI perform real-time multi-source data ingestion:
   - **Customer Intelligence**: Identifies Customer C1024 (Aarav Sharma - VIP Gold member).
   - **Order Management**: Finds Order `ORD9281` (UltraNoise Headphones, ₹4,999) - delayed 6 days past promised SLA (SWIFT-9921-IN).
   - **Razorpay Payment Gateway**: Flags **2 successful charges** of ₹4,999 (`PAY-9921` & `PAY-9922`).
   - **Support History**: Detects prior closed ticket `T-8820` where legacy bot gave standard text without checking billing.
   - **Contradiction Alert**: Flags conflict between Billing (2 debits) and Order system (1 order), escalating risk to **HIGH**.
4. **Qwen Reasoning Engine**: Identifies root causes (gateway retry race condition + logistics hub backlog), recommends duplicate refund (₹4,999), SLA compensation voucher (₹500), and priority dispatch escalation.
5. **Human Approval Queue**: Supervisor reviews evidence timeline, clicks **1-Click Approve & Execute**, updating Razorpay refund status and logging immutable audit trail records.

---

## 🏗 Architecture & 7 Logical Agents
1. **Orchestrator Agent**: Decides investigation needs & coordinates workflow.
2. **Customer Intelligence Agent**: Profile, VIP tier, LTV, ticket history, sentiment.
3. **Order Investigation Agent**: Order status, SLA calculation, tracking status.
4. **Billing Investigation Agent**: Payment gateway transactions, duplicate debits, refunds.
5. **Knowledge & Policy Agent**: Matching POL-001 (Duplicate Refund), POL-002 (SLA Compensation), POL-003 (Approval Threshold).
6. **Resolution & Risk Agent**: Combines evidence and evaluates risk score (LOW, MEDIUM, HIGH).
7. **Response Agent**: Formulates personalized customer communication.

---

## 📁 Repository Structure
```
BB/
├── implement.txt                 # Implementation Master Plan
├── package.json                  # Root runner script
├── server/                       # Node.js + Express API Backend
│   ├── src/
│   │   ├── index.js              # Server entry point
│   │   ├── db/                   # JSON / SQLite data store & seed dataset
│   │   ├── services/             # Multi-Source Investigation, Qwen AI, EnterPro Workflow
│   │   └── routes/               # REST Endpoints (/api/tickets, /api/investigations, /api/actions, etc.)
│   └── package.json
└── client/                       # React + Vite + Tailwind CSS Frontend
    ├── src/
    │   ├── components/           # Dashboard, CustomerChat, TicketDetailView, ApprovalConsole, AnalyticsHub
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```
