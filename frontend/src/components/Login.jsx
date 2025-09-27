import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useAuth } from '../context/AuthContext';
import { getAuth } from "firebase/auth";
import axios from 'axios';

const Login = () => {
  const [message, setMessage] = useState("");
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);

      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken(true);
        await axios.post('/api/users/sync', { idToken });
      }

      alert("Login successful!");
      navigate("/");
    } catch (error) {
      setMessage("Please provide a valid email and password");
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();

      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken(true);
        await axios.post('/api/users/sync', { idToken });
      }

      alert("Login successful!");
      navigate("/");
    } catch (error) {
      alert("Google sign in failed!");
      console.error(error);
    }
  };

  return (
    <div className='h-[calc(100vh-120px)] flex justify-center items-center'>
      <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <h2 className='text-xl font-semibold mb-4'>Please Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <label htmlFor="email">Email</label>
            <input {...register("email", { required: true })} type="email" id="email" placeholder='Email Address' />
          </div>
          <div className='mb-4'>
            <label htmlFor="password">Password</label>
            <input {...register("password", { required: true })} type="password" id="password" placeholder='Password' />
          </div>
          {message && <p className='text-red-500 text-xs italic mb-3'>{message}</p>}
          <button type="submit">Login</button>
        </form>

        <p>Don't have an account? <Link to="/register">Register</Link></p>

        <button onClick={handleGoogleSignIn}>
          <FaGoogle /> Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
