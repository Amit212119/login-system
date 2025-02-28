import React, { useEffect, useState } from 'react';
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
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
  const {
    isAuthenticated,
    error: loginError,
    message,
  } = useSelector((state) => state.auth);
  console.log('login', isAuthenticated);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginValidation()) {
      dispatch(loginUser(loginData));
    }
  };
  const { isLoading } = useSelector((state) => state.auth);

  return (
    <div className="container">
      <form className="loginFormContainer" onSubmit={handleSubmit}>
        <p className="heading">Login</p>
        <div className="loginInputField">
          <input
            type="email"
            className="loginFormField"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={loginData.email}
          />
          {error && <p className="errorMessage">{error.email}</p>}
        </div>
        <div className="loginInputField">
          <input
            type="password"
            className="loginFormField"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={loginData.password}
          />
          {error && <p className="errorMessage">{error.password}</p>}
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="loginSubmitButton"
          >
            {isLoading ? 'Submitting' : 'Submit'}
          </button>
          <p className="loginParagraph">
            Don&apos;t have an account?
            <Link to="/signup" className="link">
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
