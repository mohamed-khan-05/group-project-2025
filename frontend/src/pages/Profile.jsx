import React, { useState, useEffect, useContext } from "react";
import { Context } from "../App";
import axios from "axios";

const Profile = () => {
  const user_id = useContext(Context);
  useEffect(() => {
    axios.post();
  }, []);
  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
};

export default Profile;
