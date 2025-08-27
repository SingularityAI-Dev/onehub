# infrastructure/database.tf

# This file contains placeholders for our database and cache resources.
# OneHub v2 uses managed, serverless providers (Neon for Postgres, Upstash for Redis)
# to minimize operational overhead.

# --- Placeholder for Neon Serverless Postgres ---
# In a real-world scenario, you might use a dedicated provider if one exists,
# or you would use the AWS Secrets Manager to store the connection string
# provisioned through the Neon console. This null_resource serves as a dependency marker.
resource "null_resource" "neon_postgres_db" {
  provisioner "local-exec" {
    command = <<EOT
      echo "------------------------------------------------------------------"
      echo "  MANUAL ACTION REQUIRED:"
      echo "  1. Provision a new serverless Postgres database in Neon."
      echo "     (https://neon.tech)"
      echo "  2. Create a new secret in AWS Secrets Manager named:"
      echo "     'onehub/database-credentials/${var.environment}'"
      echo "  3. Store the database connection URI in the secret."
      echo "------------------------------------------------------------------"
    EOT
  }

  triggers = {
    # This ensures the provisioner runs if the environment name changes.
    environment = var.environment
  }
}

# --- Placeholder for Upstash Serverless Redis ---
# Similar to Neon, this serves as a placeholder for the manual provisioning
# of our Redis cache in Upstash.
resource "null_resource" "upstash_redis_cache" {
  provisioner "local-exec" {
    command = <<EOT
      echo "------------------------------------------------------------------"
      echo "  MANUAL ACTION REQUIRED:"
      echo "  1. Provision a new serverless Redis cache in Upstash."
      echo "     (https://upstash.com)"
      echo "  2. Create a new secret in AWS Secrets Manager named:"
      echo "     'onehub/redis-credentials/${var.environment}'"
      echo "  3. Store the Redis connection URI in the secret."
      echo "------------------------------------------------------------------"
    EOT
  }

  triggers = {
    # This ensures the provisioner runs if the environment name changes.
    environment = var.environment
  }
}
