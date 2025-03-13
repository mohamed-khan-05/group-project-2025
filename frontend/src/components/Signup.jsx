import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

// Media
import { IoMdEye } from "react-icons/io";
import { FaRegEyeSlash } from "react-icons/fa";

const Signup = ({ isLogin, setIsLogin }) => {
  const url = import.meta.env.VITE_BASE_URL;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showpass, setShowpass] = useState(false);

  const onSignup = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Please fill in all details");
    }

    if (password.length < 4) {
      return toast.error("Password must be atleast 4 characters");
    }

    axios
      .post(`${url}/signup`, { name: name, email: email, password: password })
      .then((res) => {
        if (res.data.status == "200") {
          toast.success("User created Successfully");
        } else {
          toast.error("User already exists");
        }
      });
  };

  return (
    <form onSubmit={onSignup}>
      <div className="flex flex-col">
        <h1>Register</h1>
        <input
          className="border max-w-[500px] m-2 p-2 rounded-lg bg-white"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          className="border max-w-[500px] m-2 p-2 rounded-lg bg-white"
          type="email"
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
          className="border max-w-30 rounded-full bg-blue-700 text-white text-xl px-5 py-1 my-5 cursor-pointer hover:bg-blue-600"
          type="submit"
        >
          Signup
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
            {isLogin ? "Register now" : "Login"}
          </h1>
        </div>
      </div>
    </form>
  );
};

export default Signup;
