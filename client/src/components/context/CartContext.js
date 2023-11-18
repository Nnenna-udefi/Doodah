import { createContext, useEffect, useState } from "react";

// This context will provide a way to pass the cart data and functions to all components that want to consume this context.
const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart)
        );
    }, [cart])

    const addToCart = (item) => {
        setCart([...cart, item]);
    };

    // The filter function is used on the cart array to create a new array (updatedCart) that excludes the item at the specified index.
    // (_, i) => i !== index is a filter callback function. It iterates over each item in the cart array.
    // i is the index of the current item being iterated.
    // i !== index checks if the current item's index is not equal to the specified index (the item to be removed). If true, the item is kept in the new array; otherwise, it's filtered out.
    const removeFromCart = (index) => {
        const updatedCart = [...cart.slice(0, index), ...cart.slice(index + 1)];
        setCart(updatedCart);
    };

    const clearCart = () => {
        setCart([]);
    }
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export { CartProvider, CartContext };