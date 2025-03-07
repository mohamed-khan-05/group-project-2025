import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";

const LoginSignup = ({ setGlobalid }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      return;
    } else if (user_id === "1") {
      return navigate("/adminpage");
    } else {
      return navigate(`/homepage/${user_id}`);
    }
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center">
      <div className="bg-blue-300 py-15 px-20 rounded-2xl">
        <Login setGlobalid={setGlobalid} />
        <Signup />
      </div>
    </div>
  );
};

export default LoginSignup;
