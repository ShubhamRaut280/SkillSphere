// src/components/Login.js
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Importing necessary functions

const Login = ({ onToggleForm }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message on submit
    
        // Validation: Check if both fields are filled
        if (!formData.username || !formData.password) {
            setError('Both fields are required!');
            return;
        }
    
        const auth = getAuth(); // Initialize Firebase Auth
    
        try {
            // Login user with email and password
            const userCredential = await signInWithEmailAndPassword(auth, formData.username, formData.password);
            const user = userCredential.user;
            console.log('User logged in:', user);
    
            alert('Login successful');
        } catch (err) {
            console.error('Error during login:', err.message);
    
            // Handle Firebase specific error codes and display friendly messages
            if (err.code === 'auth/invalid-email') {
                setError('The email address is invalid. Please check your email format and try again.');
            } else if (err.code === 'auth/user-not-found') {
                setError('No user found with this email address. Please check your credentials or register.');
            } else if (err.code === 'auth/wrong-password') {
                setError('The password is incorrect. Please try again.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };
    

    return (
        <div>
            <h1 className="font-sans text-3xl font-bold mb-4">LOGIN</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>} {/* Error message */}
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
