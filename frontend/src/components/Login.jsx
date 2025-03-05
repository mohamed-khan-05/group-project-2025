import React, { useState, useContext } from "react";
import { Context } from "../App";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setGlobalid }) => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = (e) => {
    e.preventDefault();
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
          setGlobalid(user_id);
          setTimeout(() => {
            if (user_id !== 1) {
              navigate(`/homepage/${user_id}`);
            } else {
              navigate("/adminpage");
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
      <ToastContainer hideProgressBar />
      <div className="flex flex-col mb-20">
        <h1>Login</h1>
        <input
          className="border max-w-100 m-2 p-2 rounded-lg bg-white"
          autoComplete="new-email"
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className="border max-w-100 m-2 p-2 rounded-lg bg-white"
          autoComplete="new-password"
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className="border max-w-30 rounded-full bg-blue-700 text-white text-xl p-1"
          type="submit"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
