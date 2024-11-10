terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
    databricks = {
      source  = "databricks/databricks"
      version = "~> 1.21.0"  # Update to the latest version
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
}

# Account-Level Provider
provider "databricks" {
  alias = "account"
  host  = "https://accounts.cloud.databricks.com"
  token = var.databricks_account_token
}

# Workspace-Level Provider (configured after workspace creation)
provider "databricks" {
  alias = "workspace"
  host  = databricks_mws_workspaces.this.workspace_url
  token = var.databricks_workspace_token
}

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

# Create S3 Bucket
resource "aws_s3_bucket" "databricks_bucket" {
  bucket = "databricks-storage-${random_string.suffix.result}"
  tags = {
    Name        = "Databricks Storage Bucket"
    Environment = "Production"
  }
}

# IAM Role for Databricks
resource "aws_iam_role" "databricks_s3_role" {
  name = "databricks-s3-access-role-${random_string.suffix.result}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = [
            "ec2.amazonaws.com",
            "databricks.amazonaws.com"
          ]
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# IAM Policy for S3 Access
resource "aws_iam_role_policy" "databricks_s3_policy" {
  role = aws_iam_role.databricks_s3_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:ListBucket",
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ],
        Resource = [
          aws_s3_bucket.databricks_bucket.arn,
          "${aws_s3_bucket.databricks_bucket.arn}/*"
        ]
      }
    ]
  })
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "databricks_s3_profile" {
  name = "databricks-s3-instance-profile-${random_string.suffix.result}"
  role = aws_iam_role.databricks_s3_role.name
}

# Databricks MWS Credentials
resource "databricks_mws_credentials" "this" {
  provider         = databricks.account
  account_id       = var.databricks_account_id
  credentials_name = "my-databricks-credentials-${random_string.suffix.result}"
  role_arn         = aws_iam_role.databricks_s3_role.arn
}

# Databricks MWS Storage Configuration
resource "databricks_mws_storage_configurations" "this" {
  provider                   = databricks.account
  account_id                 = var.databricks_account_id
  storage_configuration_name = "my-databricks-storage-config-${random_string.suffix.result}"
  bucket_name                = aws_s3_bucket.databricks_bucket.bucket
}

# Create Databricks Workspace
resource "databricks_mws_workspaces" "this" {
  provider                 = databricks.account
  account_id               = var.databricks_account_id
  aws_region               = var.aws_region
  credentials_id           = databricks_mws_credentials.this.credentials_id
  storage_configuration_id = databricks_mws_storage_configurations.this.storage_configuration_id
  workspace_name           = var.workspace_name
  pricing_tier             = "standard"
}

# Register Instance Profile with Workspace (after creation)
resource "databricks_instance_profile" "this" {
  provider             = databricks.workspace
  instance_profile_arn = aws_iam_instance_profile.databricks_s3_profile.arn
  skip_validation      = true
}

# Mount S3 Bucket
resource "databricks_mount" "s3_mount" {
  provider = databricks.workspace
  name     = "/mnt/databricks-bucket"

  s3 {
    bucket_name      = aws_s3_bucket.databricks_bucket.bucket
    instance_profile = aws_iam_instance_profile.databricks_s3_profile.arn
  }

  depends_on = [databricks_instance_profile.this]
}

# Create Databricks Cluster
resource "databricks_cluster" "my_cluster" {
  provider                 = databricks.workspace
  cluster_name             = "example-cluster"
  spark_version            = "11.3.x-scala2.12"  # Update to a current LTS version
  node_type_id             = "i3.xlarge"
  autotermination_minutes  = 60

  aws_attributes {
    instance_profile_arn = aws_iam_instance_profile.databricks_s3_profile.arn
  }

  autoscale {
    min_workers = 1
    max_workers = 3
  }

  depends_on = [databricks_instance_profile.this]
}
