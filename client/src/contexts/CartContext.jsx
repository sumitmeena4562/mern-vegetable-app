import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    // Load cart from local storage on mount (namespaced by user ID)
    useEffect(() => {
        if (user && user._id) {
            const savedCart = localStorage.getItem(`vendor_cart_${user._id}`);
            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (e) {
                    console.error("Failed to parse saved cart", e);
                }
            }
        } else {
            setCart([]);
        }
    }, [user]);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        if (user && user._id) {
            localStorage.setItem(`vendor_cart_${user._id}`, JSON.stringify(cart));
        }
    }, [cart, user]);

    const addToCart = (product, quantity) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product._id === product._id);
            if (existingItem) {
                // If product already in cart, update quantity
                return prevCart.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new product to cart
                return [...prevCart, { product, quantity, farmerId: product.farmerId || product.farmer?._id }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart => prevCart.map(item =>
            item.product._id === productId
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.product.pricePerUnit || item.product.price || 0) * item.quantity, 0);
    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartItemCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
