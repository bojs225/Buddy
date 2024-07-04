import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useApolloClient } from "@apollo/client";
import { SIGN_UP } from "../graphql/mutations/user_mutation";
import toast from "react-hot-toast";

const SignUp = () => {
  const [signUpData, setSignUpData] = useState({
    username: "",
    password: "",
    name: "",
    gender: "",
  });

  const client = useApolloClient();
  const navigate = useNavigate();

  const [signUp, { loading }] = useMutation(SIGN_UP, {
    onCompleted: async (data) => {
      toast.success("Account created successfully");
      await client.resetStore();
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp({ variables: { input: signUpData } });
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-12">
      <div className="auth-card w-full max-w-md p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-6 text-white text-center text-shadow-lg text-outline">
          Sign Up
        </h1>
        <h2 className="text-xl mb-8 text-white text-center text-shadow-md text-outline">
          Create your account
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
              value={signUpData.username}
              onChange={handleChange}
              className="auth-input w-full text-outline"
              placeholder="Choose a username"
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
              value={signUpData.password}
              onChange={handleChange}
              className="auth-input w-full text-outline"
              placeholder="Create a password"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="text-white text-xl font-semibold block mb-2 text-shadow-sm text-outline"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={signUpData.name}
              onChange={handleChange}
              className="auth-input w-full text-outline"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="text-white text-xl font-semibold block mb-2 text-shadow-sm text-outline">
              Gender
            </label>
            <div className="flex justify-between items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={signUpData.gender === "male"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 mr-2 rounded-full border-2 ${
                    signUpData.gender === "male"
                      ? "bg-white border-white"
                      : "border-white"
                  }`}
                ></div>
                <span className="text-white text-lg text-outline">Male</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={signUpData.gender === "female"}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 mr-2 rounded-full border-2 ${
                    signUpData.gender === "female"
                      ? "bg-white border-white"
                      : "border-white"
                  }`}
                ></div>
                <span className="text-white text-lg text-outline">Female</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="auth-input w-full text-outline"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-8 text-lg text-white text-center text-shadow-sm text-outline">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white hover:underline font-semibold text-outline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
