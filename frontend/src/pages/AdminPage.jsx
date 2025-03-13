import React, { useEffect, useContext } from "react";
import AdminMenu from "../components/AdminMenu";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";

const AdminPage = () => {
  const navigate = useNavigate();
  const user_id = useContext(Context);

  useEffect(() => {
    if (user_id && user_id != 1) {
      localStorage.removeItem("user_id");
      navigate("/");
    }
  }, [user_id]);

  return (
    <div>
      AdminPage
      <AdminMenu />
    </div>
  );
};

export default AdminPage;
