# OneHub v2 - System Architecture (C4 Model)

This document outlines the high-level architecture of the OneHub v2 platform using the C4 model. This approach allows us to visualize the system at different levels of abstraction, providing a clear understanding for technical and non-technical stakeholders alike.

---

## Level 1: System Context Diagram

This diagram shows OneHub as a black box in the center of the universe. It illustrates how our system interacts with our users and the other systems it depends on.

```mermaid
graph TD
    subgraph "OneHub v2 Ecosystem"
        %% Users
        founder["Startup Founder<br>(Alex Chen)"]
        marketing_lead["Marketing Lead<br>(Maria Rodriguez)"]

        %% The System
        onehub(OneHub v2)

        %% External Services
        hubspot[("HubSpot<br>Marketing & CRM")]
        metabase[("Metabase<br>Business Intelligence")]
        apollo[("Apollo.io<br>Lead Generation")]
        sendgrid[("SendGrid<br>Transactional Comms")]
        dub[("Dub.co<br>Link Attribution")]
        zeroentropy[("ZeroEntropy<br>Adaptive Retrieval")]
        intervo[("Intervo.ai<br>Conversational AI")]
    end

    %% User Interactions
    founder -- "Uses" --> onehub
    marketing_lead -- "Uses" --> onehub

    %% System Interactions
    onehub -- "Makes API calls to" --> hubspot
    onehub -- "Embeds dashboards from, makes API calls to" --> metabase
    onehub -- "Makes API calls to" --> apollo
    onehub -- "Makes API calls to" --> sendgrid
    onehub -- "Makes API calls to" --> dub
    onehub -- "Makes API calls to" --> zeroentropy
    onehub -- "Makes API calls to" --> intervo
```

---

## Level 2: Container Diagram

This diagram zooms into the OneHub v2 system, showing the major logical containers (applications, services, data stores) that make up the platform.

```mermaid
graph TD
    subgraph "User's Device"
        browser["Web Browser"]
    end

    subgraph "Cloud Infrastructure (AWS)"
        subgraph "OneHub v2 System Boundary"
            %% Core Application Components
            frontend["Frontend App<br>(Next.js on Vercel)"]
            gateway["API Gateway<br>(Go on EKS)"]

            subgraph "Backend Services (Go/Python on EKS)"
                auth_service["Auth Service"]
                nlu_service["NLU Service"]
                dashboard_service["Dashboard Generator"]
                adapters["Service Adapters<br>(HubSpot, Apollo, etc.)"]
            end

            %% Data Stores
            db[("Postgres DB<br>(Neon)")]
            cache[("Redis Cache<br>(Upstash)")]
        end
    end

    %% External Services
    hubspot_ext[("HubSpot API")]
    metabase_ext[("Metabase API & SDK")]
    apollo_ext[("Apollo.io API")]
    intervo_ext[("Intervo.ai Engine")]


    %% Internal Connections
    browser -- "HTTPS" --> frontend
    frontend -- "API Calls (GraphQL)" --> gateway

    gateway --> auth_service
    gateway --> nlu_service
    gateway --> dashboard_service
    gateway --> adapters

    auth_service -- "Reads/writes user data" --> db
    auth_service -- "Reads/writes session data" --> cache

    nlu_service -- "Reads/writes conversation data" --> db
    dashboard_service -- "Reads/writes dashboard configs" --> db
    adapters -- "Reads/writes service data" --> db

    %% External Connections
    nlu_service -- "Processes conversations with" --> intervo_ext
    dashboard_service -- "Provisions dashboards via" --> metabase_ext
    adapters -- "Integrates with" --> hubspot_ext
    adapters -- "Integrates with" --> apollo_ext
```
