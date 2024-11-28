import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import HomePage from './HomePage'; // Import your full-screen homepage component

const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
    const [userDetails, setUserDetails] = useState(null); // To hold user details after login

    const toggleForm = (isRegisterPage) => {
        setIsRegister(isRegisterPage);
    };

    const handleUserLoggedIn = (userData) => {
        setUserDetails(userData);
        setIsLoggedIn(true); // Set login status to true
    };

    return (
        <div className="flex h-screen justify-center bg-purple-500 items-center">
            {isLoggedIn ? (
                <HomePage user={userDetails} /> // Render the homepage when logged in
            ) : (
                <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
                    {isRegister ? (
                        <Register onToggleForm={toggleForm} />
                    ) : (
                        <Login onToggleForm={toggleForm} onUserLoggedIn={handleUserLoggedIn} />
                    )}
                </div>
            )}
        </div>
    );
};

export default AuthPage;
