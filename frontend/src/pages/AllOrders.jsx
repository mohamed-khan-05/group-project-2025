import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Media
import { ArrowLeft } from "lucide-react";

const AllOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const url = import.meta.env.VITE_BASE_URL;

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${url}/orders/getallorders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = (orderId) => {
    const confirmUpdate = window.confirm(
      "Are you sure you want to mark this order as completed?"
    );
    if (confirmUpdate) {
      axios
        .post(`${url}/orders/statuschange`, {
          order_id: orderId,
        })
        .then(window.location.reload());
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.student_num.toString().includes(searchTerm);
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <button
        onClick={() => navigate("/managebooks")}
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="text-sm font-medium">Back</span>
      </button>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          All Orders
        </h1>

        <div className="flex justify-between items-center mb-6">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by Student Number"
            className="px-4 py-2 border rounded-md w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Dropdown for Order Status */}
          <select
            className="px-4 py-2 border rounded-md w-1/4"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Loading or Error Handling */}
        {loading && <p>Loading orders...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Orders List */}
        {!loading && !error && filteredOrders.length === 0 && (
          <p>No orders found.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Order ID: {order.id}
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Student Number:</strong> {order.student_num}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Book ID:</strong> {order.book_id}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Book Title:</strong> {order.book_title}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Quantity:</strong> {order.quantity}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Purchase Date:</strong>{" "}
                {formatDate(order.purchase_date)}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Purchase Amount:</strong> $
                {parseFloat(order.purchase_amount).toFixed(2)}
              </p>

              {/* Order Status */}
              <p
                className={`text-white py-1 px-4 rounded-full ${
                  order.status === "Pending" ? "bg-yellow-500" : "bg-green-500"
                }`}
              >
                {order.status}
              </p>

              {/* Button to mark as Completed (only for Pending orders) */}
              {order.status === "Pending" && (
                <button
                  className="mt-4 px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                  onClick={() => updateOrderStatus(order.id)}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllOrders;
