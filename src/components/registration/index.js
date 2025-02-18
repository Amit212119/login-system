import React, { useEffect, useState } from 'react';
import './index.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValue = {
    name: '',
    email: '',
    phone: '',
    password: '',
  };
  const { isAuthenticated, error: signupError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success(message, { position: 'top-center', autoClose: 1000 });
      setTimeout(() => navigate('/'), 1000);
    } else if (signupError) {
      toast.error(signupError, { position: 'top-center', autoClose: 2000 });
    }
  }, [isAuthenticated, signupError, message,navigate]);

  const [signupData, setSignupData] = useState(initialValue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });

    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};

    if (!signupData.name.trim()) {
      errors.name = 'Name is required';
    } else if (signupData.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!signupData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!signupData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(signupData.phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }

    if (!signupData.password.trim()) {
      errors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(signupData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(signupData.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/\d/.test(signupData.password)) {
      errors.password = 'Password must contain at least one number';
    } else if (!/[@$!%*?&]/.test(signupData.password)) {
      errors.password = 'Password must contain at least one special character';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(registerUser(signupData));
    }
  };
  const { isLoading } = useSelector((state) => state.auth);
  return (
    <>
      <div className='container'>
        <form
          onSubmit={handleSubmit}
          className='formContainer'>
          <p className='heading'>Sign Up</p>
          <div>
            <input
              type='text'
              className='inputField'
              placeholder='Full Name'
              name='name'
              onChange={handleChange}
              value={signupData.name}
            />
            {errors.name && <p className='errorMessage'>{errors.name}</p>}
          </div>
          <div>
            <input
              type='email'
              className='inputField'
              placeholder='Email'
              name='email'
              onChange={handleChange}
              value={signupData.email}
            />
            {errors.email && <p className='errorMessage'>{errors.email}</p>}
          </div>
          <div>
            <input
              type='number'
              className='inputField'
              placeholder='Phone No.'
              name='phone'
              onChange={handleChange}
              value={signupData.phone}
            />
            {errors.phone && <p className='errorMessage'>{errors.phone}</p>}
          </div>
          <div>
            <input
              type='password'
              className='inputField'
              placeholder='Password'
              name='password'
              onChange={handleChange}
              value={signupData.password}
            />
            {errors.password && <p className='errorMessage'>{errors.password}</p>}
          </div>
          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='button'>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
            <p className='paragraph'>
              Already have an account?
              <Link
                to='/login'
                className='link'>
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default Registration;
