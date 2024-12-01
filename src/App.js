import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthPage from './componenets/Pages/AuthPage';
import HomePage from './componenets/Pages/HomePage';
import ProfilePage from './componenets/Pages/ProfilePage';
import UserProfilePage from './componenets/Pages/UserProfilePage';
import ViewProfilePage from './componenets/Pages/ViewProfilePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check local storage for userId and update login state
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const RequireAuth = ({ children }) => {
    const location = useLocation();
    const userId = localStorage.getItem('userId');

    // Redirect to home if userId exists and user is on login/register pages
    if (
      userId &&
      (location.pathname === '/' || location.pathname === '/register')
    ) {
      return <Navigate to="/home" replace />;
    }

    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Handle login or registration with redirection */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <AuthPage onLoginSuccess={() => setIsLoggedIn(true)} />
              </RequireAuth>
            }
          />
          {/* Define other pages */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/userprofile" element={<UserProfilePage />} />
          <Route path="/viewprofile/:userId" element={<ViewProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
