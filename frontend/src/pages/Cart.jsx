import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const url = import.meta.env.VITE_BASE_URL;
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const user_id = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user_id) {
      return;
    }
    const fetchCartItems = async () => {
      try {
        const response = await axios.post(`${url}/cart/getcart`, { user_id });
        setCartItems(response.data.cart || []);
      } catch (error) {
        console.error("Error fetching cart items", error);
      }
    };

    fetchCartItems();
  }, [user_id]);

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + (parseFloat(item.total) || 0),
      0
    );
    setTotalAmount(Number(total.toFixed(2)));
  }, [cartItems]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get(`${url}/cart/get-user-email`, {
          params: { user_id },
        });
        setUserEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching user email", error);
      }
    };
    fetchUserEmail();
  }, [user_id]);

  const handleCheckout = async () => {
    if (!userEmail) {
      alert("User email not found. Please log in.");
      return;
    }

    const amount = parseFloat(totalAmount); // Convert to float

    if (isNaN(amount) || amount <= 0) {
      alert("Invalid cart total. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/cart/create-paystack-transaction`,
        {
          amount: amount, // Ensure it's a valid number
          email: userEmail,
        }
      );

      if (response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        alert("Error initializing payment. Please try again.");
      }
    } catch (error) {
      console.error("Error initializing Paystack payment", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Shopping Cart</h2>

      {cartItems.length > 0 ? (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center border-b pb-4">
              <img
                src={item.book_image}
                alt={item.name}
                className="w-24 h-28 object-cover rounded-md shadow-md"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-800 font-bold text-lg">
                  ZAR {item.total}
                </p>
              </div>
            </div>
          ))}

          <div className="text-right mt-6">
            <h3 className="text-xl font-bold text-gray-900">
              Total: ZAR {totalAmount}
            </h3>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Proceed to Checkout
          </button>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
