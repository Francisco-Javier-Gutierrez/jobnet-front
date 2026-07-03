terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

module "frontend" {
  source      = "../../modules/cloudfront_s3_lambda"
  environment = "dev"
}

output "s3_bucket_name" {
  value = module.frontend.s3_bucket_name
}

output "cloudfront_domain" {
  value = module.frontend.cloudfront_domain
}

output "lambda_function_name" {
  value = module.frontend.lambda_function_name
}
