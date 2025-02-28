import React, { useState } from 'react';
import './index.css';
import { logoutUser } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';

const Home = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showMenu, setShowMenu] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('loginUser');
  };
  return (
    <>
      <nav className="navbar">
        <h2>Welcome, {profile?.name || 'Profile'}</h2>

        <ul className={`navDetails ${showNav ? 'mobileNav' : ''}`}>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
        {isAuthenticated && showNav ? (
          <div className="mobileButton">
            <button onClick={handleLogout} className="mobileLogoutButton">
              LogOut
            </button>

            <Link to="/updateProfile" className="mobileUpdateProfile">
              Update Profile
            </Link>
          </div>
        ) : (
          showNav && (
            <div className="mobileLoginButtonDiv">
              <Link to="/login" className="mobileLoginButton">
                Login
              </Link>
            </div>
          )
        )}
        {isAuthenticated ? (
          <div>
            <button
              className="profileButton"
              onClick={() => setShowMenu(!showMenu)}
            >
              {profile?.email}
            </button>
            {showMenu && (
              <div className={'dropdown-menu'}>
                <button onClick={handleLogout} className="logoutButton">
                  Logout
                </button>
                <Link to="/updateProfile" className="updateProfile">
                  Update Profile
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="loginButton">
            Login
          </Link>
        )}
        <button className="menu-toggle" onClick={() => setShowNav(!showNav)}>
          <GiHamburgerMenu size={25} />
        </button>
      </nav>
      <section className="homeSection">
        {isAuthenticated && (
          <div className="DetailContainer">
            <p className="nameHeading">
              Welcome, <span className="name">{profile?.name}</span>
            </p>
            <p className="userInfo">
              Email: <span className="userDetails">{profile?.email}</span>
            </p>
            <p className="userInfo">
              Phone: <span className="userDetails"> {profile?.phone}</span>
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
