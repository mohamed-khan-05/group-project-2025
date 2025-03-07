import React from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("user_id");
      navigate("/");
    }
  };
  return (
    <div>
      Homepage
      <button
        className="border-1 p-1 m-5"
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Homepage;
