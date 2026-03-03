import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    // Load cart from server or local storage on mount
    useEffect(() => {
        const fetchCart = async () => {
            if (user && user._id) {
                try {
                    const res = await api.get('/auth/cart');
                    if (res.data.success && res.data.cart?.length > 0) {
                        setCart(res.data.cart);
                    } else {
                        const savedCart = localStorage.getItem(`vendor_cart_${user._id}`);
                        if (savedCart) setCart(JSON.parse(savedCart));
                    }
                } catch (e) {
                    console.error("Failed to fetch cart from server", e);
                }
            } else {
                setCart([]);
            }
        };
        fetchCart();
    }, [user]);

    // Save cart to local storage and sync with server whenever it changes
    useEffect(() => {
        if (user && user._id) {
            localStorage.setItem(`vendor_cart_${user._id}`, JSON.stringify(cart));

            // Debounced sync with server
            const timeoutId = setTimeout(async () => {
                try {
                    await api.post('/auth/cart/sync', { cart });
                } catch (error) {
                    console.error("Failed to sync cart with server:", error);
                }
            }, 2000);

            return () => clearTimeout(timeoutId);
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

    /**
     * Checkout: Place order(s) from cart via API
     * @param {object} options - { deliveryType, paymentMethod, deliveryAddress, notes }
     * @returns {Promise<{success: boolean, data: any, message: string}>}
     */
    const checkout = async (options = {}) => {
        const items = cart.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
        }));

        const res = await api.post('/vendors/orders', {
            items,
            deliveryType: options.deliveryType || 'pickup',
            paymentMethod: options.paymentMethod || 'online',
            deliveryAddress: options.deliveryAddress || {},
            notes: options.notes || ''
        });

        if (res.data.success) {
            clearCart();
        }

        return res.data;
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
            checkout,
            cartTotal,
            cartItemCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
