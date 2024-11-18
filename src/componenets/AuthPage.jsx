// src/components/AuthPage.js
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(false);

    const toggleForm = (isRegisterPage) => {
        setIsRegister(isRegisterPage);
    };

    return (
        <div className="flex h-screen justify-center bg-purple-500 items-center">
            <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
                {isRegister ? (
                    <Register onToggleForm={toggleForm} />
                ) : (
                    <Login onToggleForm={toggleForm} />
                )}
            </div>
        </div>
    );
};

export default AuthPage;
