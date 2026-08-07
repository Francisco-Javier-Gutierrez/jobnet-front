$ErrorActionPreference = "Stop"
$env:AWS_PROFILE = "terra-profile"

Write-Host "Building Nuxt app..."
npm run build

Write-Host "Zipping SSR payload..."
Set-Location .output/server
if (Test-Path ../../terraform/environments/prod/dummy_payload.zip) {
    Remove-Item ../../terraform/environments/prod/dummy_payload.zip -Force
}
Compress-Archive -Path * -DestinationPath ../../terraform/environments/prod/dummy_payload.zip -Force

Write-Host "Deploying with Terraform..."
Set-Location ../../terraform/environments/prod
terraform init
terraform apply -auto-approve

Write-Host "Syncing static assets to S3..."
$BUCKET_NAME = terraform output -raw s3_bucket_name
aws s3 sync ../../../.output/public "s3://$BUCKET_NAME" --delete

Write-Host "Invalidating CloudFront cache..."
$DISTRIBUTION_ID = terraform output -raw cloudfront_distribution_id
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

Write-Host "Frontend deployed successfully!"
