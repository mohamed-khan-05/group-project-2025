import React, { useContext, useEffect, useState } from "react";
import { Context } from "../App";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const user_id = useContext(Context);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (user_id) {
      setReady(true);
    }
  }, [user_id]);

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("user_id");
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      {ready ? (
        <div className="w-[50vw] sm:w-[15vw] bg-gradient-to-b from-blue-800 to-blue-600 text-white sm:h-[98vh] flex flex-col justify-center h-[100vh] shadow-lg">
          <div
            onClick={() => navigate(`/homepage/${user_id}`)}
            className="cursor-pointer py-5 border-b border-blue-500 hover:bg-blue-700 transition-all text-center text-lg font-semibold"
          >
            Books
          </div>
          <div
            onClick={() => navigate(`/orders/${user_id}`)}
            className="cursor-pointer py-5 border-b border-blue-500 hover:bg-blue-700 transition-all text-center text-lg font-semibold"
          >
            Orders
          </div>
          <div
            onClick={() => navigate(`/wishlist/${user_id}`)}
            className="cursor-pointer py-5 border-b border-blue-500 hover:bg-blue-700 transition-all text-center text-lg font-semibold"
          >
            Wishlist
          </div>
          <div
            onClick={() => navigate(`/cart/${user_id}`)}
            className="cursor-pointer py-5 border-b border-blue-500 hover:bg-blue-700 transition-all text-center text-lg font-semibold"
          >
            Cart
          </div>
          <div
            onClick={() => navigate(`/profile/${user_id}`)}
            className="cursor-pointer py-5 border-b border-blue-500 hover:bg-blue-700 transition-all text-center text-lg font-semibold"
          >
            Profile
          </div>

          <button
            className="bg-red-500 hover:bg-red-600 transition-all py-2 px-4 rounded-md mx-auto mt-6 text-lg font-semibold"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="text-center text-lg font-semibold text-gray-600">
          Loading...
        </div>
      )}
    </>
  );
};

export default Menu;
