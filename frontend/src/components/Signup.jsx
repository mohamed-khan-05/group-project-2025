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
  const [studentNum, setStudentNum] = useState("");
  const [showpass, setShowpass] = useState(false);

  const onSignup = (e) => {
    e.preventDefault();

    if (!name || !studentNum || !password) {
      return toast.error("Please fill in all details");
    }

    const cleanedPassword = password.replace(/\s/g, "");
    const cleanedName = name.trim();

    if (cleanedPassword.length < 4) {
      return toast.error("Password must be at least 4 characters");
    }

    axios
      .post(`${url}/auth/signup`, {
        name: cleanedName,
        studentNum: studentNum,
        email: email,
        password: cleanedPassword,
      })
      .then((res) => {
        if (res.data.status == "200") {
          toast.success("User created Successfully. Please Login");
          setName("");
          setStudentNum("");
          setPassword("");
          setEmail("@dut4life.ac.za");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
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
          maxLength={50}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          className="border max-w-[500px] m-2 p-2 rounded-lg bg-white"
          type="text"
          placeholder="Student Number"
          maxLength={10}
          value={studentNum}
          onChange={(e) => {
            setStudentNum(e.target.value);
            setEmail(e.target.value + "@dut4life.ac.za");
          }}
        />
        <input
          className="border max-w-[500px] m-2 p-2 rounded-lg bg-gray-300"
          type="email"
          placeholder="email"
          value={email}
          disabled={true}
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
          className="border max-w-30 rounded-full bg-blue-700 text-white text-xl px-5 py-1 sm:my-5 my-2 cursor-pointer hover:bg-blue-600"
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
