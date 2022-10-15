import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuthContext } from "../context/AdminAuthContext";
const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { isAuthenticated,setIsAuthenticated } = useAdminAuthContext();
  const navigate = useNavigate()
  const location = useLocation()
useEffect(() => {
    if (isAuthenticated) {
      const { from } = location.state || { from: { pathname: "/admin" } };
      console.log(location.state)
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const SERVER_API = import.meta.env.VITE_SERVER_URL || "";
    try {
      const res = await fetch(SERVER_API + "/admin/login", {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res || !res.ok) return alert("Some error occurred!");
      const response = await res.json();
      if (response.success) {
        localStorage.setItem("auth-token", response.authToken);
        setIsAuthenticated(true);
        return;
      }
      alert("wrong password");
    } catch (e) {
      alert("Some error occurred while logging in");
    }
  };
  return (
    <>
      <div className="w-screen h-screen min-h-screen flex items-center justify-center">
        <div class="w-full max-w-sm">
          <form
            class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
              >
                Username
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }));
                }}
              />
            </div>
            <div class="mb-6">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                Password
              </label>
              <input
                class="shadow appearance-none border _border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
              />
              {/* <p class="text-red-500 text-xs italic">Please choose a password.</p> */}
            </div>
            <div class="flex items-center justify-center w-full">
              <button
                class=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
              {/* <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
        Forgot Password?
      </a> */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
