// src/components/Login.js
import React, { useState } from 'react';

const Login = ({ onToggleForm }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Logging in...');
        console.log('Form Data:', formData);
        // Add your login API call here
    };

    return (
        <div>
            <h1 className="font-sans text-3xl font-bold mb-4">LOGIN</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="w-full p-2 border rounded"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-purple-500 text-white rounded-lg py-2 px-4 w-full"
                >
                    Login Now
                </button>
            </form>
            <div className="mt-8 text-center">
                <span>Don't have an account? </span>
                <button
                    onClick={() => onToggleForm(true)}
                    className="text-purple-500"
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default Login;
