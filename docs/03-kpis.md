# OneHub v2 - Core Business KPIs

This document formalizes the North Star metrics for the OneHub v2 project. These Key Performance Indicators (KPIs) will be used to measure our success, guide our product development decisions, and ensure we are focused on delivering tangible value to our users.

Our primary objective is to help users gain unified insights from their disparate business tools with minimal effort.

---

## North Star Metric

While we track several KPIs, our ultimate success is measured by the **User Activation Rate**. This is the single most important metric as it captures the percentage of users who experience the core "wow" moment of the platform.

---

## Core KPIs

### 1. User Activation Rate

- **Definition:** The percentage of new users who successfully complete the onboarding conversation and view their first auto-provisioned dashboard during their first session.
- **Why it matters:** This is the critical "Aha!" moment. A high activation rate proves that our core value proposition is being delivered effectively and immediately. It is the best predictor of long-term user retention.
- **How we will measure it:**
    ```
    (Number of new users who view a provisioned dashboard) / (Total number of new users who complete sign-up) * 100%
    ```
- **Goal:** > 60%

### 2. Time to Value (TTV)

- **Definition:** The median time it takes for a new user to get from the initial sign-up to viewing their first provisioned dashboard.
- **Why it matters:** In a world of complex B2B software, immediate value is our key differentiator. A low TTV demonstrates the platform's simplicity and power.
- **How we will measure it:**
    ```
    Median(Timestamp of "Dashboard Viewed" event - Timestamp of "User Signed Up" event)
    ```
- **Goal:** < 3 minutes

### 3. Service Adoption Rate

- **Definition:** The percentage of *activated* users who connect at least one of their own external service accounts (e.g., their personal HubSpot, Apollo, etc.) within the first 7 days of use.
- **Why it matters:** This metric indicates that a user is transitioning from a passive observer of sample data to an active user who is integrating OneHub into their real-world workflow. It's a strong signal of product stickiness and long-term value.
- **How we will measure it:**
    ```
    (Number of activated users who connect at least one service) / (Total number of activated users) * 100%
    ```
- **Goal:** > 25% within the first 7 days.
