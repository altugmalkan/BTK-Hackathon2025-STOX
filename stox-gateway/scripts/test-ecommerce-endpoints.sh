#!/bin/bash

# STOX Gateway E-Commerce Endpoints End-to-End Test Script
# Bu script tüm e-commerce endpoint'lerini test eder

# Remove the exit on error for now
# set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
GATEWAY_URL="http://localhost:8080"
API_KEY="your_mock_ecommerce_api_key_here"
TEST_IMAGE_PATH="/Users/altugmalkan/Github/stox-services/stox-image-service/src/test_images/image.jpg"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Helper functions
print_header() {
    echo -e "\n${BLUE}=================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=================================${NC}\n"
}

print_test() {
    echo -e "${YELLOW}📋 Testing: $1${NC}"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

print_success() {
    echo -e "${GREEN}✅ SUCCESS: $1${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
}

print_error() {
    echo -e "${RED}❌ FAILED: $1${NC}"
    echo -e "${RED}   Response: $2${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
}

print_info() {
    echo -e "${BLUE}ℹ️  INFO: $1${NC}"
}

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local expected_status=$4
    local additional_args="${5:-}"
    
    print_test "$description"
    
    local full_url="${GATEWAY_URL}${endpoint}"
    local response
    local status_code
    
    # Make request and capture response
    if [[ "$method" == "GET" ]]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "$full_url" \
            -H "X-API-Key: $API_KEY" \
            -H "Content-Type: application/json" \
            $additional_args)
    elif [[ "$method" == "POST" ]]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$full_url" \
            -H "X-API-Key: $API_KEY" \
            -H "Content-Type: application/json" \
            $additional_args)
    elif [[ "$method" == "PUT" ]]; then
        response=$(curl -s -w "\n%{http_code}" -X PUT "$full_url" \
            -H "X-API-Key: $API_KEY" \
            -H "Content-Type: application/json" \
            $additional_args)
    elif [[ "$method" == "DELETE" ]]; then
        response=$(curl -s -w "\n%{http_code}" -X DELETE "$full_url" \
            -H "X-API-Key: $API_KEY" \
            -H "Content-Type: application/json" \
            $additional_args)
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract response body (all but last line)
    response_body=$(echo "$response" | sed '$d')
    
    # Check status code
    if [[ "$status_code" == "$expected_status" ]]; then
        print_success "$description (Status: $status_code)"
        if [[ ! -z "$response_body" ]]; then
            echo -e "${GREEN}   Response: ${response_body:0:100}...${NC}"
        fi
    else
        print_error "$description (Expected: $expected_status, Got: $status_code)" "$response_body"
    fi
    
    echo ""
}

# Test multipart endpoint
test_multipart_endpoint() {
    local endpoint=$1
    local description=$2
    local expected_status=$3
    local product_data=$4
    local image_field_name="${5:-image}"
    
    print_test "$description"
    
    local full_url="${GATEWAY_URL}${endpoint}"
    local response
    local status_code
    
    if [[ ! -f "$TEST_IMAGE_PATH" ]]; then
        print_error "$description" "Test image not found: $TEST_IMAGE_PATH"
        return
    fi
    
    # Make multipart request
    response=$(curl -s -w "\n%{http_code}" -X POST "$full_url" \
        -H "X-API-Key: $API_KEY" \
        -F "product=$product_data" \
        -F "$image_field_name=@$TEST_IMAGE_PATH")
    
    # Extract status code and response body
    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    # Check status code
    if [[ "$status_code" == "$expected_status" ]]; then
        print_success "$description (Status: $status_code)"
        if [[ ! -z "$response_body" ]]; then
            echo -e "${GREEN}   Response: ${response_body:0:150}...${NC}"
        fi
    else
        print_error "$description (Expected: $expected_status, Got: $status_code)" "$response_body"
    fi
    
    echo ""
}

# Main test execution
main() {
    print_header "STOX Gateway E-Commerce Endpoints Test"
    
    print_info "Gateway URL: $GATEWAY_URL"
    print_info "API Key: ${API_KEY:0:20}..."
    print_info "Test Image: $TEST_IMAGE_PATH"
    
    # Check if gateway is running
    print_test "Gateway Health Check"
    if curl -s "$GATEWAY_URL/health" > /dev/null 2>&1; then
        print_success "Gateway is running"
    else
        print_error "Gateway Health Check" "Gateway is not responding"
        echo -e "${RED}Please make sure the gateway is running on $GATEWAY_URL${NC}"
        exit 1
    fi
    
    # Check if test image exists
    if [[ ! -f "$TEST_IMAGE_PATH" ]]; then
        print_error "Test Image Check" "Test image not found: $TEST_IMAGE_PATH"
        echo -e "${RED}Please make sure the test image exists${NC}"
        exit 1
    fi
    
    print_header "Testing Basic E-Commerce Endpoints"
    
    # Test 1: Get Products (should work)
    test_endpoint "GET" "/api/v1/ecommerce/products" "Get Products List" "200"
    
    # Test 2: Get Product Statistics  
    test_endpoint "GET" "/api/v1/ecommerce/products/statistics" "Get Product Statistics" "200"
    
    # Test 3: Get Orders
    test_endpoint "GET" "/api/v1/ecommerce/orders" "Get Orders List" "200"
    
    # Test 4: Create Basic Product (might fail due to category)
    test_endpoint "POST" "/api/v1/ecommerce/products" "Create Basic Product" "201" \
        '-d {"title":"Test Product","description":"Basic test product","price":99.99,"stock":10,"categoryId":"123e4567-e89b-12d3-a456-426614174000"}'
    
    print_header "Testing Enhanced Image Integration"
    
    # Test 5: Image Enhancement Test (should work)
    test_multipart_endpoint "/api/v1/ecommerce/products/test-image" \
        "AI Image Enhancement Test" "200" \
        '{"productName":"End-to-End Test Product"}'
    
    # Test 6: Create Product with Enhanced Image (might fail due to category)
    test_multipart_endpoint "/api/v1/ecommerce/products/with-image" \
        "Create Product with Enhanced Image" "201" \
        '{"title":"AI Enhanced E2E Product","description":"Product created via end-to-end test with AI enhanced image","price":199.99,"stock":5,"categoryId":"123e4567-e89b-12d3-a456-426614174000"}'
    
    print_header "Testing API Key Validation"
    
    # Test 7: Invalid API Key
    print_test "Invalid API Key Test"
    response=$(curl -s -w "\n%{http_code}" -X GET "$GATEWAY_URL/api/v1/ecommerce/products" \
        -H "X-API-Key: invalid-key" \
        -H "Content-Type: application/json")
    status_code=$(echo "$response" | tail -n1)
    if [[ "$status_code" == "401" ]]; then
        print_success "Invalid API Key Test (Status: 401)"
    else
        print_error "Invalid API Key Test (Expected: 401, Got: $status_code)" "$(echo "$response" | sed '$d')"
    fi
    echo ""
    
    # Test 8: Missing API Key
    print_test "Missing API Key Test"
    response=$(curl -s -w "\n%{http_code}" -X GET "$GATEWAY_URL/api/v1/ecommerce/products" \
        -H "Content-Type: application/json")
    status_code=$(echo "$response" | tail -n1)
    if [[ "$status_code" == "401" ]]; then
        print_success "Missing API Key Test (Status: 401)"
    else
        print_error "Missing API Key Test (Expected: 401, Got: $status_code)" "$(echo "$response" | sed '$d')"
    fi
    echo ""
    
    print_header "Testing Error Cases"
    
    # Test 9: Non-existent Product
    test_endpoint "GET" "/api/v1/ecommerce/products/non-existent-id" "Get Non-existent Product" "404"
    
    # Test 10: Invalid JSON for Product Creation
    print_test "Create Product with Invalid JSON"
    response=$(curl -s -w "\n%{http_code}" -X POST "$GATEWAY_URL/api/v1/ecommerce/products" \
        -H "X-API-Key: $API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"invalid": "json"' 2>/dev/null || echo -e "\n400")
    status_code=$(echo "$response" | tail -n1)
    if [[ "$status_code" == "400" ]]; then
        print_success "Create Product with Invalid JSON (Status: 400)"
    else
        print_error "Create Product with Invalid JSON (Expected: 400, Got: $status_code)" "$(echo "$response" | sed '$d')"
    fi
    echo ""
    
    print_header "Testing Multipart Form Validation"
    
    # Test 11: Enhanced Image without Image File
    print_test "Enhanced Image Test without Image File"
    response=$(curl -s -w "\n%{http_code}" -X POST "$GATEWAY_URL/api/v1/ecommerce/products/test-image" \
        -H "X-API-Key: $API_KEY" \
        -F "productName=Test Without Image")
    status_code=$(echo "$response" | tail -n1)
    if [[ "$status_code" == "400" ]]; then
        print_success "Enhanced Image Test without Image File (Status: 400)"
    else
        print_error "Enhanced Image Test without Image File (Expected: 400, Got: $status_code)" "$(echo "$response" | sed '$d')"
    fi
    echo ""
    
    # Print summary
    print_header "Test Summary"
    echo -e "${BLUE}Total Tests: $TOTAL_TESTS${NC}"
    echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
    echo -e "${RED}Failed: $FAILED_TESTS${NC}"
    
    if [[ $FAILED_TESTS -eq 0 ]]; then
        echo -e "\n${GREEN}🎉 All tests passed!${NC}"
        exit 0
    else
        echo -e "\n${YELLOW}⚠️  Some tests failed. Check the output above for details.${NC}"
        exit 1
    fi
}

# Run tests
main "$@"
