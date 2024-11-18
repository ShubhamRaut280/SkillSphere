import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import FreelancerUpdateForm from './FreelancerUpdateForm';  // Import FreelancerUpdateForm

const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status
    const [userDetails, setUserDetails] = useState(null); // To hold user details after login
    const [userId, setUserId] = useState(null); // To hold user id after login

    const toggleForm = (isRegisterPage) => {
        setIsRegister(isRegisterPage);
    };

    const handleUserLoggedIn = (userData, userUid) => {
        setUserDetails(userData);
        setUserId(userUid);
        setIsLoggedIn(true); // Set login status to true after successful login
    };

    return (
        <div className="flex h-screen justify-center bg-purple-500 items-center">
            <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
                {isLoggedIn ? (
                    // If user is logged in, show FreelancerUpdateForm
                    <FreelancerUpdateForm userDetails={userDetails} onToggleForm={toggleForm} />
                ) : isRegister ? (
                    // Show Register form if the isRegister state is true
                    <Register onToggleForm={toggleForm} />
                ) : (
                    // Show Login form if the isRegister state is false
                    <Login onToggleForm={toggleForm} onUserLoggedIn={handleUserLoggedIn} />
                )}
            </div>
        </div>
    );
};

export default AuthPage;
