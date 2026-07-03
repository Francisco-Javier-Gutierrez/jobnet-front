output "s3_bucket_name" {
  value = aws_s3_bucket.assets.bucket
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.cdn.domain_name
}

output "lambda_function_name" {
  value = aws_lambda_function.ssr_server.function_name
}
