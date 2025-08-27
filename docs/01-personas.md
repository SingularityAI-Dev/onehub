# OneHub v2 User Personas

This document outlines the core user personas for OneHub v2. These personas guide our UX, design, and development decisions to ensure we are building a platform that meets the critical needs of our target users.

---

## 1. Alex Chen - The Startup Founder

- **Role:** Founder & CEO of a 15-person SaaS startup.
- **Age:** 32
- **Quote:** "I need a single source of truth for my business KPIs. I'm switching between ten different tabs just to see if we're on track."

### Goals & Motivations
- **Primary Goal:** Make fast, data-driven decisions to achieve product-market fit and secure the next funding round.
- **Secondary Goals:**
    - Maximize team productivity by reducing operational overhead.
    - Maintain a high-level overview of all business functions (marketing, sales, product) without getting lost in the weeds.
    - Impress investors with clear, concise reporting.

### Pain Points & Frustrations
- **Fragmented Data:** Key metrics are scattered across Stripe, Google Analytics, HubSpot, and internal databases.
- **High Cost of Tools:** The monthly bill for specialized software is getting out of control.
- **Lack of Time:** Spends too much time hunting for data and not enough time acting on it.
- **Context Switching:** Constantly jumping between applications kills focus and efficiency.

### Key Scenarios
- **KPI Dashboard:** "As a founder, I need to see a single, real-time dashboard with my North Star metrics (MRR, churn, user activation) first thing in the morning."
- **Investor Reporting:** "I need to quickly generate a report that shows our growth trajectory for our monthly board meeting."

### Relationship with OneHub v2 Services
- **Metabase:** This is Alex's "wow" feature. The embedded, pre-configured dashboard gives an immediate, holistic view of the business.
- **HubSpot:** Provides a single view of the customer lifecycle, from marketing touchpoint to closed deal.
- **Apollo.io:** Helps Alex understand the effectiveness of the outbound sales engine.
- **ZeroEntropy:** (Future) Helps Alex find answers to complex questions by querying across all connected services (e.g., "What was our most profitable customer segment last quarter?").

---

## 2. Maria Rodriguez - The Marketing Lead

- **Role:** Head of Marketing at a Series A tech company.
- **Age:** 38
- **Quote:** "I'm drowning in data but starving for insights. I need to prove the ROI of my campaigns, but our tools don't talk to each other."

### Goals & Motivations
- **Primary Goal:** Generate a predictable pipeline of Marketing Qualified Leads (MQLs) and prove marketing's contribution to revenue.
- **Secondary Goals:**
    - Increase brand awareness in a competitive market.
    - Automate repetitive tasks to focus on strategy and content creation.
    - Personalize the customer journey at scale.

### Pain Points & Frustrations
- **Lead Attribution:** Struggles to accurately attribute leads to specific campaigns, making it hard to justify budget allocation.
- **Disconnected Tools:** Uses separate tools for email marketing, social media, analytics, and CRM, leading to data silos and manual reporting.
- **Manual Reporting:** Spends hours each week exporting CSVs and building reports in spreadsheets.
- **Proving ROI:** Finds it difficult to connect marketing spend directly to sales outcomes.

### Key Scenarios
- **Campaign Monitoring:** "As a marketing lead, I want to see a dashboard that shows my active campaigns, their performance metrics (clicks, conversions, MQLs), and the cost per acquisition for each."
- **Lead Nurturing:** "I need to automatically enroll new leads from a webinar into a specific email nurture sequence."

### Relationship with OneHub v2 Services
- **HubSpot:** The cornerstone of Maria's workflow. It's the central hub for CRM, marketing automation, and campaign management.
- **Dub.co:** Provides critical link tracking and attribution, solving a major pain point by showing which channels are most effective.
- **SendGrid:** Ensures high-deliverability for all transactional and marketing emails sent via HubSpot.
- **Metabase:** Visualizes the entire marketing funnel, from website visitor to MQL, and tracks campaign performance over time.

---

## 3. Sam Jones - The Sales Lead

- **Role:** First sales hire at a growing B2B startup.
- **Age:** 29
- **Quote:** "I need to spend my time selling, not prospecting. Give me a list of qualified leads, and I'll close them."

### Goals & Motivations
- **Primary Goal:** Hit and exceed the monthly sales quota.
- **Secondary Goals:**
    - Shorten the sales cycle by focusing on the most promising leads.
    - Improve lead quality and conversion rates.
    - Build a repeatable and scalable sales process.

### Pain Points & Frustrations
- **Poor Lead Quality:** Wastes time chasing leads that are a bad fit or have incomplete information.
- **Manual Prospecting:** Spends hours every day on LinkedIn and company websites trying to find contact information.
- **Inefficient Workflow:** Juggles a CRM, a sales intelligence tool, and email, with a lot of manual data entry.
- **Lack of Insight:** Doesn't have a clear picture of which leads are "hot" or have recently engaged with marketing content.

### Key Scenarios
- **Lead Generation:** "As a sales lead, I need a system that automatically finds and enriches leads based on our Ideal Customer Profile (ICP) and adds them to my pipeline."
- **Sales Handoff:** "I need a notification when a lead becomes 'sales-ready' based on their activity, so I can follow up immediately."

### Relationship with OneHub v2 Services
- **Apollo.io:** The primary engine for lead generation and data enrichment. This is Sam's most important tool.
- **HubSpot:** Manages the sales pipeline, logs all calls and emails, and shows recent marketing interactions for context.
- **Intervo.ai:** (Future) The AI voice agent can handle initial lead qualification conversations, ensuring Sam only talks to interested, well-qualified prospects.
- **ZeroEntropy:** (Future) Allows Sam to ask questions like, "Show me all leads in the pipeline who work at Series B companies and have visited our pricing page in the last week."
