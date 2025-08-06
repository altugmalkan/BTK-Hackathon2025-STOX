#!/bin/bash

# STOX Gateway - AWS Infrastructure Setup Script
# This script creates the necessary AWS resources for the image management system
# including S3 bucket, CloudFront distribution, and IAM policies

set -e  # Exit on any error

# Configuration
BUCKET_NAME="${AWS_S3_BUCKET_NAME:-btk-stox-s3}"
REGION="${AWS_REGION:-us-east-1}"
PROJECT_NAME="stox-gateway"
ENVIRONMENT="${ENVIRONMENT:-development}"

echo "=========================================="
echo "STOX Gateway AWS Infrastructure Setup"
echo "=========================================="
echo "Bucket Name: $BUCKET_NAME"
echo "Region: $REGION"
echo "Environment: $ENVIRONMENT"
echo "=========================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "Visit: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI is configured and ready"

# Function to check if S3 bucket exists
bucket_exists() {
    aws s3api head-bucket --bucket "$1" 2>/dev/null
}

# Function to create S3 bucket with proper configuration
create_s3_bucket() {
    echo "📦 Creating S3 bucket: $BUCKET_NAME"
    
    if bucket_exists "$BUCKET_NAME"; then
        echo "⚠️  S3 bucket $BUCKET_NAME already exists"
        return 0
    fi
    
    # Create bucket
    if [ "$REGION" = "us-east-1" ]; then
        aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION"
    else
        aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION" \
            --create-bucket-configuration LocationConstraint="$REGION"
    fi
    
    # Enable versioning
    aws s3api put-bucket-versioning --bucket "$BUCKET_NAME" \
        --versioning-configuration Status=Enabled
    
    # Enable server-side encryption
    aws s3api put-bucket-encryption --bucket "$BUCKET_NAME" \
        --server-side-encryption-configuration '{
            "Rules": [
                {
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    },
                    "BucketKeyEnabled": true
                }
            ]
        }'
    
    # Block public access (security best practice)
    aws s3api put-public-access-block --bucket "$BUCKET_NAME" \
        --public-access-block-configuration \
        BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
    
    # Add bucket tagging
    aws s3api put-bucket-tagging --bucket "$BUCKET_NAME" \
        --tagging TagSet='[
            {"Key":"Project","Value":"'$PROJECT_NAME'"},
            {"Key":"Environment","Value":"'$ENVIRONMENT'"},
            {"Key":"Purpose","Value":"Image Storage"},
            {"Key":"CreatedBy","Value":"stox-gateway-setup"}
        ]'
    
    echo "✅ S3 bucket created and configured successfully"
}

# Function to create CloudFront Origin Access Control
create_origin_access_control() {
    echo "🔒 Creating CloudFront Origin Access Control"
    
    local oac_config='{
        "Name": "'$PROJECT_NAME'-s3-oac",
        "Description": "Origin Access Control for STOX Gateway S3 bucket",
        "OriginAccessControlOriginType": "s3",
        "SigningBehavior": "always",
        "SigningProtocol": "sigv4"
    }'
    
    local oac_result=$(aws cloudfront create-origin-access-control \
        --origin-access-control-config "$oac_config" \
        --query 'OriginAccessControl.Id' --output text)
    
    echo "✅ Origin Access Control created: $oac_result"
    echo "$oac_result"
}

# Function to create CloudFront distribution
create_cloudfront_distribution() {
    echo "🌐 Creating CloudFront distribution"
    
    local origin_domain="$BUCKET_NAME.s3.$REGION.amazonaws.com"
    local caller_reference="$PROJECT_NAME-$(date +%s)"
    local oac_id="$1"
    
    local distribution_config='{
        "CallerReference": "'$caller_reference'",
        "Comment": "STOX Gateway - Secure image delivery distribution",
        "Enabled": true,
        "Origins": {
            "Quantity": 1,
            "Items": [
                {
                    "Id": "S3-'$BUCKET_NAME'",
                    "DomainName": "'$origin_domain'",
                    "OriginAccessControlId": "'$oac_id'",
                    "S3OriginConfig": {
                        "OriginAccessIdentity": ""
                    },
                    "ConnectionAttempts": 3,
                    "ConnectionTimeout": 10
                }
            ]
        },
        "DefaultCacheBehavior": {
            "TargetOriginId": "S3-'$BUCKET_NAME'",
            "ViewerProtocolPolicy": "redirect-to-https",
            "TrustedSigners": {
                "Enabled": false,
                "Quantity": 0
            },
            "MinTTL": 0,
            "DefaultTTL": 86400,
            "MaxTTL": 31536000,
            "Compress": true,
            "AllowedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"],
                "CachedMethods": {
                    "Quantity": 2,
                    "Items": ["GET", "HEAD"]
                }
            },
            "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
        },
        "PriceClass": "PriceClass_100",
        "HttpVersion": "http2",
        "IsIPV6Enabled": true
    }'
    
    local distribution_result=$(aws cloudfront create-distribution \
        --distribution-config "$distribution_config")
    
    local distribution_id=$(echo "$distribution_result" | jq -r '.Distribution.Id')
    local domain_name=$(echo "$distribution_result" | jq -r '.Distribution.DomainName')
    
    echo "✅ CloudFront distribution created:"
    echo "   Distribution ID: $distribution_id"
    echo "   Domain Name: $domain_name"
    
    echo "$distribution_id,$domain_name"
}

# Function to update S3 bucket policy for CloudFront access
update_s3_bucket_policy() {
    local distribution_id="$1"
    
    echo "📝 Updating S3 bucket policy for CloudFront access"
    
    local bucket_policy='{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowCloudFrontServicePrincipal",
                "Effect": "Allow",
                "Principal": {
                    "Service": "cloudfront.amazonaws.com"
                },
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*",
                "Condition": {
                    "StringEquals": {
                        "AWS:SourceArn": "arn:aws:cloudfront::'$(aws sts get-caller-identity --query Account --output text)':distribution/'$distribution_id'"
                    }
                }
            }
        ]
    }'
    
    aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy "$bucket_policy"
    
    echo "✅ S3 bucket policy updated for CloudFront access"
}

# Function to create IAM policy for application access
create_iam_policy() {
    echo "👤 Creating IAM policy for application access"
    
    local policy_name="STOXGatewayS3CloudFrontPolicy"
    local policy_document='{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "S3BucketAccess",
                "Effect": "Allow",
                "Action": [
                    "s3:GetObject",
                    "s3:PutObject",
                    "s3:DeleteObject",
                    "s3:ListBucket"
                ],
                "Resource": [
                    "arn:aws:s3:::'$BUCKET_NAME'",
                    "arn:aws:s3:::'$BUCKET_NAME'/*"
                ]
            },
            {
                "Sid": "CloudFrontAccess",
                "Effect": "Allow",
                "Action": [
                    "cloudfront:GetDistribution",
                    "cloudfront:CreateInvalidation",
                    "cloudfront:GetInvalidation",
                    "cloudfront:ListInvalidations"
                ],
                "Resource": "*"
            }
        ]
    }'
    
    # Check if policy already exists
    if aws iam get-policy --policy-arn "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/$policy_name" &>/dev/null; then
        echo "⚠️  IAM policy $policy_name already exists"
        return 0
    fi
    
    aws iam create-policy \
        --policy-name "$policy_name" \
        --policy-document "$policy_document" \
        --description "Policy for STOX Gateway to access S3 and CloudFront"
    
    echo "✅ IAM policy created: $policy_name"
    echo "📋 To attach this policy to a user or role, use:"
    echo "   aws iam attach-user-policy --user-name YOUR_USER --policy-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/$policy_name"
}

# Function to output environment variables
output_environment_variables() {
    local distribution_id="$1"
    local domain_name="$2"
    
    echo ""
    echo "=========================================="
    echo "🎉 Infrastructure Setup Complete!"
    echo "=========================================="
    echo ""
    echo "📋 Environment Variables for your application:"
    echo ""
    echo "export AWS_S3_BUCKET_NAME=\"$BUCKET_NAME\""
    echo "export AWS_S3_REGION=\"$REGION\""
    echo "export AWS_CLOUDFRONT_DISTRIBUTION_ID=\"$distribution_id\""
    echo "export AWS_CLOUDFRONT_DOMAIN_NAME=\"$domain_name\""
    echo "export AWS_CLOUDFRONT_REGION=\"$REGION\""
    echo ""
    echo "🔧 Add these to your .env file or export them in your shell"
    echo ""
    echo "📁 Your S3 bucket structure will be:"
    echo "   $BUCKET_NAME/"
    echo "   ├── users/"
    echo "   │   ├── {user_id}/"
    echo "   │   │   ├── original/"
    echo "   │   │   │   └── image_files..."
    echo "   │   │   └── enhanced/"
    echo "   │   │       └── enhanced_image_files..."
    echo ""
    echo "🌐 CloudFront URL: https://$domain_name"
    echo ""
    echo "⏳ Note: CloudFront distribution deployment may take 15-20 minutes"
}

# Main execution
main() {
    echo "🚀 Starting infrastructure setup..."
    
    # Create S3 bucket
    create_s3_bucket
    
    # Create Origin Access Control
    oac_id=$(create_origin_access_control)
    
    # Create CloudFront distribution
    cf_result=$(create_cloudfront_distribution "$oac_id")
    distribution_id=$(echo "$cf_result" | cut -d',' -f1)
    domain_name=$(echo "$cf_result" | cut -d',' -f2)
    
    # Update S3 bucket policy
    update_s3_bucket_policy "$distribution_id"
    
    # Create IAM policy
    create_iam_policy
    
    # Output results
    output_environment_variables "$distribution_id" "$domain_name"
}

# Run main function
main
