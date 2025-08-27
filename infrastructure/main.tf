# infrastructure/main.tf

# Configure the OpenTofu/Terraform settings, including the required version and backend configuration.
# The backend is configured to use an S3 bucket for state storage and a DynamoDB table for state locking,
# which is a best practice for team collaboration.
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # These will be configured via a backend.hcl file per environment
    # bucket         = "onehub-terraform-state-staging"
    # key            = "infrastructure/terraform.tfstate"
    # region         = "us-west-2"
    # dynamodb_table = "onehub-terraform-locks-staging"
    # encrypt        = true
  }
}

# Configure the AWS Provider.
# The region is passed in via a variable, allowing for different regions per environment.
provider "aws" {
  region = var.aws_region
}

# A random pet name generator to ensure certain resources are unique.
# This is useful for resources like S3 buckets that have globally unique name requirements.
resource "random_pet" "suffix" {
  length = 2
}
