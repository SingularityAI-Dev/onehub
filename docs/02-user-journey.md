# OneHub v2 - Core User Journey Map

This document serves as the single source of truth for the core user experience of the OneHub v2 Minimum Viable Product (MVP). It maps the entire flow from a user's first contact with the platform to the moment they experience its core value.

- **Persona in Focus:** Alex Chen, The Startup Founder
- **Core Goal:** To see a unified view of key business metrics with zero manual setup.

---

## The User Journey: Step-by-Step

### 1. Phase: Discovery & Awareness
- **Step:** Initial Contact (Landing Page)
- **User Action:** Alex follows a link to the OneHub v2 homepage.
- **User Thoughts:** "Okay, what is this? It looks interesting. Can it really unify all my business data?"
- **Frontend Experience:**
    - A visually impressive and interactive WebGL landing page communicates a modern, powerful platform.
    - Headline: "Your Business, Unified."
    - Sub-headline: "Connect your tools. See your metrics. Command your growth. Instantly."
    - A single, clear Call to Action (CTA) button: "Get Started for Free".

### 2. Phase: Onboarding
- **Step:** Authentication (Sign-up/Login)
- **User Action:** Alex clicks the "Get Started for Free" CTA.
- **User Thoughts:** "Let's see what this is about. I'll sign up with Google to make it fast."
- **Frontend Experience:**
    - A clean, simple modal appears.
    - Options for SSO (Google, GitHub) are prominent.
    - A traditional email/password sign-up is also available.
    - Minimal friction; no credit card required.

### 3. Phase: First Interaction & Personalization
- **Step:** The Voice Agent Onboarding Conversation
- **User Action:** After successful sign-up and login, Alex is immediately greeted by the voice agent. He listens to the welcome message and responds to the agent's question.
- **User Thoughts:** "Whoa, a voice assistant. This is different. 'Business Health' is definitely my main focus."
- **Frontend Experience:**
    - The screen is minimalistic, focusing on the voice agent interface.
    - A welcome message is spoken and displayed: "Welcome to OneHub, Alex. To get started, what is your primary focus right now: Marketing, Sales, or overall Business Health?"
    - The voice input is captured, and a transcript is shown in real-time.
    - The system is scripted for the MVP to recognize these three key areas.

### 4. Phase: Automated Setup & Value Proposition
- **Step:** Dashboard Provisioning
- **User Action:** Alex says "Business Health". The system processes his response.
- **User Thoughts:** "Okay, let's see what it does. This feels like magic if it works."
- **Frontend Experience:**
    - The voice agent responds: "Excellent. We are provisioning your Business Health dashboard right now. This will give you a real-time view of your key metrics."
    - A loading animation with informative text appears (e.g., "Connecting to Metabase...", "Building your dashboard..."). This manages expectations and makes the short wait feel productive.

### 5. Phase: The "Aha!" Moment
- **Step:** First Interaction with a Provisioned Widget
- **User Action:** The main application UI loads. Alex sees his new dashboard. He hovers over a chart to see more details.
- **User Thoughts:** "Wow. There it is. My MRR, my active users... it's all here. And I didn't have to configure anything. This is exactly what I needed."
- **Frontend Experience:**
    - The dashboard is the star of the show.
    - A large, visually appealing, and interactive Metabase dashboard widget is embedded as the main content.
    - It is pre-populated with sample data that looks realistic and impressive.
    - Tooltips and interactive elements encourage exploration. This is the 'wow' moment that delivers on the platform's promise immediately.

### 6. Phase: Exploration & Future Engagement
- **Step:** Guided Exploration
- **User Action:** After taking in the dashboard, Alex notices UI elements guiding him toward next steps.
- **User Thoughts:** "Okay, this is great. Now, how do I connect my *own* data? And how can I add my marketing lead to this?"
- **Frontend Experience:**
    - Clear, non-intrusive UI cues are present.
    - A "Connect Your Services" button is visible.
    - An "Invite Your Team" option is in the main navigation.
    - This guides the user from the initial 'wow' to deeper, long-term engagement with the platform.
