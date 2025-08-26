# 🚀 OneHub v2

> Voice-First Business Intelligence Platform

OneHub v2 is a comprehensive business operations platform that provides an AI-powered voice interface to manage marketing, sales, and analytics through best-in-class services.

## 🏗️ Architecture

This is a Turborepo monorepo containing the complete OneHub v2 platform:

### Applications
- **`apps/web`** - Main Next.js web application (customer-facing)
- **`apps/admin`** - Admin dashboard for platform management

### Services (Microservices)
- **`services/gateway`** - API Gateway with rate limiting and authentication
- **`services/auth`** - Authentication and user management service
- **`services/voice`** - Voice processing and NLU service
- **`services/dashboard-generator`** - Dynamic dashboard creation service
- **`services/orchestrator`** - Cross-service intelligence coordination

### Packages (Shared Libraries)
- **`packages/ui`** - Shared React component library
- **`packages/config`** - Shared configuration and environment management
- **`packages/types`** - TypeScript type definitions
- **`packages/database`** - Database schema and client (Prisma)
- **`packages/auth`** - Authentication utilities
- **`packages/adapters/*`** - Service adapter libraries
  - `hubspot` - HubSpot Marketing Hub integration
  - `apollo` - Apollo.io lead generation integration
  - `metabase` - Metabase BI platform integration
  - `sendgrid` - SendGrid email service integration
  - `dub` - Dub.co link attribution integration
  - `zeroentropy` - ZeroEntropy search integration
  - `intervo` - Intervo.ai conversational AI integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- PostgreSQL database (Neon recommended)
- Redis instance (Upstash recommended)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/onehub-v2.git
cd onehub-v2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Generate database schema
npm run db:generate
npm run db:push

# Start development servers
npm run dev
```

### Development URLs
- **Web App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **API Gateway**: http://localhost:4000

## 🛠️ Development

### Available Scripts
```bash
# Development
npm run dev          # Start all services in development mode
npm run build        # Build all applications and services
npm run test         # Run tests across all packages
npm run lint         # Lint all code
npm run type-check   # TypeScript type checking

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio

# Docker
npm run docker:build # Build Docker images for all services
```

### Service Architecture
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Frontend      │  │   API Gateway   │  │   Services      │
│   (Next.js)     │  │   (Express)     │  │   (Multiple)    │
│   Vercel        │  │   EKS           │  │   EKS Pods      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
        ┌─────────────────┐  ┌─────────────────┐
        │   Database      │  │   Cache         │
        │   (Neon)        │  │   (Upstash)     │
        │   Postgres      │  │   Redis         │
        └─────────────────┘  └─────────────────┘
```

## 🔧 Configuration

### Environment Variables
Each service requires specific environment variables. See individual package README files for details.

Key environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `HUBSPOT_API_KEY` - HubSpot API key
- `APOLLO_API_KEY` - Apollo.io API key
- `SENDGRID_API_KEY` - SendGrid API key
- `AUTH0_SECRET` - Auth0 configuration

### Service Configuration
Services are configured through environment variables and configuration files in `packages/config`.

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests for specific package
npm run test --filter=@onehub/ui

# Run tests in watch mode
npm run test:watch
```

## 📦 Deployment

### Production Build
```bash
# Build all applications and services
npm run build

# Build Docker images
npm run docker:build
```

### Deployment Targets
- **Frontend**: Vercel (recommended) or AWS CloudFront + S3
- **Services**: AWS EKS with Kubernetes
- **Database**: Neon PostgreSQL
- **Cache**: Upstash Redis
- **CDN**: AWS CloudFront

## 🔒 Security

- All APIs require authentication via JWT tokens
- Rate limiting implemented at gateway level
- CORS configured for production domains
- Environment variables for sensitive configuration
- Security headers configured via Helmet.js

## 📈 Monitoring

- Structured logging with Winston
- Health check endpoints on all services
- Performance monitoring with OpenTelemetry
- Error tracking and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Conventional commits for commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@onehub.ai
- 📖 Documentation: [docs.onehub.ai](https://docs.onehub.ai)
- 💬 Discord: [OneHub Community](https://discord.gg/onehub)

---

**Built with ❤️ by the OneHub Team**
