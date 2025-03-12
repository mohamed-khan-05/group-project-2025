import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks, getUserOrders, addToCart, removeFromCart, getUserWishlist, addToWishlist, removeFromWishlist } from "./api"; // Assuming these functions are defined in an api.js file

const Homepage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    search: ""
  });

  
  useEffect(() => {
    if (userId) {
      
      getUserOrders(userId).then((data) => setOrders(data));

      
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));

      
      getUserWishlist(userId).then((data) => setWishlist(data));

      
      getBooks(filters).then((data) => setBooks(data));
    } else {
      navigate("/login"); 
    }
  }, [userId, filters, navigate]);

  
  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("user_id");
      navigate("/");
    }
  };

  
  const addToCartHandler = (bookId) => {
    addToCart(bookId, userId).then((newCart) => {
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart)); 
    });
  };

  const removeFromCartHandler = (bookId) => {
    removeFromCart(bookId, userId).then((newCart) => {
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    });
  };

  
  const addToWishlistHandler = (bookId) => {
    addToWishlist(bookId, userId).then((newWishlist) => {
      setWishlist(newWishlist);
    });
  };

  const removeFromWishlistHandler = (bookId) => {
    removeFromWishlist(bookId, userId).then((newWishlist) => {
      setWishlist(newWishlist);
    });
  };

  G
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h1>Welcome to your Homepage</h1>
      <button onClick={logout} className="border-1 p-1 m-5">
        Logout
      </button>

      <div>
        <h2>Your Orders</h2>
        <ul>
          {orders.length > 0 ? (
            orders.map((order) => (
              <li key={order.id}>
                Order ID: {order.id}, Status: {order.status}
              </li>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </ul>
      </div>

      <div>
        <h2>Your Cart</h2>
        <ul>
          {cart.length > 0 ? (
            cart.map((book) => (
              <li key={book.id}>
                {book.title}{" "}
                <button onClick={() => removeFromCartHandler(book.id)}>Remove</button>
              </li>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </ul>
      </div>

      <div>
        <h2>Search and Filter Books</h2>
        <input
          type="text"
          name="search"
          placeholder="Search by title or author"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">Select Category</option>
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-Fiction</option>
          <option value="science">Science</option>
          <option value="history">History</option>
        </select>
      </div>

      <div>
        <h2>Available Books</h2>
        <ul>
          {books.length > 0 ? (
            books.map((book) => (
              <li key={book.id}>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <button onClick={() => addToCartHandler(book.id)}>Add to Cart</button>
                <button onClick={() => addToWishlistHandler(book.id)}>Add to Wishlist</button>
                <button onClick={() => navigate(`/book-details/${book.id}`)}>
                  View Details
                </button>
              </li>
            ))
          ) : (
            <p>No books found.</p>
          )}
        </ul>
      </div>

      <div>
        <h2>Your Wishlist</h2>
        <ul>
          {wishlist.length > 0 ? (
            wishlist.map((book) => (
              <li key={book.id}>
                {book.title}{" "}
                <button onClick={() => removeFromWishlistHandler(book.id)}>Remove</button>
              </li>
            ))
          ) : (
            <p>Your wishlist is empty.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Homepage;
