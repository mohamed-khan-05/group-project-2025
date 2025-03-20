import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Context } from "../App";

// Media
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = useContext(Context);
  const { userid } = useParams();
  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (!user_id) {
      return;
    }

    if (userid != user_id && user_id != null) {
      localStorage.removeItem("user_id");
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.post(`${url}/orders/getuserorders`, {
          user_id: user_id,
        });

        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user_id]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        No orders found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 sm:py-6 py-10 bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate(`/homepage/${user_id}`)}
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="text-sm font-medium">Back</span>
      </button>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="p-5 border border-gray-200 rounded-lg shadow-md flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <img
                onClick={() => {
                  navigate(`/bookdetails/${order.book_id}`);
                }}
                src={order.book_image}
                alt={order.book_title}
                className="w-24 h-28 object-cover rounded-md shadow"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {order.book_title}
                </h3>
                <p className="text-gray-600">
                  by {order.book_author || "Unknown Author"}
                </p>
                <p className="text-gray-700">Quantity: {order.quantity}</p>
                <p className="text-blue-700 font-semibold text-lg">
                  ZAR {order.purchase_amount}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
                  order.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Ordered on {new Date(order.purchase_date).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
