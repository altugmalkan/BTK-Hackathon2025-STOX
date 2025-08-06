import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { Product, ProductImage, api, CartItem as ApiCartItem } from "@/lib/api";

export interface CartItem extends Omit<ApiCartItem, 'productId'> {
  id: string; // This will be the productId
  title: string; // Changed from 'name' to match API
  price: number;
  originalPrice?: number;
  image: string; // Primary image URL
  quantity: number;
  sellerId: string;
  sellerName: string;
  stock: number;
  categoryName: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

// Helper function to get primary image URL from Product
const getPrimaryImageUrl = (images: ProductImage[]): string => {
  const primaryImage = images.find((img) => img.isPrimary);
  return primaryImage?.imageUrl || images[0]?.imageUrl || "/placeholder.svg";
};

// Helper function to convert API Product to CartItem
export const productToCartItem = (
  product: Product
): Omit<CartItem, "quantity"> => ({
  id: product.id,
  title: product.title,
  price: product.price,
  image: getPrimaryImageUrl(product.images),
  sellerId: product.sellerId,
  sellerName: product.sellerName,
  stock: product.stock,
  categoryName: product.categoryName,
});

const CartContext = createContext<
  | {
      state: CartState;
      addToCart: (item: Omit<CartItem, "quantity">) => void;
      addProductToCart: (product: Product) => void; // New helper method
      removeFromCart: (id: string) => void;
      updateQuantity: (id: string, quantity: number) => void;
      clearCart: () => void;
    }
  | undefined
>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        // If item exists, increase quantity
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      } else {
        // If item doesn't exist, add new item
        const newItem = { ...action.payload, quantity: 1 };
        const updatedItems = [...state.items, newItem];

        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0); // Remove items with 0 quantity

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from backend on initial mount
  useEffect(() => {
    const loadCartFromBackend = async () => {
      try {
        const response = await api.getCart();
        // Fetch product details for each cart item
        const cartItemsWithProduct = await Promise.all(
          response.data.map(async (item) => {
            try {
              const productResponse = await api.getProduct(item.productId);
              const product: Product = productResponse.data;
              return {
                id: item.productId,
                title: product.title || "",
                price: item.price,
                originalPrice: product.originalPrice,
                image: (product.images && product.images.length > 0) ? product.images[0].url : "",
                quantity: item.quantity,
                sellerId: product.sellerId || "",
                sellerName: product.sellerName || "",
                stock: product.stock ?? 0,
                categoryName: product.categoryName || "",
              };
            } catch (err) {
              // If product fetch fails, fallback to minimal info
              return {
                id: item.productId,
                title: "",
                price: item.price,
                originalPrice: undefined,
                image: "",
                quantity: item.quantity,
                sellerId: "",
                sellerName: "",
                stock: 0,
                categoryName: "",
              };
            }
          })
        );
        
        // Dispatch items to cart state
        cartItemsWithProduct.forEach(item => {
          dispatch({ type: "ADD_ITEM", payload: item });
        });
      } catch (error) {
        console.error("Failed to load cart from backend:", error);
      }
    };

    loadCartFromBackend();
  }, []);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    
    // Sync with backend
    try {
      const cartItem: ApiCartItem = {
        productId: item.id,
        quantity: 1,
        price: item.price,
        title: item.title,
        image: item.image
      };
      await api.addToCart(cartItem);
    } catch (error) {
      console.error("Failed to add item to cart on backend:", error);
    }
  };

  const addProductToCart = async (product: Product) => {
    const cartItem = productToCartItem(product);
    dispatch({ type: "ADD_ITEM", payload: cartItem });
    
    // Sync with backend
    try {
      const apiCartItem: ApiCartItem = {
        productId: product.id,
        quantity: 1,
        price: product.price,
        title: product.title,
        image: getPrimaryImageUrl(product.images)
      };
      await api.addToCart(apiCartItem);
    } catch (error) {
      console.error("Failed to add product to cart on backend:", error);
    }
  };

  const removeFromCart = async (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    
    // Sync with backend
    try {
      await api.removeFromCart(id);
    } catch (error) {
      console.error("Failed to remove item from cart on backend:", error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    
    // Sync with backend
    try {
      await api.updateCartItem(id, quantity);
    } catch (error) {
      console.error("Failed to update cart item on backend:", error);
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });
    
    // Sync with backend
    try {
      await api.clearCart();
    } catch (error) {
      console.error("Failed to clear cart on backend:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        addProductToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
