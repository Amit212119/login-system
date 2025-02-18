import React, { useState } from 'react';
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, updateUser } from '../store/authSlice';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  console.log('id',user.id);

  const [updateData, setUpdateData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData({
      ...updateData,
      [name]: value,
    });

    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};

    if (!updateData.name.trim()) {
      errors.name = 'Name is required';
    } else if (updateData.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!updateData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!updateData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(updateData.phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(updateData)
      dispatch(updateUser( updateData ));
      toast.success('Update Successfully', {
        position: 'top-center',
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };
  return (
    <>
      <div className='container'>
        <form
          onSubmit={handleSubmit}
          className='formContainer'>
          <p className='heading'>Update Details</p>
          <div>
            <input
              type='text'
              className='inputField'
              placeholder='Full Name'
              name='name'
              onChange={handleChange}
              value={updateData.name}
            />
            {errors.name && <p className='errorMessage'>{errors.name}</p>}
          </div>
          <div>
            <input
              type='number'
              className='inputField'
              placeholder='Phone No.'
              name='phone'
              onChange={handleChange}
              value={updateData.phone}
            />
            {errors.phone && <p className='errorMessage'>{errors.phone}</p>}
          </div>
          <div>
            <button
              type='submit'
              className='button'>
              Update
            </button>
            <p className='paragraph'>
              You don't want to Update ?
              <Link
                to='/'
                className='link'>
                Home
              </Link>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default UpdateProfile;
