import { db } from './database.js';

export function seedDatabase() {
  const seedData = {
    customers: [
      {
        id: "C1024",
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        tier: "VIP Gold",
        lifetime_value: 148500,
        risk_score: "Low",
        joined_date: "2023-04-15",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        total_orders: 18,
        resolved_tickets: 4
      },
      {
        id: "C1025",
        name: "Priya Nair",
        email: "priya.nair@example.com",
        phone: "+91 98123 45678",
        tier: "Silver",
        lifetime_value: 32000,
        risk_score: "Low",
        joined_date: "2024-01-10",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        total_orders: 5,
        resolved_tickets: 1
      },
      {
        id: "C1026",
        name: "Rohan Verma",
        email: "rohan.v@example.com",
        phone: "+91 97788 11223",
        tier: "Platinum",
        lifetime_value: 295000,
        risk_score: "Low",
        joined_date: "2022-09-01",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        total_orders: 42,
        resolved_tickets: 8
      }
    ],

    orders: [
      {
        id: "ORD9281",
        customer_id: "C1024",
        order_date: "2026-09-04T10:30:00Z",
        items: [
          { sku: "TECH-991", name: "UltraNoise Cancelling Headphones Pro", qty: 1, unit_price: 4999 }
        ],
        total_amount: 4999,
        currency: "INR",
        payment_status: "SUCCESS",
        shipping_status: "DELAYED_IN_TRANSIT",
        promised_sla_days: 2,
        expected_delivery: "2026-09-06T18:00:00Z",
        delay_days: 6,
        sla_breached: true,
        carrier: "SwiftLogistics Express",
        tracking_number: "SWIFT-9921-IN",
        last_hub_location: "Hub Bengaluru Sorting Hub - Transit Backlog"
      },
      {
        id: "ORD9105",
        customer_id: "C1025",
        order_date: "2026-09-10T14:15:00Z",
        items: [
          { sku: "APPAREL-402", name: "Merino Wool Winter Jacket", qty: 1, unit_price: 6499 }
        ],
        total_amount: 6499,
        currency: "INR",
        payment_status: "SUCCESS",
        shipping_status: "DELIVERED",
        promised_sla_days: 3,
        expected_delivery: "2026-09-13T18:00:00Z",
        delay_days: 0,
        sla_breached: false,
        carrier: "BlueDart Express",
        tracking_number: "BD-8839-IN"
      },
      {
        id: "ORD8990",
        customer_id: "C1026",
        order_date: "2026-09-08T09:00:00Z",
        items: [
          { sku: "SMART-101", name: "Smart Fitness Watch Ultra", qty: 1, unit_price: 12999 }
        ],
        total_amount: 12999,
        currency: "INR",
        payment_status: "SUCCESS",
        shipping_status: "SHIPPED",
        promised_sla_days: 2,
        expected_delivery: "2026-09-10T18:00:00Z",
        delay_days: 2,
        sla_breached: false,
        carrier: "Delhivery",
        tracking_number: "DL-4412-IN"
      }
    ],

    payments: [
      {
        id: "PAY-9921",
        order_id: "ORD9281",
        customer_id: "C1024",
        amount: 4999,
        currency: "INR",
        status: "SUCCESS",
        timestamp: "2026-09-04T10:31:00Z",
        gateway: "Razorpay",
        transaction_ref: "TXN-8849102-A",
        method: "UPI (Google Pay)"
      },
      {
        id: "PAY-9922",
        order_id: "ORD9281",
        customer_id: "C1024",
        amount: 4999,
        currency: "INR",
        status: "SUCCESS",
        timestamp: "2026-09-04T10:31:05Z",
        gateway: "Razorpay",
        transaction_ref: "TXN-8849102-B",
        method: "UPI (Google Pay)",
        is_duplicate: true
      },
      {
        id: "PAY-9105",
        order_id: "ORD9105",
        customer_id: "C1025",
        amount: 6499,
        currency: "INR",
        status: "SUCCESS",
        timestamp: "2026-09-10T14:16:00Z",
        gateway: "HDFC Payment Gateway",
        transaction_ref: "TXN-77301-C",
        method: "Credit Card"
      }
    ],

    support_history: [
      {
        id: "T-8820",
        customer_id: "C1024",
        order_id: "ORD9281",
        created_at: "2026-09-11T14:20:00Z",
        channel: "Chat",
        summary: "Customer asked for shipment tracking update for order ORD9281.",
        agent_type: "Legacy Bot v1",
        resolution_status: "CLOSED_AUTOMATED",
        bot_response: "Your order ORD9281 is in transit with SwiftLogistics. Click here to track.",
        customer_rating: 1,
        flaw_noted: "Bot gave generic tracking link without recognizing billing double-charge or SLA breach."
      },
      {
        id: "T-8100",
        customer_id: "C1024",
        order_id: "ORD7102",
        created_at: "2026-05-10T11:00:00Z",
        channel: "Email",
        summary: "Product query on headphone Bluetooth pairing.",
        agent_type: "Human Agent (Rahul M.)",
        resolution_status: "RESOLVED",
        bot_response: "Sent troubleshooting PDF manual.",
        customer_rating: 5
      }
    ],

    policies: [
      {
        id: "POL-001",
        code: "DUPLICATE_PAYMENT_REFUND",
        title: "Duplicate Payment Auto-Refund Policy",
        category: "Billing",
        description: "If multiple successful payment transactions are recorded for the exact same order reference within a 15-minute window, the secondary payment is eligible for immediate refund of 100% principal amount.",
        auto_action_eligible: true,
        max_auto_amount: 5000,
        risk_level: "LOW"
      },
      {
        id: "POL-002",
        code: "SLA_BREACH_COMPENSATION",
        title: "Logistics SLA Breach Compensation Policy",
        category: "Logistics",
        description: "If delivery exceeds SLA by >3 business days due to courier delay, customer is entitled to ₹500 courtesy gift voucher and mandatory expedited escalation ticket to logistics partner.",
        auto_action_eligible: true,
        max_auto_amount: 1000,
        risk_level: "MEDIUM"
      },
      {
        id: "POL-003",
        code: "HIGH_VALUE_REFUND_APPROVAL",
        title: "Human Approval Threshold Policy",
        category: "Risk Control",
        description: "Any total combined financial refund or payout exceeding ₹2,000 or involving conflicting system evidence MUST require Supervisor Approval before executing ledger disbursement.",
        auto_action_eligible: false,
        risk_level: "HIGH"
      },
      {
        id: "POL-004",
        code: "LOGISTICS_ESCALATION_TIER",
        title: "Carrier SLA Breach Escalation Protocol",
        category: "Logistics",
        description: "Shipment delays exceeding 5 days must trigger a Priority 1 Dispatch Escalation directly to SwiftLogistics Regional Manager.",
        auto_action_eligible: true,
        risk_level: "LOW"
      }
    ],

    tickets: [
      {
        id: "T-9001",
        customer_id: "C1024",
        order_id: "ORD9281",
        channel: "Chat Widget",
        subject: "Order delayed & double charged on ORD9281",
        customer_message: "My order hasn't arrived and I was charged twice. I already contacted support yesterday.",
        status: "INVESTIGATING",
        priority: "URGENT",
        risk_level: "HIGH",
        intent: "DUPLICATE_PAYMENT_AND_DELIVERY_DELAY",
        created_at: "2026-09-12T18:00:00Z"
      },
      {
        id: "T-9002",
        customer_id: "C1025",
        order_id: "ORD9105",
        channel: "Email",
        subject: "Size exchange request for Merino Wool Jacket",
        customer_message: "The wool jacket delivered today is size M, but I need size L. How do I exchange it?",
        status: "OPEN",
        priority: "MEDIUM",
        risk_level: "LOW",
        intent: "PRODUCT_EXCHANGE",
        created_at: "2026-09-12T15:30:00Z"
      },
      {
        id: "T-9003",
        customer_id: "C1026",
        order_id: "ORD8990",
        channel: "Chat Widget",
        subject: "Tracking query for Smart Watch",
        customer_message: "Can you confirm if my watch will arrive by tomorrow evening?",
        status: "RESOLVED",
        priority: "LOW",
        risk_level: "LOW",
        intent: "DELIVERY_STATUS_CHECK",
        created_at: "2026-09-12T11:20:00Z"
      }
    ],

    investigations: [],
    ai_recommendations: [],
    escalations: [],
    audit_logs: [
      {
        id: "LOG_1001",
        ticket_id: "T-9001",
        actor: "System Orchestrator",
        action: "TICKET_CREATED",
        details: "Ticket ingested from Chat Widget. Customer identified as C1024 (Aarav Sharma - VIP Gold).",
        timestamp: "2026-09-12T18:00:00Z"
      }
    ]
  };

  db.reset(seedData);
  console.log('Database successfully seeded with enterprise dataset.');
}
