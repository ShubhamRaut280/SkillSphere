import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig.js'; // Import Firebase auth and Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import Eye Icons

const Register = ({ onToggleForm }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        location: '', // New location field
        role: 'user', // Default role set to "user"
        password: '',
        confirmPassword: '',
        bio: '', // For freelance users
        skills: '', // For freelance users
        hourlyRate: '', // For freelance users
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Utility functions for capitalization

    const capitalizeEachSubstring = (str) => {
        if (!str) return '';
        return str
            .split(',')
            .map((substr) => substr.trim().charAt(0).toUpperCase() + substr.trim().slice(1))
            .join(', ');
    };
    

    const capitalizeEachWord = (str) => {
        return str
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const capitalizeFirstWord = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Toggle password visibility
    const handlePasswordVisibility = () => setShowPassword(!showPassword);
    const handleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation: Check if all fields are filled and passwords match
        if (!formData.name || !formData.email || !formData.phoneNumber || !formData.address || !formData.location || !formData.password || !formData.confirmPassword) {
            setError('All fields are required!');
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            setIsLoading(false);
            return;
        }

        try {
            // Register user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
        
            // Update the user profile after successful registration
            await updateProfile(user, {
                displayName: capitalizeEachWord(formData.name),
                phoneNumber: formData.phoneNumber,
            });
        
            // Save additional user details in Firestore
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                name: capitalizeEachWord(formData.name),
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: capitalizeFirstWord(formData.address),
                location: capitalizeEachWord(formData.location), // Save location capitalized
                role: formData.role,
                bio: capitalizeFirstWord(formData.bio), // Save bio capitalized
                skills: capitalizeEachSubstring(formData.skills), // Capitalize each skill
                hourlyRate: formData.hourlyRate,
            });
        
            toast.success('Registration successful! Now you can login with your credentials', { position: "top-center", autoClose: 5000 });
        } catch (err) {
            console.error('Error during registration:', err.message);
            setError(err.message);
            toast.error(`Error: ${err.message}`, { position: "top-center", autoClose: 5000 });
        } finally {
            setIsLoading(false);
        }
        
    };

    return (
        <div>
            <h1 className="font-sans text-3xl font-bold mb-4">REGISTER</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}

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
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        className="w-full p-2 border rounded"
                        value={formData.location}
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

                {/* Show additional fields for Freelance role */}
                {formData.role === 'freelance' && (
                    <>
                        <div className="mb-4">
                            <textarea
                                name="bio"
                                placeholder="Bio"
                                className="w-full p-2 border rounded"
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                name="skills"
                                placeholder="Skills"
                                className="w-full p-2 border rounded"
                                value={formData.skills}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="number"
                                name="hourlyRate"
                                placeholder="Hourly Rate"
                                className="w-full p-2 border rounded"
                                value={formData.hourlyRate}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                {/* Password Field with Eye Button */}
                <div className="relative mb-4">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded pr-10"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={handlePasswordVisibility}
                        className="absolute right-3 top-2"
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </button>
                </div>
                {/* Confirm Password Field with Eye Button */}
                <div className="relative mb-4">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="w-full p-2 border rounded pr-10"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={handleConfirmPasswordVisibility}
                        className="absolute right-3 top-2"
                    >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </button>
                </div>

                <button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2 px-4 w-full"
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Register Now'}
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

            <ToastContainer />
        </div>
    );
};

export default Register;
