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
    <div className="flex gap-2 justify-evenly border p-2 sm:mb-10 mb-5 bg-blue-200">
      <h1
        className="bg-white py-1 sm:px-3 px-2 cursor-pointer rounded-sm"
        onClick={() => {
          navigate("/managebooks");
        }}
      >
        Books
      </h1>
      <h1
        className="bg-white py-1 sm:px-3 px-2 cursor-pointer rounded-sm"
        onClick={() => {
          navigate("/allorders");
        }}
      >
        Orders
      </h1>
      <h1
        className="bg-white py-1 sm:px-3 px-2 cursor-pointer rounded-sm"
        onClick={() => {
          navigate("/profile/1");
        }}
      >
        Profile
      </h1>
      <button
        className="py-1 sm:px-3 px-2 text-white font-bold border-none bg-red-500 cursor-pointer rounded-2xl"
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
