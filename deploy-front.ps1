# ==============================================================================
# Deploy Script: JobNet Nuxt 4 Frontend (SSR Lambda + S3 + CloudFront + Terraform)
# ==============================================================================

$ErrorActionPreference = "Stop"

# Define and preserve project root
$ROOT_DIR = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
Set-Location $ROOT_DIR

# Explicit AWS Profile configuration
$AWS_PROFILE_NAME = "terra-profile"
$env:AWS_PROFILE = $AWS_PROFILE_NAME
$env:AWS_DEFAULT_PROFILE = $AWS_PROFILE_NAME

# Environment variables for Nuxt SSR Build
$env:NODE_ENV = "production"
$env:NITRO_PRESET = "aws-lambda"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " [JobNet] Starting Frontend SSR Deployment            " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Project Root : $ROOT_DIR"
Write-Host "AWS Profile  : $AWS_PROFILE_NAME (Forced)"
Write-Host "Nitro Preset : $env:NITRO_PRESET"
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Clean previous build artifacts
Write-Host "`n[1/6] Cleaning previous build artifacts..." -ForegroundColor Yellow
if (Test-Path "$ROOT_DIR/.output") {
    Remove-Item -Path "$ROOT_DIR/.output" -Recurse -Force -ErrorAction SilentlyContinue
}

# 2. Build Nuxt 4 SSR application for AWS Lambda
Write-Host "`n[2/6] Building Nuxt SSR application (Nitro aws-lambda)..." -ForegroundColor Yellow
Set-Location $ROOT_DIR
npm run build

if (-not (Test-Path "$ROOT_DIR/.output/server") -or -not (Test-Path "$ROOT_DIR/.output/public")) {
    Write-Error "Build failed: .output/server or .output/public directory not found!"
    exit 1
}

# 3. Package SSR Lambda payload zip
Write-Host "`n[3/6] Packaging SSR Lambda payload..." -ForegroundColor Yellow
$TERRAFORM_DIR = "$ROOT_DIR/terraform/environments/prod"
$ZIP_PATH = "$TERRAFORM_DIR/dummy_payload.zip"

if (Test-Path $ZIP_PATH) {
    Remove-Item -Path $ZIP_PATH -Force
}

# Compress server files for AWS Lambda handler (index.mjs at zip root)
Push-Location "$ROOT_DIR/.output/server"
try {
    Get-ChildItem -Path * | Compress-Archive -DestinationPath $ZIP_PATH -Force
}
finally {
    Pop-Location
}

if (-not (Test-Path $ZIP_PATH)) {
    Write-Error "Failed to create Lambda zip archive at $ZIP_PATH"
    exit 1
}
$zipSize = (Get-Item $ZIP_PATH).Length / 1MB
Write-Host "Lambda payload created successfully: $([Math]::Round($zipSize, 2)) MB" -ForegroundColor Green

# 4. Terraform Apply
Write-Host "`n[4/6] Applying Terraform Infrastructure with profile '$AWS_PROFILE_NAME'..." -ForegroundColor Yellow
Push-Location $TERRAFORM_DIR
try {
    terraform init
    terraform apply -auto-approve

    $BUCKET_NAME = (terraform output -raw s3_bucket_name).Trim()
    $DISTRIBUTION_ID = (terraform output -raw cloudfront_distribution_id).Trim()
    $LAMBDA_FUNCTION_NAME = (terraform output -raw lambda_function_name).Trim()
    $CLOUDFRONT_DOMAIN = (terraform output -raw cloudfront_domain).Trim()
}
finally {
    Pop-Location
}

Write-Host "Terraform Outputs:" -ForegroundColor Cyan
Write-Host "  - S3 Bucket       : $BUCKET_NAME"
Write-Host "  - Lambda Function : $LAMBDA_FUNCTION_NAME"
Write-Host "  - Distribution ID : $DISTRIBUTION_ID"
Write-Host "  - CloudFront Host : $CLOUDFRONT_DOMAIN"

# 5. Direct Lambda SSR Code Update & Sync S3 Assets
Write-Host "`n[5/6] Updating Lambda SSR function code..." -ForegroundColor Yellow
aws lambda update-function-code --profile $AWS_PROFILE_NAME --function-name $LAMBDA_FUNCTION_NAME --zip-file "fileb://$ZIP_PATH" --publish

Write-Host "Waiting for Lambda function code update to settle..."
aws lambda wait function-updated --profile $AWS_PROFILE_NAME --function-name $LAMBDA_FUNCTION_NAME
Write-Host "Lambda SSR function updated successfully!" -ForegroundColor Green

Write-Host "`nSyncing static assets to S3 (s3://$BUCKET_NAME)..." -ForegroundColor Yellow
# Sync hashed immutable assets with long-term cache
aws s3 sync "$ROOT_DIR/.output/public/_nuxt" "s3://$BUCKET_NAME/_nuxt" --profile $AWS_PROFILE_NAME --delete --cache-control "public,max-age=31536000,immutable"

# Sync other public static assets
aws s3 sync "$ROOT_DIR/.output/public" "s3://$BUCKET_NAME" --profile $AWS_PROFILE_NAME --delete --cache-control "public,max-age=3600"

# 6. Invalidate CloudFront Cache
Write-Host "`n[6/6] Invalidating CloudFront cache ($DISTRIBUTION_ID)..." -ForegroundColor Yellow
$INVALIDATION_ID = (aws cloudfront create-invalidation --profile $AWS_PROFILE_NAME --distribution-id $DISTRIBUTION_ID --paths "/*" --query "Invalidation.Id" --output text).Trim()
Write-Host "Invalidation created: $INVALIDATION_ID" -ForegroundColor Green

Set-Location $ROOT_DIR

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host " [Success] Nuxt SSR Frontend deployed successfully!   " -ForegroundColor Green
Write-Host " URL: https://$CLOUDFRONT_DOMAIN                      " -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
