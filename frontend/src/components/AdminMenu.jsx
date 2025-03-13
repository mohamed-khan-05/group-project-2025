import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminMenu = () => {
  const navigate = useNavigate();

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("user_id");
      navigate("/");
    }
  };

  return (
    <div className="flex justify-evenly border p-2 mb-10 bg-amber-200">
      <h1
        className="bg-white py-1 px-3 cursor-pointer"
        onClick={() => {
          navigate("/adminpage");
        }}
      >
        Home
      </h1>
      <h1
        className="bg-white py-1 px-3 cursor-pointer"
        onClick={() => {
          navigate("/managebooks");
        }}
      >
        Manage Books
      </h1>
      <h1 className="line-through">Orders</h1>
      <h1
        className="bg-white py-1 px-3 cursor-pointer"
        onClick={() => {
          navigate("/profile/1");
        }}
      >
        Profile
      </h1>
      <button
        className="border-1 bg-white py-1 px-3"
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default AdminMenu;
