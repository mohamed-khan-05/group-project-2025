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
        <div className="flex justify-evenly border p-2 mb-10 bg-amber-200">
          <div
            onClick={() => {
              navigate(`/homepage/${user_id}`);
            }}
            className="cursor-pointer"
          >
            <h1 className="bg-white py-1 px-3">Books</h1>
          </div>
          <h1 className="line-through">Orders</h1>
          <div
            onClick={() => {
              navigate(`/wishlist/${user_id}`);
            }}
            className="cursor-pointer"
          >
            <h1 className="bg-white py-1 px-3">Wishlist</h1>
          </div>
          <h1 className="line-through">Cart</h1>
          <h1 className="line-through">Profile</h1>
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
