import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import LoginSignup from "./pages/LoginSignup";

// Admin
import AdminPage from "./pages/AdminPage";
import ManageBooks from "./pages/ManageBooks";

// User
import Homepage from "./pages/Homepage";
import Wishlist from "./pages/Wishlist";

// All
import BookDetails from "./pages/BookDetails";

export const Context = createContext();

const App = () => {
  const navigate = useNavigate();
  const [globalid, setGlobalid] = useState(null);
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      navigate("/");
    } else {
      setGlobalid(user_id);
    }
  }, []);

  return (
    <Context.Provider value={globalid}>
      <Routes>
        <Route path="/" element={<LoginSignup setGlobalid={setGlobalid} />} />
        {/* Admin */}
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/managebooks" element={<ManageBooks />} />
        {/* User */}
        <Route path="/homepage/:userid" element={<Homepage />} />
        <Route path="/bookdetails/:bookid" element={<BookDetails />} />
        <Route path="/wishlist/:userid" element={<Wishlist />} />
      </Routes>
    </Context.Provider>
  );
};
export default App;
