-- Migration to add the core tables for the Dynamic Dashboard feature.

-- DashboardTemplate: Stores predefined templates for dashboards.
CREATE TABLE dashboard_templates (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    default_layout JSONB,
    supported_data_sources JSONB,
    config_schema JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- DataSource: Stores configuration for external data sources like HubSpot, Apollo, etc.
CREATE TABLE data_sources (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- e.g., 'hubspot', 'apollo'
    credentials JSONB, -- Encrypted credentials
    api_config JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dashboard: The main entity for a user's dashboard.
CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    template_id VARCHAR(255) REFERENCES dashboard_templates(id),
    configuration JSONB,
    layout JSONB,
    status VARCHAR(50) DEFAULT 'active',
    last_data_refresh TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Widget: Represents a single widget within a dashboard.
CREATE TABLE widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- e.g., 'Metabase', 'ApolloLeadFinder'
    data_source_id VARCHAR(255) REFERENCES data_sources(id),
    query JSONB,
    position JSONB,
    styling JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- UserDashboard: A join table to manage user permissions and preferences for dashboards.
CREATE TABLE user_dashboards (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    permissions JSONB, -- e.g., {"can_edit": true, "can_share": false}
    last_accessed TIMESTAMPTZ,
    is_starred BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, dashboard_id)
);
