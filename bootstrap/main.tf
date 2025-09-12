terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "~> 6.12"
        }
    }
}

provider "aws" {
  region = "us-west-2"
}

resource "random_id" "random" {
  byte_length = 8
}

resource "aws_s3_bucket" "this" {
  bucket = "tf-state-${lower(random_id.random.id)}"
  region = "us-west-2"
}