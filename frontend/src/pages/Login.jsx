import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN } from "../graphql/mutations/user_mutation";
import toast from "react-hot-toast";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const client = useApolloClient();
  const navigate = useNavigate();

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      toast.success("Logged in successfully");
      await client.resetStore();
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ variables: { input: loginData } });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="auth-card w-full max-w-md p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-6 text-white text-center text-shadow-lg text-outline">
          Login
        </h1>
        <h2 className="text-xl mb-8 text-white text-center text-shadow-md text-outline">
          Welcome back! Log in to your account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="text-white text-xl font-semibold block mb-2 text-shadow-sm text-outline"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              className="auth-input w-full text-outline"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-white text-xl font-semibold block mb-2 text-shadow-sm text-outline"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="auth-input w-full text-outline"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="auth-button w-full text-outline auth-input"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <div className="mt-8 text-lg text-white text-center text-shadow-sm text-outline">
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-white hover:underline font-semibold text-outline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
