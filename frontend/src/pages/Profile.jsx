import React, { useState, useEffect, useContext } from "react";
import { Context } from "../App";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Media
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const user_id = useContext(Context);
  const url = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: "" });
  const [num, setNum] = useState();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    axios
      .post(`${url}/getprofile`, { user_id })
      .then((res) => {
        if (res.data.status === "200" && res.data.user) {
          setUser({ name: res.data.user.name });

          // Extract part before '@' in student_num
          const studentNumber = res.data.user.student_num?.split("@")[0] || "";
          setNum(studentNumber);
        } else {
          toast.error("Error fetching profile.");
        }
      })
      .catch(() => toast.error("Server error."));
  }, [user_id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`${url}/profileedit`, {
        user_id,
        name: user.name,
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (res.data.status === "200") {
        toast.success("Profile updated successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else if (res.data.status === "401") {
        toast.error("Incorrect old password.");
      } else {
        toast.error("Error updating profile.");
      }
    } catch {
      toast.error("Server error.");
    }
  };

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800 transition-all"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <ToastContainer />

        <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Student number */}
          <div>
            <label className="block text-gray-700 font-medium">
              Student Number
            </label>
            <input
              type="text"
              value={num}
              disabled
              className="w-full border bg-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Old Password Input */}
          <div>
            <label className="block text-gray-700 font-medium">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* New Password Input */}
          <div>
            <label className="block text-gray-700 font-medium">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-gray-700 font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;
