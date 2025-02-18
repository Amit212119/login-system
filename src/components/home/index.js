import React from 'react'
import './index.css';
import {  logoutUser } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.auth.user);
     const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);


     const handleLogout = () => {
        dispatch(logoutUser());
        localStorage.removeItem('loginUser');

     }
 return (
   <>
     {isAuthenticated ? (
       <div className='DetailContainer'>
         <h2>Welcome, {profile.name}</h2>
         <p>
           Email: <span className='userDetails'>{profile.email}</span>
         </p>
         <p>
           Phone: <span className='userDetails'> {profile.phone}</span>
         </p>
         <div className='btnDiv'>
           <button onClick={handleLogout} className='btn'>Logout</button>
           <button className='btn'><Link to='/updateProfile' className='link'>Update Profile</Link></button>
         </div>
       </div>
     ) : (
       <button>
         <Link to='/login'>Login</Link>
       </button>
     )}
   </>
 );
}

export default Home