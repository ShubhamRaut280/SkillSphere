import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig.js'; // Import Firebase auth and Firestore
import { setDoc, doc } from 'firebase/firestore'; // Firestore functions

const Register = ({ onToggleForm }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        role: 'user', // Default role set to "user"
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
        setError('');

        // Validation: Check if all fields are filled
        if (!formData.name || !formData.email || !formData.phoneNumber || !formData.address || !formData.username || !formData.password) {
            setError('All fields are required!');
            return;
        }

        try {
            // Register user with email and password
            const userCredential = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
            const user = userCredential.user;
            console.log('User registered:', user);

            // After successful registration, you can update the user profile
            await user.updateProfile({
                displayName: formData.username,
                phoneNumber: formData.phoneNumber,
            });

            // Save additional user details like address, role, etc., in Firestore
            const userRef = doc(db, 'users', user.uid); // Firestore document reference
            await setDoc(userRef, {
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                role: formData.role,
                username: formData.username,
            });

            alert('Registration successful');

        } catch (err) {
            console.error('Error during registration:', err.message);
            setError(err.message); // Display Firebase error message
        }
    };

    return (
        <div>
            <h1 className="font-sans text-3xl font-bold mb-4">REGISTER</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>} {/* Error message */}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="w-full p-2 border rounded"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className="w-full p-2 border rounded"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="w-full p-2 border rounded"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <select
                        name="role"
                        className="w-full p-2 border rounded"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="user">User</option>
                        <option value="freelance">Freelance</option>
                    </select>
                </div>
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
                    Register Now
                </button>
            </form>
            <div className="mt-8 text-center">
                <span>Already have an account? </span>
                <button
                    onClick={() => onToggleForm(false)}
                    className="text-purple-500"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Register;
