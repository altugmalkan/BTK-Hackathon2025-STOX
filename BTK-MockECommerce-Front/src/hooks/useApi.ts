import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Product, Category, CreateProductRequest } from "@/lib/api";

// Query keys for caching
export const queryKeys = {
  products: ["products"] as const,
  productsByCategory: (categoryId: string) =>
    ["products", "category", categoryId] as const,
  product: (id: string) => ["products", id] as const,
  categories: ["categories"] as const,
  hierarchicalCategories: ["categories", "hierarchical"] as const,
  rootCategories: ["categories", "root"] as const,
  myProducts: ["products", "my"] as const,
  searchProducts: (searchTerm: string) =>
    ["products", "search", searchTerm] as const,
  priceRangeProducts: (minPrice: number, maxPrice: number) =>
    ["products", "price-range", minPrice, maxPrice] as const,
} as const;

// Products hooks
export const useActiveProducts = () => {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: api.getActiveProducts,
    select: (data) => data.data, // Extract the data from ApiResponse wrapper
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => api.getProductById(id),
    select: (data) => data.data,
    enabled: !!id, // Only run query if id is provided
  });
};

export const useProductsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: queryKeys.productsByCategory(categoryId),
    queryFn: () => api.getProductsByCategory(categoryId),
    select: (data) => data.data,
    enabled: !!categoryId,
  });
};

export const useSearchProducts = (searchTerm: string) => {
  return useQuery({
    queryKey: queryKeys.searchProducts(searchTerm),
    queryFn: () => api.searchProducts(searchTerm),
    select: (data) => data.data,
    enabled: !!searchTerm && searchTerm.length > 0,
  });
};

export const useProductsByPriceRange = (minPrice: number, maxPrice: number) => {
  return useQuery({
    queryKey: queryKeys.priceRangeProducts(minPrice, maxPrice),
    queryFn: () => api.getProductsByPriceRange(minPrice, maxPrice),
    select: (data) => data.data,
    enabled: minPrice >= 0 && maxPrice > minPrice,
  });
};

export const useMyProducts = () => {
  return useQuery({
    queryKey: queryKeys.myProducts,
    queryFn: api.getMyProducts,
    select: (data) => data.data,
  });
};

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: api.getCategories,
    select: (data) => data.data,
  });
};

export const useHierarchicalCategories = () => {
  return useQuery({
    queryKey: queryKeys.hierarchicalCategories,
    queryFn: api.getHierarchicalCategories,
    select: (data) => data.data,
  });
};

export const useRootCategories = () => {
  return useQuery({
    queryKey: queryKeys.rootCategories,
    queryFn: api.getRootCategories,
    select: (data) => data.data,
  });
};

// Mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: CreateProductRequest) =>
      api.createProduct(productData),
    onSuccess: () => {
      // Invalidate and refetch products queries
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.myProducts });
    },
  });
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      status,
    }: {
      productId: string;
      status: 0 | 1 | 2;
    }) => api.updateProductStatus(productId, status),
    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.myProducts });
    },
  });
};

// Utility hooks for common patterns
export const useProductSearch = () => {
  const queryClient = useQueryClient();

  const searchProducts = (searchTerm: string) => {
    return queryClient.fetchQuery({
      queryKey: queryKeys.searchProducts(searchTerm),
      queryFn: () => api.searchProducts(searchTerm),
    });
  };

  return { searchProducts };
};

// Hook for filtering products client-side (useful for immediate filtering)
export const useFilteredProducts = (
  products: Product[] | undefined,
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
  }
) => {
  if (!products) return [];

  return products.filter((product) => {
    // Category filter
    if (
      filters.category &&
      filters.category !== "all" &&
      product.categoryId !== filters.category
    ) {
      return false;
    }

    // Price range filter
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const titleMatch = product.title.toLowerCase().includes(searchLower);
      const descriptionMatch = product.description
        .toLowerCase()
        .includes(searchLower);
      const sellerMatch = product.sellerName
        .toLowerCase()
        .includes(searchLower);

      if (!titleMatch && !descriptionMatch && !sellerMatch) {
        return false;
      }
    }

    return true;
  });
};
