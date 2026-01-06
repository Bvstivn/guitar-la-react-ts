//React
import { useState, useEffect, useMemo } from "react";
//Db
import { db } from "../data/db.js";
//Types
import type { Guitar, CartItem } from "../types";

export const useCart = () => {
  const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  //State
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_QUANTITY = 5;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  //Functions
  function addToCart(item: Guitar) {
    const itemExist = cart.findIndex(g => g.id === item.id);
    if (itemExist >= 0) {
      //Existe
      if (cart[itemExist].quantity >= MAX_QUANTITY) return;
      const updatedCart = [...cart];
      updatedCart[itemExist].quantity++;
      setCart(updatedCart);
    } else {
      const newItem: CartItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
    }
  }

  function removeFromCart(id: Guitar["id"]) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  function increaseQuantity(id: Guitar["id"]) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_QUANTITY) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id: Guitar["id"]) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

    //State derivado
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, guitar) => total + guitar.quantity * guitar.price, 0), [cart]);

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
  };
};
