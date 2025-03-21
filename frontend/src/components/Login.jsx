import React, { useState, useContext, useEffect } from "react";
import { Context } from "../App";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Media
import { IoMdEye } from "react-icons/io";
import { FaRegEyeSlash } from "react-icons/fa";

const Login = ({ setUser_id, isLogin, setIsLogin }) => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showpass, setShowpass] = useState(false);

  const onLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill in all details");
    }

    if (password.length < 4) {
      return toast.error("Password must be atleast 4 characters");
    }

    axios
      .post(`${url}/login`, { email: email, password: password })
      .then((res) => {
        if (res.data.status == "404") {
          toast.error("User not found");
        } else if (res.data.status == "401") {
          toast.error("Incorrect details");
        } else {
          toast.success("Login Successful");
          const user_id = res.data.user_id;
          localStorage.setItem("user_id", user_id);
          setUser_id(user_id);
          setTimeout(() => {
            if (user_id !== 1) {
              navigate(`/homepage/${user_id}`);
            } else {
              navigate("/managebooks");
            }
          }, 700);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          console.error("Backend error:", err.response.data.message);
        }
      });
  };

  return (
    <form onSubmit={onLogin}>
      <div className="flex flex-col w-full">
        <h1>Login</h1>
        <input
          className="border m-2 p-2 max-w-[500px] rounded-lg bg-white"
          type="email"
          maxLength={50}
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <div className="relative max-w-[500px] m-2">
          <input
            className="border p-2 rounded-lg bg-white w-full pr-10"
            type={showpass ? "text" : "password"}
            placeholder="password"
            value={password}
            maxLength={15}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => setShowpass((prev) => !prev)}
          >
            {showpass ? <IoMdEye /> : <FaRegEyeSlash />}
          </button>
        </div>

        <button
          className="border max-w-30 rounded-full bg-blue-700 text-white text-xl p-1 my-5 cursor-pointer hover:bg-blue-600"
          type="submit"
        >
          Login
        </button>
        <div className="flex gap-2 flex-col sm:flex-row">
          {isLogin ? (
            <h1>Don't have an account ?</h1>
          ) : (
            <h1>Already have an account ?</h1>
          )}
          <h1
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register now" : "Login now"}
          </h1>
        </div>
      </div>
    </form>
  );
};

export default Login;
