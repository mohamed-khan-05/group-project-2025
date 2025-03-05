import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Signup = () => {
  const url = import.meta.env.VITE_BASE_URL;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignup = (e) => {
    e.preventDefault();
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
      <ToastContainer hideProgressBar />
      <div className="flex flex-col">
        <h1>Signup</h1>
        <input
          className="border max-w-100 m-2 p-2 rounded-lg bg-white"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          className="border max-w-100 m-2 p-2 rounded-lg bg-white"
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className="border max-w-100 m-2 p-2 rounded-lg bg-white"
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className="border max-w-30 rounded-full bg-blue-700 text-white text-xl px-5 py-1"
          type="submit"
        >
          Signup
        </button>
      </div>
    </form>
  );
};

export default Signup;
