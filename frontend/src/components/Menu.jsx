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
      navigate("/");
    }
  };

  return (
    <>
      {ready ? (
        <div className="w-[50vw] sm:w-[15vw] bg-blue-300 sm:h-[98vh] flex flex-col justify-center h-[100vh]">
          <div
            onClick={() => {
              navigate(`/homepage/${user_id}`);
            }}
            className="cursor-pointer py-5 border-1 border-blue-400"
          >
            <h1>Books</h1>
          </div>
          <div className=" py-5 border-1 border-blue-400">
            <h1>Orders</h1>
          </div>

          <div
            onClick={() => {
              navigate(`/wishlist/${user_id}`);
            }}
            className="cursor-pointer py-5 border-1 border-blue-400"
          >
            <h1>Wishlist</h1>
          </div>
          <div
            className=" py-5 border-1 border-blue-400"
            onClick={() => {
              navigate(`/cart/${user_id}`);
            }}
          >
            <h1>Cart</h1>
          </div>

          <div className=" py-5 border-1 border-blue-400">
            <h1>Profile</h1>
          </div>

          <button
            className="border-1 bg-white py-1 px-3"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
};

export default Menu;
