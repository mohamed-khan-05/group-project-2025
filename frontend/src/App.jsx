import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

import LoginSignup from "./pages/LoginSignup";

// Admin
import AdminPage from "./pages/AdminPage";
import ManageBooks from "./pages/ManageBooks";
import AdminBookDetails from "./pages/AdminBookDetails";
// User
import Homepage from "./pages/Homepage";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import BookDetails from "./pages/BookDetails";

// All

export const Context = createContext();

const App = () => {
  const navigate = useNavigate();
  const [user_id, setUser_id] = useState(null);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      navigate("/");
    } else {
      setUser_id(user_id);
    }
  }, []);

  return (
    <Context.Provider value={user_id}>
      <Routes>
        <Route path="/" element={<LoginSignup setUser_id={setUser_id} />} />
        {/* Admin */}
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/managebooks" element={<ManageBooks />} />
        <Route
          path="/adminbookdetails/:bookid"
          element={<AdminBookDetails />}
        />
        {/* User */}
        <Route path="/homepage/:userid" element={<Homepage />} />
        <Route path="/bookdetails/:bookid" element={<BookDetails />} />
        <Route path="/wishlist/:userid" element={<Wishlist />} />
        <Route path="/cart/:userid" element={<Cart />} />
        <Route path="/orders/:userid" element={<Orders />} />
      </Routes>
    </Context.Provider>
  );
};
export default App;
