import React from 'react';
import './App.css';
import Registration from './components/registration';
import Login from './components/login';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Home from './components/home';
import ProtectedRoute from './components/protectRoute';
import UpdateProfile from './components/updateProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/updateProfile" element={<UpdateProfile />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
