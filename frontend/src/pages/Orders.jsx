import React, { useEffect, useState } from 'react';

const UserOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user orders from the Flask API
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders/${userId}`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
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
            <h3>{order.book_title} by {order.book_author}</h3>
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

