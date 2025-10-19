terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 6.12"
        }
        cockroachdb = {
          source = "cockroachdb/cockroach"
          version = "~> 1.14.0"
        }
    }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Application = "daily-visuai"
    }
  }
}

provider "cockroachdb" {
  apikey = var.cockroachdb_api_key
}

resource "random_id" "random" {
  byte_length = 8
}

resource "aws_s3_bucket" "bootstrap_bucket" {
  bucket = "tf-state-${lower(random_id.random.id)}"
  region = var.aws_region
}

resource "cockroach_cluster" "cockroach_cluster" {
  provider = cockroachdb
  name = "cockroach-basic"
  cloud_provider = "AWS"
  plan = "BASIC"
  serverless = {
    usage_limits = {
      request_unit_limit = 4000000
      storage_mib_limit = 2000
    }
  }
  regions = [{ name = var.aws_region }]
  delete_protection = false
}