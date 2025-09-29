import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuth } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const { loginUser, registerUser, signInWithGoogle } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const idToken = await user.getIdToken(true);
                await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/users/sync`, { idToken });
            }

            Swal.fire({
                icon: "success",
                title: "Google Sign-In Successful!",
                text: "Welcome back!",
                timer: 2000,
                showConfirmButton: false
            });

            navigate(isLogin ? "/" : "/dashboard");
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            Swal.fire({
                icon: "error",
                title: "Google Sign-In Failed",
                text: error.message || "An error occurred during Google authentication."
            });
        }
    };

    const onSubmit = async (data) => {
        try {
            if (isLogin) {
                await loginUser(data.email, data.password);
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    const idToken = await user.getIdToken(true);
                    await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/users/sync`, { idToken });
                }

                Swal.fire({
                    icon: "success",
                    title: "Login Successful!",
                    text: `Welcome back, ${auth.currentUser.displayName || "User"}!`,
                    timer: 2000,
                    showConfirmButton: false
                });

                navigate("/");
            } else {
                await registerUser(data.email, data.password, data.username, data.phone);

                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    const idToken = await user.getIdToken(true);
                    await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/users/sync`, { idToken });
                }

                Swal.fire({
                    icon: "success",
                    title: "Registration Successful!",
                    text: "Welcome to Book Store!",
                    timer: 2000,
                    showConfirmButton: false
                });

                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Auth Error:", error);
            let errorMessage = "An error occurred.";

            if (error.code?.includes("auth")) {
                switch (error.code) {
                    case "auth/user-not-found":
                        errorMessage = "User not found.";
                        break;
                    case "auth/wrong-password":
                        errorMessage = "Incorrect password.";
                        break;
                    case "auth/email-already-in-use":
                        errorMessage = "Email already registered.";
                        break;
                    case "auth/invalid-email":
                        errorMessage = "Invalid email address.";
                        break;
                    case "auth/weak-password":
                        errorMessage = "Password must be at least 6 characters.";
                        break;
                    default:
                        errorMessage = "Authentication failed.";
                }
            }

            Swal.fire({
                icon: "error",
                title: isLogin ? "Login Failed" : "Signup Failed",
                text: errorMessage
            });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg px-8 py-6 w-full">
            <h2 className="text-2xl font-bold text-center mb-4">
                {isLogin ? "Login Form" : "Signup Form"}
            </h2>

            {/* Toggle Button */}
            <div className="flex mb-6 border border-gray-300 rounded-md overflow-hidden">
                <button
                    className={`flex-1 py-2 font-medium transition-colors ${isLogin
                        ? "bg-gradient-to-r from-blue-700 to-blue-500 text-white"
                        : "bg-white text-gray-700"}`}
                    onClick={() => setIsLogin(true)}
                >
                    Login
                </button>
                <button
                    className={`flex-1 py-2 font-medium transition-colors ${!isLogin
                        ? "bg-gradient-to-r from-blue-700 to-blue-500 text-white"
                        : "bg-white text-gray-700"}`}
                    onClick={() => setIsLogin(false)}
                >
                    Signup
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {!isLogin && (
                    <>
                        <input
                            {...register("username", { required: !isLogin })}
                            type="text"
                            placeholder="Username"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            {...register("phone", { required: !isLogin })}
                            type="text"
                            placeholder="Phone Number"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </>
                )}

                <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    {...register("password", { required: true })}
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {isLogin && (
                    <div className="text-right text-sm">
                        <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white py-2 rounded-md hover:opacity-90"
                >
                    {isLogin ? "Login" : "Signup"}
                </button>
            </form>

            <div className="text-center text-sm mt-4">
                {isLogin ? "Not a member?" : "Have an account?"}{" "}
                <span
                    className="text-blue-500 hover:underline cursor-pointer"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "Signup now" : "Login"}
                </span>
            </div>

            <button
                onClick={handleGoogleSignIn}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
                <FaGoogle /> Sign in with Google
            </button>

            {!isLogin && (
                <p className="mt-5 text-center text-gray-500 text-xs">
                    ©2025 Book Store. All rights reserved.
                </p>
            )}
        </div>
    );
};

export default Auth;
