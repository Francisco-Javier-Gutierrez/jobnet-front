variable "environment" {
  type        = string
}

variable "domain_name" {
  type        = string
  default     = "jobnet-platform.com"
}

variable "lambda_zip_path" {
  type        = string
  description = "Path to the lambda zip file"
}
