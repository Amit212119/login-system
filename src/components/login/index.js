import React, { useEffect, useState } from 'react';
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginUser } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const initialValue = {
    email: '',
    password: '',
  };
  const [loginData, setLoginData] = useState(initialValue);
  const [error, setError] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const { isAuthenticated, error: loginError, message } = useSelector((state) => state.auth);
   console.log('login', isAuthenticated)


   useEffect(() => {
     if (isAuthenticated) {
       toast.success(message, { position: 'top-center', autoClose: 1000 });
       setTimeout(() => navigate('/'), 1000);
     } else if (loginError) {
       toast.error(loginError, { position: 'top-center', autoClose: 2000 });
     }
   }, [isAuthenticated, loginError, message, navigate]);


  const loginValidation = () => {
    let errors = {};
    if (!loginData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!loginData.password.trim()) {
      errors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(loginData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(loginData.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/\d/.test(loginData.password)) {
      errors.password = 'Password must contain at least one number';
    } else if (!/[@$!%*?&]/.test(loginData.password)) {
      errors.password = 'Password must contain at least one special character';
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    setError((prevErr) => ({ ...prevErr, [name]: '' }));
  };

  // const handleSubmit = async (e) => {
    
  //   e.preventDefault();
  //   console.log('type',errorType);
  //   console.log('message',message);

  //   if (loginValidation()) {
  //     try {
  //       dispatch(loginUser(loginData));
  //       if (!errorType) {
  //         setLoginData(initialValue);
  //         toast.success(message, {
  //           position: 'top-center',
  //           autoClose: 1000,
  //         });
  //         setTimeout(() => {
  //           navigate('/');
  //         }, 1000);
  //       } else {
  //         toast.error(message, {
  //           position: 'top-center',
  //           autoClose: 2000,
  //         });
  //         setLoginData(initialValue);
  //       }
  //       // const res = await axios.get('http://localhost:5000/register');
  //       // const loginCredential = res.data.find((item) => item.email === loginData.email);
  //       // if (loginCredential.email === loginData.email && loginCredential.password === loginData.password) {
  //       //   localStorage.setItem('loginUser', JSON.stringify(loginCredential));
  //       //   console.log('auth', auth);
  //       //    dispatch(loginUser(loginData));
  //       //   setLoginData(initialValue);
  //       //   toast.success('Login Successfully', {
  //       //     position: 'top-center',
  //       //     autoClose: 1000,
  //       //   });
  //       //   setTimeout(() => {
  //       //     navigate('/');
  //       //   }, 1000);
  //       // } else {
  //       //    toast.error('Invalid credentials! Please try again.', {
  //       //     position:'top-center',
  //       //     autoClose: 2000,
  //       //    });
  //       //    setLoginData(initialValue);
  //       // }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  // };
 const handleSubmit = (e) => {
   e.preventDefault();
   if (loginValidation()) {
     dispatch(loginUser(loginData));
   }
 };
   const { isLoading } = useSelector((state) => state.auth);
 
  return (
    <div className='container'>
      <form
        className='formContainer'
        onSubmit={handleSubmit}>
        <p className='heading'>Login</p>
        <div>
          <input
            type='email'
            className='inputField'
            placeholder='Email'
            name='email'
            onChange={handleChange}
            value={loginData.email}
          />
          {error && <p className='errorMessage'>{error.email}</p>}
        </div>
        <div>
          <input
            type='password'
            className='inputField'
            placeholder='Password'
            name='password'
            onChange={handleChange}
            value={loginData.password}
          />
          {error && <p className='errorMessage'>{error.password}</p>}
        </div>
        <div>
          <button
            type='submit'
            disabled={isLoading}
            className='button'>
            {isLoading ?'Submitting': 'Submit'}
          </button>
          <p className='paragraph'>
            Don't have an account?{' '}
            <Link
              to='/signup'
              className='link'>
              Sign up
            </Link>
          </p>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
