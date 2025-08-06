#!/bin/bash

# STOX Gateway - Simple One-Time AWS Setup
# This script creates AWS resources ONCE for your project

set -e

BUCKET_NAME="${AWS_S3_BUCKET_NAME:-btk-stox-s3}"
REGION="${AWS_REGION:-us-east-1}"

echo "🚀 Setting up AWS infrastructure for STOX Gateway..."
echo "Bucket: $BUCKET_NAME"
echo "Region: $REGION"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Ensure jq is available
if ! command -v jq &> /dev/null; then
    echo "❌ jq not found. Install jq to parse AWS CLI output."
    exit 1
fi


if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# Create S3 bucket if it doesn't exist
echo "📦 Creating S3 bucket..."
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "⚠️  Bucket $BUCKET_NAME already exists - skipping creation"
else
    if [ "$REGION" = "us-east-1" ]; then
        aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION"
    else
        aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION" \
            --create-bucket-configuration LocationConstraint="$REGION"
    fi
    echo "✅ Bucket created"
fi

# Configure bucket security
echo "🔒 Configuring bucket security..."
aws s3api put-bucket-versioning --bucket "$BUCKET_NAME" \
    --versioning-configuration Status=Enabled

aws s3api put-bucket-encryption --bucket "$BUCKET_NAME" \
    --server-side-encryption-configuration '{
        "Rules": [{
            "ApplyServerSideEncryptionByDefault": {
                "SSEAlgorithm": "AES256"
            }
        }]
    }'

aws s3api put-public-access-block --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Create Origin Access Control
echo "🔐 Creating Origin Access Control..."
OAC_RESULT=$(aws cloudfront create-origin-access-control \
    --origin-access-control-config '{
        "Name": "stox-gateway-oac",
        "Description": "STOX Gateway S3 access",
        "OriginAccessControlOriginType": "s3",
        "SigningBehavior": "always",
        "SigningProtocol": "sigv4"
    }' --output json)

OAC_ID=$(echo "$OAC_RESULT" | jq -r '.OriginAccessControl.Id')
echo "✅ OAC created: $OAC_ID"

# Create CloudFront distribution
echo "🌐 Creating CloudFront distribution..."
ORIGIN_DOMAIN="$BUCKET_NAME.s3.$REGION.amazonaws.com"
CALLER_REF="stox-$(date +%s)"

CF_CONFIG='{
    "CallerReference": "'$CALLER_REF'",
    "Comment": "STOX Gateway Image Distribution",
    "Enabled": true,
    "Origins": {
        "Quantity": 1,
        "Items": [{
            "Id": "S3-'$BUCKET_NAME'",
            "DomainName": "'$ORIGIN_DOMAIN'",
            "OriginAccessControlId": "'$OAC_ID'",
            "S3OriginConfig": {
                "OriginAccessIdentity": ""
            }
        }]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-'$BUCKET_NAME'",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
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
    "PriceClass": "PriceClass_100"
}'

CF_RESULT=$(aws cloudfront create-distribution --distribution-config "$CF_CONFIG" --output json)
DISTRIBUTION_ID=$(echo "$CF_RESULT" | jq -r '.Distribution.Id')
DOMAIN_NAME=$(echo "$CF_RESULT" | jq -r '.Distribution.DomainName')

echo "✅ CloudFront created:"
echo "   ID: $DISTRIBUTION_ID"
echo "   Domain: $DOMAIN_NAME"

# Update S3 bucket policy for CloudFront
echo "📝 Updating bucket policy..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

BUCKET_POLICY='{
    "Version": "2012-10-17",
    "Statement": [{
        "Sid": "AllowCloudFrontAccess",
        "Effect": "Allow",
        "Principal": {
            "Service": "cloudfront.amazonaws.com"
        },
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*",
        "Condition": {
            "StringEquals": {
                "AWS:SourceArn": "arn:aws:cloudfront::'$ACCOUNT_ID':distribution/'$DISTRIBUTION_ID'"
            }
        }
    }]
}'

aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy "$BUCKET_POLICY"

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Add these to your .env file:"
echo ""
echo "AWS_S3_BUCKET_NAME=$BUCKET_NAME"
echo "AWS_S3_REGION=$REGION"
echo "AWS_CLOUDFRONT_DISTRIBUTION_ID=$DISTRIBUTION_ID"
echo "AWS_CLOUDFRONT_DOMAIN_NAME=$DOMAIN_NAME"
echo ""
echo "🌐 CloudFront URL: https://$DOMAIN_NAME"
echo "⏳ Note: Distribution deployment takes 15-20 minutes"
