terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket  = "jobnet-terraform-state-prod-293626296338"
    key     = "front/prod/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region  = "us-east-1"
}


module "frontend" {
  source          = "../../modules/cloudfront_s3_lambda"
  environment     = "prod"
  lambda_zip_path = "dummy_payload.zip"
}

output "s3_bucket_name" {
  value = module.frontend.s3_bucket_name
}

output "cloudfront_domain" {
  value = module.frontend.cloudfront_domain
}

output "cloudfront_distribution_id" {
  value = module.frontend.cloudfront_distribution_id
}

output "lambda_function_name" {
  value = module.frontend.lambda_function_name
}
