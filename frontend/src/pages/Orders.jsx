import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../App";

const UserOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = useContext(Context);
  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        axios.post(`${url}/orders/`, { user_id: user_id }).then((res) => {
          setOrders(res);
        });
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div>
      <h2>Your Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.order_id}>
            <h3>
              {order.book_title} by {order.book_author}
            </h3>
            <p>Quantity: {order.quantity}</p>
            <p>Amount: ${order.purchase_amount}</p>
            <p>Status: {order.status}</p>
            <p>Order Date: {new Date(order.purchase_date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserOrders;
