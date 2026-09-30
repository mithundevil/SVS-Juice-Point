'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, withIceCream?: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isHydrated: boolean;
}

const CART_STORAGE_KEY = 'svs_juice_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage after client mounts
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart changes to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [cart, isHydrated]);

  const addToCart = (product: Product, quantity = 1, withIceCream = false) => {
    // Milk shake / Sharja ice cream add-on check
    const hasAddon = Boolean(product.allowIceCreamAddon && withIceCream);
    const cartItemId = hasAddon ? `${product.id}_icecream` : product.id;
    const extraPrice = hasAddon ? 20 : 0;
    const unitPrice = product.price + extraPrice;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: newQty * existing.unitPrice,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          product,
          quantity,
          withIceCream: hasAddon,
          unitPrice,
          totalPrice: quantity * unitPrice,
        };
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newQuantity * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
