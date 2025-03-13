import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { ToastContainer } from "react-toastify";

const LoginSignup = ({ setUser_id }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) return;
    if (user_id === "1") navigate("/adminpage");
    else navigate(`/homepage/${user_id}`);
  }, []);

  return (
    <>
      <ToastContainer />

      {/* Mobile */}
      <div className="sm:hidden">
        <div className="flex items-center justify-center h-screen bg-blue-100">
          <div className="h-9/10 p-3 m-5 bg-white rounded-lg overflow-hidden">
            <h1 className="text-3xl font-bold text-center mb-6 py-2">
              Welcome to Book Store
            </h1>
            <p className="text-center text-gray-700">
              Your go-to bookstore for educational resources.
            </p>
            <div
              className={`flex h-[80%] transition-transform duration-500 ease-in-out ${
                isLogin ? "translate-x-0" : "-translate-x-1/2"
              }`}
              style={{ width: "200%" }}
            >
              <div className={isLogin ? null : "w-1/2 sm:p-8 pt-10"}></div>
              <div className="w-1/2 sm:p-8 pt-10">
                {isLogin ? (
                  <Login
                    setUser_id={setUser_id}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                  />
                ) : (
                  <Signup isLogin={isLogin} setIsLogin={setIsLogin} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PC */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-center h-screen bg-blue-100">
          <div className="relative w-[70vw] h-[70vh] bg-white shadow-lg rounded-lg overflow-hidden">
            <h1 className="text-3xl font-bold text-center mb-6 py-5">
              Welcome to Book Store
            </h1>
            <p className="text-center text-gray-700">
              Your go-to bookstore for educational resources.
            </p>
            <div
              className={`flex items-center h-[80%] transition-transform duration-500 ease-in-out ${
                isLogin ? "translate-x-0" : "-translate-x-1/2"
              }`}
              style={{ width: "200%" }}
            >
              <div className={isLogin ? null : "w-1/2 p-8"}></div>
              <div className="w-1/2 p-8">
                {isLogin ? (
                  <div className="flex justify-between">
                    <div className="w-full">
                      <Login
                        setUser_id={setUser_id}
                        isLogin={isLogin}
                        setIsLogin={setIsLogin}
                      />
                    </div>

                    <img
                      className="object-contain w-1/2 rounded-xl"
                      src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <div className="w-full">
                      <Signup isLogin={isLogin} setIsLogin={setIsLogin} />
                    </div>

                    <img
                      className="object-contain w-1/2 rounded-xl"
                      src="https://images.pexels.com/photos/1831744/pexels-photo-1831744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt=""
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignup;
