
import React, { useState, useEffect } from 'react';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        
        const fetchOrders = async () => {
            const response = await fetch('/api/orders');
            const data = await response.json();
            setOrders(data);
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h1>All Orders</h1>
            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User Name</th>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Quantity</th>
                            <th>Purchase Date</th>
                            <th>Purchase Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.order_id}>
                                <td>{order.order_id}</td>
                                <td>{order.user_name}</td>
                                <td>{order.book_title}</td>
                                <td>{order.book_author}</td>
                                <td>{order.quantity}</td>
                                <td>{new Date(order.purchase_date).toLocaleString()}</td>
                                <td>{order.purchase_amount}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AllOrders;
