terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "~> 6.12"
        }
    }
    backend "s3" {
      key    = "cron-lambda.tfstate"
  }
}

provider "aws" {
  region = "us-west-2"
}

module "role" {
  source = "./modules/role"
}

module "lambda" {
  source = "./modules/lambda"
  iam_role_arn = module.role.iam_role_arn
}

module "secrets" {
  source = "./modules/secrets"
  lambda_secrets = var.lambda_secrets
}