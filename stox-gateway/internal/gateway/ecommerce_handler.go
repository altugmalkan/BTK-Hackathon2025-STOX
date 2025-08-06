package gateway

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.uber.org/zap"

	"stox-gateway/internal/aws"
	"stox-gateway/internal/grpcclients"
)

// ECommerceHandler handles MockECommerce integration
type ECommerceHandler struct {
	baseURL      string
	httpClient   *http.Client
	logger       *zap.Logger
	imageClient  *grpcclients.ImageClient
	s3Service    *aws.S3Service
}

// NewECommerceHandler creates a new e-commerce handler
func NewECommerceHandler(baseURL string, logger *zap.Logger, imageClient *grpcclients.ImageClient, s3Service *aws.S3Service) *ECommerceHandler {
	// Override baseURL with correct MockECommerce API URL
	actualBaseURL := "https://mock-api.gdgikcu.dev"
	
	logger.Info("ECommerceHandler initialized",
		zap.String("provided_baseURL", baseURL),
		zap.String("actual_baseURL", actualBaseURL))
	
	return &ECommerceHandler{
		baseURL:     actualBaseURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		logger:      logger,
		imageClient: imageClient,
		s3Service:   s3Service,
	}
}

// RegisterECommerceRoutes registers e-commerce routes to existing router
func (h *ECommerceHandler) RegisterECommerceRoutes(router *mux.Router, authHandler *AuthHandler) {
	// E-commerce subrouter with API key authentication (simpler than JWT for external access)
	ecommerce := router.PathPrefix("/api/v1/ecommerce").Subrouter()
	ecommerce.Use(h.APIKeyMiddleware)

	// Product management
	ecommerce.HandleFunc("/products", h.GetProducts).Methods("GET")
	ecommerce.HandleFunc("/products", h.CreateProduct).Methods("POST")
	ecommerce.HandleFunc("/products/integrate", h.IntegrateProductsWithEnhancedImages).Methods("POST")
	ecommerce.HandleFunc("/products/with-image", h.CreateProductWithEnhancedImage).Methods("POST")
	ecommerce.HandleFunc("/products/test-image", h.TestImageEnhancement).Methods("POST")
	ecommerce.HandleFunc("/products/{id}", h.GetProduct).Methods("GET")
	ecommerce.HandleFunc("/products/{id}", h.UpdateProduct).Methods("PUT")
	ecommerce.HandleFunc("/products/{id}/enhance-image", h.UpdateProductWithEnhancedImage).Methods("PUT")
	ecommerce.HandleFunc("/products/{id}", h.DeleteProduct).Methods("DELETE")
	ecommerce.HandleFunc("/products/statistics", h.GetProductStatistics).Methods("GET")

	// Order management
	ecommerce.HandleFunc("/orders", h.GetOrders).Methods("GET")

	h.logger.Info("E-commerce routes registered successfully")
}

// APIKeyMiddleware validates API key from X-API-Key header
func (h *ECommerceHandler) APIKeyMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiKey := r.Header.Get("X-API-Key")
		if apiKey == "" {
			http.Error(w, `{"success": false, "error": "API key required"}`, http.StatusUnauthorized)
			return
		}

		valid, _, err := h.ValidateAPIKey(apiKey)
		if err != nil {
			h.logger.Error("API key validation error", zap.Error(err))
			http.Error(w, `{"success": false, "error": "API key validation failed"}`, http.StatusInternalServerError)
			return
		}

		if !valid {
			http.Error(w, `{"success": false, "error": "Invalid API key"}`, http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ValidateAPIKey validates the API key - since MockECommerce doesn't have validation endpoint, use fallback
func (h *ECommerceHandler) ValidateAPIKey(apiKey string) (bool, string, error) {
	// MockECommerce doesn't have a validation endpoint, so we use fallback validation
	// In production, you would validate against your own API key database
	return h.fallbackAPIKeyValidation(apiKey), "mock-seller", nil
}

// fallbackAPIKeyValidation provides simple API key validation when MockECommerce is unavailable
func (h *ECommerceHandler) fallbackAPIKeyValidation(apiKey string) bool {
	// Real API keys from MockECommerce
	validKeys := []string{
		"mec_Mcw2eIpGmLyShgFNbT9w4rHFHzQLHzXLePkm9gglMx8", // STOX Gateway Integration key
		"test-api-key",        // Development fallback
		"development-key",     // Development fallback
	}
	
	for _, validKey := range validKeys {
		if apiKey == validKey {
			return true
		}
	}
	
	// For development, also accept MockECommerce format keys that start with "mec_"
	if len(apiKey) >= 4 && apiKey[:4] == "mec_" {
		return true
	}
	
	return false
}

// ProxyToMockECommerce proxies request to MockECommerce with API key
func (h *ECommerceHandler) ProxyToMockECommerce(w http.ResponseWriter, r *http.Request, endpoint, apiKey string) {
	// Create request to MockECommerce
	var reqBody io.Reader
	if r.Body != nil {
		bodyBytes, err := io.ReadAll(r.Body)
		if err != nil {
			h.writeErrorResponse(w, http.StatusBadRequest, "Failed to read request body")
			return
		}
		reqBody = bytes.NewBuffer(bodyBytes)
	}

	req, err := http.NewRequest(r.Method, h.baseURL+endpoint, reqBody)
	if err != nil {
		h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to create request")
		return
	}

	// Copy headers and add API key
	for key, values := range r.Header {
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}
	req.Header.Set("X-API-Key", apiKey)

	// Make request
	resp, err := h.httpClient.Do(req)
	if err != nil {
		h.logger.Error("MockECommerce request failed", zap.Error(err))
		h.writeErrorResponse(w, http.StatusBadGateway, "External service unavailable")
		return
	}
	defer resp.Body.Close()

	// Copy response headers
	for key, values := range resp.Header {
		for _, value := range values {
			w.Header().Add(key, value)
		}
	}

	// Copy status code and body
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}

// GetProducts handles GET /products
func (h *ECommerceHandler) GetProducts(w http.ResponseWriter, r *http.Request) {
	apiKey := h.getAPIKeyFromUser(r)
	if apiKey == "" {
		h.writeErrorResponse(w, http.StatusUnauthorized, "API key required")
		return
	}

	endpoint := "/api/v1/external/products"
	if r.URL.RawQuery != "" {
		endpoint += "?" + r.URL.RawQuery
	}

	h.ProxyToMockECommerce(w, r, endpoint, apiKey)
}

// CreateProduct handles POST /products
func (h *ECommerceHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	apiKey := h.getAPIKeyFromUser(r)
	if apiKey == "" {
		h.writeErrorResponse(w, http.StatusUnauthorized, "API key required")
		return
	}

	h.ProxyToMockECommerce(w, r, "/api/v1/external/products", apiKey)
}

// GetProduct handles GET /products/{id}
func (h *ECommerceHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productID := vars["id"]

	apiKey := h.getAPIKeyFromUser(r)
	if apiKey == "" {
		h.writeErrorResponse(w, http.StatusUnauthorized, "API key required")
		return
	}

	h.ProxyToMockECommerce(w, r, "/api/v1/external/products/"+productID, apiKey)
}

// UpdateProduct handles PUT /products/{id}
func (h *ECommerceHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productID := vars["id"]

	apiKey := h.getAPIKeyFromUser(r)
	if apiKey == "" {
		h.writeErrorResponse(w, http.StatusUnauthorized, "API key required")
		return
	}

	h.ProxyToMockECommerce(w, r, "/api/v1/external/products/"+productID, apiKey)
}

// DeleteProduct handles DELETE /products/{id}
func (h *ECommerceHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productID := vars["id"]

	apiKey := h.getAPIKeyFromUser(r)
	if apiKey == "" {
		h.writeErrorResponse(w, http.StatusUnauthorized, "API key required")
		return
	}

	h.ProxyToMockECommerce(w, r, "/api/v1/external/products/"+productID, apiKey)
}

// GetProductStatistics handles GET /products/statistics
func (h *ECommerceHandler) GetProductStatistics(w http.ResponseWriter, r *http.Request) {
	apiKey := h.getAPIKeyFromUser(r)
	if apiKey == "" {
		h.writeErrorResponse(w, http.StatusUnauthorized, "API key required")
		return
	}

	h.ProxyToMockECommerce(w, r, "/api/v1/external/products/statistics", apiKey)
}

// GetOrders handles GET /orders
func (h *ECommerceHandler) GetOrders(w http.ResponseWriter, r *http.Request) {
	apiKey := h.getAPIKeyFromUser(r)
	if apiKey == "" {
		h.writeErrorResponse(w, http.StatusUnauthorized, "API key required")
		return
	}

	// For MockECommerce, we'll use the seller orders endpoint
	// Since we don't have user authentication, we'll use a default seller endpoint
	endpoint := "/api/v1/order/my-orders"
	
	h.ProxyToMockECommerce(w, r, endpoint, apiKey)
}

// getAPIKeyFromUser gets API key from user context or header
func (h *ECommerceHandler) getAPIKeyFromUser(r *http.Request) string {
	// First try to get from X-API-Key header
	if apiKey := r.Header.Get("X-API-Key"); apiKey != "" {
		return apiKey
	}

	// For now, return a test API key - in production this would come from user profile
	return "test-api-key-for-development"
}

// Helper methods
func (h *ECommerceHandler) writeErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	
	response := map[string]string{
		"error": message,
	}
	json.NewEncoder(w).Encode(response)
}

// CreateProductWithEnhancedImage handles POST /products/with-image
func (h *ECommerceHandler) CreateProductWithEnhancedImage(w http.ResponseWriter, r *http.Request) {
	h.logger.Info("Creating product with enhanced image")

	// Parse multipart form
	err := r.ParseMultipartForm(32 << 20) // 32MB max
	if err != nil {
		h.logger.Error("Failed to parse multipart form", zap.Error(err))
		h.writeErrorResponse(w, http.StatusBadRequest, "Failed to parse form data")
		return
	}

	// Get product data from form
	productDataStr := r.FormValue("product")
	if productDataStr == "" {
		h.writeErrorResponse(w, http.StatusBadRequest, "Product data is required")
		return
	}

	// Parse product data
	var productData map[string]interface{}
	if err := json.Unmarshal([]byte(productDataStr), &productData); err != nil {
		h.logger.Error("Failed to parse product data", zap.Error(err))
		h.writeErrorResponse(w, http.StatusBadRequest, "Invalid product data JSON")
		return
	}

	// Get image file
	file, fileHeader, err := r.FormFile("image")
	if err != nil {
		h.logger.Error("Failed to get image file", zap.Error(err))
		h.writeErrorResponse(w, http.StatusBadRequest, "Image file is required")
		return
	}
	defer file.Close()

	// Read image data
	imageData, err := io.ReadAll(file)
	if err != nil {
		h.logger.Error("Failed to read image data", zap.Error(err))
		h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to read image file")
		return
	}

	// Get product name for AI enhancement
	productName, _ := productData["title"].(string)
	if productName == "" {
		productName = "Product Image"
	}

	// Enhance image using STOX Image Service
	enhancedImageURL, err := h.enhanceAndUploadImage(r.Context(), imageData, fileHeader.Header.Get("Content-Type"), productName)
	if err != nil {
		h.logger.Error("Failed to enhance image", zap.Error(err))
		// Continue with original image if enhancement fails
		originalImageURL, uploadErr := h.uploadOriginalImage(r.Context(), imageData, fileHeader.Filename)
		if uploadErr != nil {
			h.logger.Error("Failed to upload original image", zap.Error(uploadErr))
			h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to process image")
			return
		}
		enhancedImageURL = originalImageURL
	}

	// Add enhanced image URL to product data
	imageObject := map[string]interface{}{
		"imageUrl":     enhancedImageURL,
		"altText":      fmt.Sprintf("%s - AI Enhanced", productName),
		"isPrimary":    true,
		"displayOrder": 1,
	}
	
	// Handle images array safely
	if productData["images"] == nil {
		productData["images"] = []map[string]interface{}{imageObject}
	} else {
		// Try to cast existing images
		if existingImages, ok := productData["images"].([]interface{}); ok {
			// Convert to proper format and append
			images := make([]map[string]interface{}, 0, len(existingImages)+1)
			for _, img := range existingImages {
				if imgMap, ok := img.(map[string]interface{}); ok {
					images = append(images, imgMap)
				}
			}
			images = append(images, imageObject)
			productData["images"] = images
		} else {
			// If cast fails, replace with new array
			productData["images"] = []map[string]interface{}{imageObject}
		}
	}

	// Convert back to JSON for MockECommerce
	enhancedProductData, err := json.Marshal(productData)
	if err != nil {
		h.logger.Error("Failed to marshal enhanced product data", zap.Error(err))
		h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to process product data")
		return
	}

	// Create request to MockECommerce
	req, err := http.NewRequest("POST", h.baseURL+"/api/v1/external/products", bytes.NewBuffer(enhancedProductData))
	if err != nil {
		h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to create request")
		return
	}

	// Get API key and set headers
	apiKey := h.getAPIKeyFromUser(r)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", apiKey)

	// Make request to MockECommerce
	resp, err := h.httpClient.Do(req)
	if err != nil {
		h.logger.Error("MockECommerce request failed", zap.Error(err))
		h.writeErrorResponse(w, http.StatusBadGateway, "External service unavailable")
		return
	}
	defer resp.Body.Close()

	// Copy response headers
	for key, values := range resp.Header {
		for _, value := range values {
			w.Header().Add(key, value)
		}
	}

	// Copy status code and body
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)

	h.logger.Info("Product created with enhanced image successfully")
}

// UpdateProductWithEnhancedImage handles PUT /products/{id}/enhance-image
func (h *ECommerceHandler) UpdateProductWithEnhancedImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productID := vars["id"]

	h.logger.Info("Updating product with enhanced image", zap.String("productId", productID))

	// Parse multipart form
	err := r.ParseMultipartForm(32 << 20) // 32MB max
	if err != nil {
		h.logger.Error("Failed to parse multipart form", zap.Error(err))
		h.writeErrorResponse(w, http.StatusBadRequest, "Failed to parse form data")
		return
	}

	// Get image file
	file, fileHeader, err := r.FormFile("image")
	if err != nil {
		h.logger.Error("Failed to get image file", zap.Error(err))
		h.writeErrorResponse(w, http.StatusBadRequest, "Image file is required")
		return
	}
	defer file.Close()

	// Read image data
	imageData, err := io.ReadAll(file)
	if err != nil {
		h.logger.Error("Failed to read image data", zap.Error(err))
		h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to read image file")
		return
	}

	// Get product name for AI enhancement (could be from form or fetch from MockECommerce)
	productName := r.FormValue("productName")
	if productName == "" {
		productName = "Product Image"
	}

	// Enhance image using STOX Image Service
	enhancedImageURL, err := h.enhanceAndUploadImage(r.Context(), imageData, fileHeader.Header.Get("Content-Type"), productName)
	if err != nil {
		h.logger.Error("Failed to enhance image", zap.Error(err))
		h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to enhance image")
		return
	}

	// Update product with enhanced image URL
	updateData := map[string]interface{}{
		"images": []map[string]interface{}{
			{
				"imageUrl":     enhancedImageURL,
				"altText":      fmt.Sprintf("%s - AI Enhanced", productName),
				"isPrimary":    true,
				"displayOrder": 1,
			},
		},
	}

	updateJSON, err := json.Marshal(updateData)
	if err != nil {
		h.logger.Error("Failed to marshal update data", zap.Error(err))
		h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to process update data")
		return
	}

	// Create request to MockECommerce
	req, err := http.NewRequest("PUT", h.baseURL+"/api/v1/external/products/"+productID, bytes.NewBuffer(updateJSON))
	if err != nil {
		h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to create request")
		return
	}

	// Get API key and set headers
	apiKey := h.getAPIKeyFromUser(r)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", apiKey)

	// Make request to MockECommerce
	resp, err := h.httpClient.Do(req)
	if err != nil {
		h.logger.Error("MockECommerce request failed", zap.Error(err))
		h.writeErrorResponse(w, http.StatusBadGateway, "External service unavailable")
		return
	}
	defer resp.Body.Close()

	// Copy response headers
	for key, values := range resp.Header {
		for _, value := range values {
			w.Header().Add(key, value)
		}
	}

	// Copy status code and body
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)

	h.logger.Info("Product updated with enhanced image successfully", zap.String("productId", productID))
}

// enhanceAndUploadImage enhances image using AI and uploads to S3
func (h *ECommerceHandler) enhanceAndUploadImage(ctx context.Context, imageData []byte, mimeType, productName string) (string, error) {
	// Process image using STOX Image Service
	h.logger.Info("Enhancing image with AI", zap.String("productName", productName), zap.String("mimeType", mimeType))

	processResponse, err := h.imageClient.ProcessImage(ctx, imageData, mimeType, productName)
	if err != nil {
		h.logger.Error("Failed to process image", zap.Error(err))
		return "", fmt.Errorf("failed to enhance image: %v", err)
	}

	// Generate unique filename
	filename := fmt.Sprintf("enhanced_%s_%d.jpg", productName, time.Now().Unix())
	
	// Upload enhanced image to S3 using existing method
	userID := "ecommerce-system" // System user for e-commerce products
	result, err := h.s3Service.UploadEnhancedImage(ctx, userID, filename, bytes.NewReader(processResponse.ProcessedImageData), processResponse.MimeType)
	if err != nil {
		h.logger.Error("Failed to upload enhanced image to S3", zap.Error(err))
		return "", fmt.Errorf("failed to upload enhanced image: %v", err)
	}

	h.logger.Info("Image enhanced and uploaded successfully", 
		zap.String("s3Key", result.Key), 
		zap.String("url", result.URL))

	return result.URL, nil
}

// uploadOriginalImage uploads original image to S3 as fallback
func (h *ECommerceHandler) uploadOriginalImage(ctx context.Context, imageData []byte, filename string) (string, error) {
	h.logger.Info("Uploading original image as fallback", zap.String("filename", filename))

	// Upload original image to S3 using existing method
	userID := "ecommerce-system" // System user for e-commerce products
	result, err := h.s3Service.UploadOriginalImage(ctx, userID, filename, bytes.NewReader(imageData), "image/jpeg")
	if err != nil {
		h.logger.Error("Failed to upload original image to S3", zap.Error(err))
		return "", fmt.Errorf("failed to upload original image: %v", err)
	}

	h.logger.Info("Original image uploaded successfully", 
		zap.String("s3Key", result.Key), 
		zap.String("url", result.URL))

	return result.URL, nil
}

// TestImageEnhancement tests image enhancement without MockECommerce dependency
func (h *ECommerceHandler) TestImageEnhancement(w http.ResponseWriter, r *http.Request) {
	h.logger.Info("Testing image enhancement")

	// Parse multipart form
	err := r.ParseMultipartForm(32 << 20) // 32MB max
	if err != nil {
		h.logger.Error("Failed to parse multipart form", zap.Error(err))
		h.writeErrorResponse(w, http.StatusBadRequest, "Failed to parse form data")
		return
	}

	// Get image file
	file, fileHeader, err := r.FormFile("image")
	if err != nil {
		h.logger.Error("Failed to get image file", zap.Error(err))
		h.writeErrorResponse(w, http.StatusBadRequest, "Image file is required")
		return
	}
	defer file.Close()

	// Read image data
	imageData, err := io.ReadAll(file)
	if err != nil {
		h.logger.Error("Failed to read image data", zap.Error(err))
		h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to read image file")
		return
	}

	// Get product name
	productName := r.FormValue("productName")
	if productName == "" {
		productName = "Test Product"
	}

	// Enhance image using STOX Image Service
	enhancedImageURL, err := h.enhanceAndUploadImage(r.Context(), imageData, fileHeader.Header.Get("Content-Type"), productName)
	if err != nil {
		h.logger.Error("Failed to enhance image", zap.Error(err))
		// Try original image upload as fallback
		originalImageURL, uploadErr := h.uploadOriginalImage(r.Context(), imageData, fileHeader.Filename)
		if uploadErr != nil {
			h.logger.Error("Failed to upload original image", zap.Error(uploadErr))
			h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to process image")
			return
		}
		enhancedImageURL = originalImageURL
	}

	// Return test response with enhanced image URL
	response := map[string]interface{}{
		"success": true,
		"message": "Image enhancement test completed successfully",
		"data": map[string]interface{}{
			"productName":       productName,
			"originalFilename":  fileHeader.Filename,
			"enhancedImageURL":  enhancedImageURL,
			"processingTime":    time.Now().Format(time.RFC3339),
			"imageSize":         len(imageData),
			"contentType":       fileHeader.Header.Get("Content-Type"),
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

	h.logger.Info("Image enhancement test completed successfully", 
		zap.String("productName", productName),
		zap.String("enhancedImageURL", enhancedImageURL))
}

// IntegrateProductsWithEnhancedImages handles the enhanced image integration endpoint
// This endpoint fetches products from MockECommerce API and enhances their images using AI
func (h *ECommerceHandler) IntegrateProductsWithEnhancedImages(w http.ResponseWriter, r *http.Request) {
	apiKey := h.getAPIKeyFromUser(r)
	if apiKey == "" {
		h.writeErrorResponse(w, http.StatusBadRequest, "API key is required")
		return
	}

	// Parse query parameters
	aiEnhance := r.URL.Query().Get("ai_enhance") == "true"
	
	// Parse request body for search criteria and limit
	var requestData struct {
		SearchCriteria struct {
			Category string  `json:"category"`
			MinPrice float64 `json:"min_price"`
			MaxPrice float64 `json:"max_price"`
		} `json:"search_criteria"`
		Limit int `json:"limit"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		h.writeErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	h.logger.Info("Starting enhanced image integration",
		zap.Bool("ai_enhance", aiEnhance),
		zap.String("category", requestData.SearchCriteria.Category),
		zap.Int("limit", requestData.Limit))

	// Build MockECommerce API URL with search parameters
	mockURL := fmt.Sprintf("%s/products", h.baseURL)
	req, err := http.NewRequest("GET", mockURL, nil)
	if err != nil {
		h.logger.Error("Failed to create MockECommerce request", zap.Error(err))
		h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to create request")
		return
	}

	// Add query parameters for filtering
	q := req.URL.Query()
	if requestData.SearchCriteria.Category != "" {
		q.Add("category", requestData.SearchCriteria.Category)
	}
	if requestData.SearchCriteria.MinPrice > 0 {
		q.Add("min_price", fmt.Sprintf("%.2f", requestData.SearchCriteria.MinPrice))
	}
	if requestData.SearchCriteria.MaxPrice > 0 {
		q.Add("max_price", fmt.Sprintf("%.2f", requestData.SearchCriteria.MaxPrice))
	}
	if requestData.Limit > 0 {
		q.Add("limit", fmt.Sprintf("%d", requestData.Limit))
	}
	req.URL.RawQuery = q.Encode()

	// Add API key to headers
	req.Header.Set("X-API-Key", apiKey)
	req.Header.Set("Content-Type", "application/json")

	// Make request to MockECommerce API
	resp, err := h.httpClient.Do(req)
	if err != nil {
		h.logger.Error("Failed to call MockECommerce API", zap.Error(err))
		h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to fetch products")
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		h.logger.Error("MockECommerce API returned error", zap.Int("status", resp.StatusCode))
		h.writeErrorResponse(w, resp.StatusCode, "MockECommerce API error")
		return
	}

	// Parse MockECommerce response
	var products []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&products); err != nil {
		h.logger.Error("Failed to parse MockECommerce response", zap.Error(err))
		h.writeErrorResponse(w, http.StatusInternalServerError, "Failed to parse products")
		return
	}

	h.logger.Info("Fetched products from MockECommerce", zap.Int("count", len(products)))

	// Process each product and enhance images if requested
	var enhancedProducts []map[string]interface{}
	for i, product := range products {
		enhancedProduct := make(map[string]interface{})
		for k, v := range product {
			enhancedProduct[k] = v
		}

		// Process image enhancement if enabled and image URL exists
		if aiEnhance {
			if imageURL, ok := product["image_url"].(string); ok && imageURL != "" {
				h.logger.Info("Processing image for enhancement", 
					zap.Int("productIndex", i),
					zap.String("originalImageURL", imageURL))

				// Download image from original URL
				imageResp, err := h.httpClient.Get(imageURL)
				if err != nil {
					h.logger.Error("Failed to download product image", 
						zap.Error(err), 
						zap.String("imageURL", imageURL))
					continue
				}

				if imageResp.StatusCode == http.StatusOK {
					imageData, err := io.ReadAll(imageResp.Body)
					imageResp.Body.Close()
					
					if err != nil {
						h.logger.Error("Failed to read image data", zap.Error(err))
						continue
					}

					// Extract product name for AI enhancement
					productName := "Product"
					if name, ok := product["name"].(string); ok && name != "" {
						productName = name
					}

					// Enhance and upload image
					enhancedImageURL, err := h.enhanceAndUploadImage(r.Context(), imageData, imageResp.Header.Get("Content-Type"), productName)
					if err != nil {
						h.logger.Error("Failed to enhance product image", 
							zap.Error(err),
							zap.String("productName", productName))
						
						// Fallback to original image upload
						originalImageURL, uploadErr := h.uploadOriginalImage(r.Context(), imageData, fmt.Sprintf("product_%d.jpg", i))
						if uploadErr != nil {
							h.logger.Error("Failed to upload original image", zap.Error(uploadErr))
							continue
						}
						enhancedProduct["enhanced_image_url"] = originalImageURL
						enhancedProduct["enhancement_status"] = "fallback_original"
					} else {
						enhancedProduct["enhanced_image_url"] = enhancedImageURL
						enhancedProduct["enhancement_status"] = "ai_enhanced"
						h.logger.Info("Successfully enhanced product image",
							zap.String("productName", productName),
							zap.String("enhancedImageURL", enhancedImageURL))
					}
				} else {
					imageResp.Body.Close()
					h.logger.Warn("Failed to download image", 
						zap.Int("status", imageResp.StatusCode),
						zap.String("imageURL", imageURL))
				}
			}
		}

		enhancedProducts = append(enhancedProducts, enhancedProduct)
	}

	// Prepare response
	response := map[string]interface{}{
		"success": true,
		"message": "Products integrated successfully with enhanced images",
		"data": map[string]interface{}{
			"total_products":     len(enhancedProducts),
			"ai_enhancement":     aiEnhance,
			"search_criteria":    requestData.SearchCriteria,
			"products":           enhancedProducts,
			"processing_time":    time.Now().Format(time.RFC3339),
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

	h.logger.Info("Enhanced image integration completed successfully",
		zap.Int("total_products", len(enhancedProducts)),
		zap.Bool("ai_enhance", aiEnhance))
}
