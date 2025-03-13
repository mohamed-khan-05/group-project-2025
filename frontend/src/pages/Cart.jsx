import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const user_id = useContext(Context);
  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (!user_id) return;

    axios
      .post(`${url}/cart/getcart`, { user_id })
      .then((res) => {
        setCartItems(res.data.cart);

        let total = 0;
        for (let i = 0; i < res.data.cart.length; i++) {
          const item = res.data.cart[i];
          const discountedPrice =
            parseFloat(item.total) -
            (parseFloat(item.total) * parseFloat(item.discount)) / 100;
          total += discountedPrice;
        }
        setTotalCost(total);
      })
      .catch((err) => console.error("Error fetching cart:", err));
  }, [user_id, url]);

  return (
    <div>
      <button onClick={() => navigate(`/homepage/${user_id}`)}>Back</button>
      <h2>Cart</h2>
      {cartItems.length > 0 ? (
        <div className="flex flex-col gap-5">
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <img src={item.book_image} alt="Book" width="50" />
              <span>
                Book ID: {item.book_id} | Quantity: {item.quantity} | Cost: R
                {(
                  parseFloat(item.total) -
                  (parseFloat(item.total) * parseFloat(item.discount)) / 100
                ).toFixed(2)}
              </span>
            </div>
          ))}
          <h3>Total: R{totalCost.toFixed(2)}</h3>
          <button className="border cursor-pointer">Checkout</button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
