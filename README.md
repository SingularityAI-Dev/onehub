# 🏗️ OneHub v2 Infrastructure

This directory contains the Infrastructure as Code (IaC) configuration for OneHub v2 using OpenTofu/Terraform.

## 📋 Overview

The infrastructure is designed for:
- **High Availability**: Multi-AZ deployment with auto-scaling
- **Security**: VPC isolation, security groups, encryption at rest and in transit
- **Cost Optimization**: Spot instances, intelligent auto-scaling with Karpenter
- **Monitoring**: CloudWatch integration, flow logs, performance insights
- **Scalability**: Kubernetes-native with horizontal pod autoscaling

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                     VPC                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   Public    │  │   Public    │  │   Public    │  │   │
│  │  │  Subnet     │  │  Subnet     │  │  Subnet     │  │   │
│  │  │   AZ-1a     │  │   AZ-1b     │  │   AZ-1c     │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   Private   │  │   Private   │  │   Private   │  │   │
│  │  │   Subnet    │  │   Subnet    │  │   Subnet    │  │   │
│  │  │    AZ-1a    │  │    AZ-1b    │  │    AZ-1c    │  │   │
│  │  │             │  │             │  │             │  │   │
│  │  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │  │   │
│  │  │ │   EKS   │ │  │ │   EKS   │ │  │ │   EKS   │ │  │   │
│  │  │ │  Nodes  │ │  │ │  Nodes  │ │  │ │  Nodes  │ │  │   │
│  │  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │     RDS     │  │ ElastiCache │                  │   │
│  │  │ PostgreSQL  │  │    Redis    │                  │   │
│  │  └─────────────┘  └─────────────┘                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │     S3      │  │ CloudFront  │  │   Route53   │         │
│  │File Storage │  │     CDN     │  │     DNS     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **OpenTofu** or **Terraform** (>= 1.0)
3. **kubectl** for Kubernetes management
4. **AWS permissions** for EKS, VPC, RDS, S3, CloudFront

### Installation

```bash
# Install OpenTofu (recommended)
curl --proto '=https' --tlsv1.2 -fsSL https://get.opentofu.org/install-opentofu.sh | sh

# Or install Terraform
# https://developer.hashicorp.com/terraform/downloads

# Install AWS CLI
# https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

# Install kubectl
# https://kubernetes.io/docs/tasks/tools/
```

### Deployment

1. **Configure AWS credentials:**
```bash
aws configure
# or
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-west-2"
```

2. **Deploy to staging:**
```bash
cd infrastructure
./deploy.sh staging plan     # Review changes
./deploy.sh staging apply    # Deploy infrastructure
```

3. **Deploy to production:**
```bash
./deploy.sh production plan  # Review changes
./deploy.sh production apply # Deploy infrastructure
```

## 📁 Directory Structure

```
infrastructure/
├── main.tf                    # Main Terraform configuration
├── vpc.tf                     # VPC and networking
├── eks.tf                     # EKS cluster and Karpenter
├── database.tf                # RDS PostgreSQL and Redis
├── storage.tf                 # S3 buckets and CloudFront
├── deploy.sh                  # Deployment script
├── environments/
│   ├── staging/
│   │   ├── terraform.tfvars   # Staging configuration
│   │   └── backend.hcl        # Staging state backend
│   └── production/
│       ├── terraform.tfvars   # Production configuration
│       └── backend.hcl        # Production state backend
└── modules/                   # Reusable Terraform modules
```

## ⚙️ Configuration

### Environment Variables

Create environment-specific configurations in `environments/[staging|production]/terraform.tfvars`:

```hcl
# Environment
environment = "staging"
aws_region  = "us-west-2"

# EKS Configuration
kubernetes_version   = "1.28"
node_instance_types  = ["t3.medium"]
min_size            = 1
max_size            = 5
desired_size        = 2

# Database Configuration
postgres_instance_class = "db.t3.micro"
redis_node_type = "cache.t3.micro"
```

### Backend Configuration

State is stored in S3 with DynamoDB locking. Configure in `environments/[env]/backend.hcl`:

```hcl
bucket         = "onehub-terraform-state-staging"
key            = "environments/staging/terraform.tfstate"
region         = "us-west-2"
encrypt        = true
dynamodb_table = "onehub-terraform-locks-staging"
```

## 🔒 Security

### Network Security
- **VPC**: Isolated network with public and private subnets
- **Security Groups**: Restrictive rules for each service
- **NACLs**: Additional network-level protection
- **Flow Logs**: VPC traffic monitoring

### Data Protection
- **Encryption at Rest**: All storage encrypted (RDS, S3, EBS)
- **Encryption in Transit**: TLS 1.2+ for all connections
- **Secrets Management**: AWS Secrets Manager for credentials
- **IAM Roles**: Least privilege access

### Monitoring & Compliance
- **CloudTrail**: API call logging
- **GuardDuty**: Threat detection
- **Config**: Configuration compliance
- **CloudWatch**: Metrics and logging

## 📊 Monitoring

### Key Metrics
- **EKS Cluster**: Node health, pod status, resource utilization
- **RDS**: CPU, memory, connections, slow queries
- **Redis**: Memory usage, cache hit ratio, connections
- **S3/CloudFront**: Request rates, error rates, cache performance

### Alerts
- High CPU/memory utilization
- Database connection limits
- Disk space warnings
- Application error rates
- Security incidents

## 💰 Cost Optimization

### Strategies Implemented
- **Spot Instances**: For non-critical workloads
- **Karpenter**: Intelligent node provisioning and scaling
- **S3 Lifecycle**: Automatic data archival
- **RDS**: Right-sized instances with monitoring
- **CloudFront**: Edge caching to reduce origin load

### Cost Monitoring
- **AWS Cost Explorer**: Track spending by service
- **Budgets**: Set alerts for cost thresholds
- **Resource Tagging**: Cost allocation by environment/team

## 🔧 Operations

### Daily Operations
```bash
# Check cluster status
kubectl get nodes

# View running pods
kubectl get pods --all-namespaces

# Check service health
kubectl get services

# View logs
kubectl logs -f deployment/[service-name]
```

### Scaling Operations
```bash
# Scale deployment
kubectl scale deployment [service-name] --replicas=5

# Check Karpenter provisioning
kubectl get nodes -l karpenter.sh/provisioner-name

# View resource usage
kubectl top nodes
kubectl top pods
```

### Backup Operations
- **RDS**: Automated daily backups (7-day retention)
- **S3**: Versioning enabled for critical buckets
- **EKS**: Configuration stored in Git
- **Secrets**: Backed up in AWS Secrets Manager

## 🚨 Disaster Recovery

### Recovery Time Objectives (RTO)
- **Database**: < 15 minutes (Multi-AZ failover)
- **Application**: < 5 minutes (K8s self-healing)
- **CDN**: < 1 minute (Global edge locations)

### Recovery Point Objectives (RPO)
- **Database**: < 5 minutes (continuous backup)
- **File Storage**: < 1 hour (S3 versioning)
- **Configuration**: 0 (stored in Git)

### Backup Strategy
1. **Automated RDS backups** with point-in-time recovery
2. **S3 cross-region replication** for critical data
3. **Infrastructure as Code** for rapid rebuild
4. **Database snapshots** before major changes

## 🔍 Troubleshooting

### Common Issues

**EKS Nodes Not Joining Cluster:**
```bash
# Check IAM roles and security groups
aws eks describe-cluster --name onehub-v2-staging
kubectl get nodes
```

**Database Connection Issues:**
```bash
# Check security groups and connection strings
aws rds describe-db-instances
aws secretsmanager get-secret-value --secret-id [secret-arn]
```

**High Costs:**
```bash
# Check resource utilization
kubectl top nodes
kubectl top pods --all-namespaces
aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-01-31
```

### Health Checks
```bash
# Infrastructure health
./deploy.sh [env] plan  # Check for drift

# Application health
kubectl get componentstatuses
kubectl cluster-info

# Network connectivity
kubectl exec -it [pod-name] -- curl [service-endpoint]
```

## 📚 Additional Resources

- [AWS EKS Best Practices](https://aws.github.io/aws-eks-best-practices/)
- [Karpenter Documentation](https://karpenter.sh/)
- [OpenTofu Documentation](https://opentofu.org/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

## 🆘 Support

For infrastructure support:
1. Check this README for common solutions
2. Review CloudWatch logs and metrics
3. Check the [troubleshooting guide](./docs/troubleshooting.md)
4. Create an issue with infrastructure logs and error messages

---

## 🐳 Local Development Environment

This project includes a `docker-compose.yml` file to easily run third-party services required for local development.

### Running Metabase Locally

To test the dashboard functionality, you can run a local Metabase instance.

**Prerequisites:**
- Docker and Docker Compose

**To start the Metabase instance:**
```bash
docker-compose up -d
```

- Metabase will be available at `http://localhost:3000`.
- You will need to complete the initial setup, connect it to a data source (like a local Postgres DB), and create a dashboard.
- To enable the secure embedding feature, go to **Admin Settings -> Embedding**.

---

**Remember**: Always test changes in staging before applying to production!
