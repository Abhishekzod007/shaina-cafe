// useCart.js
import { useContext } from "react";
import CartContext from "../context/CartContextObject";

export default function useCart() {
  return useContext(CartContext);
}
