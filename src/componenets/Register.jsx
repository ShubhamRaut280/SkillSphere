import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig.js'; // Import Firebase auth and Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Correct modular import for registration
import { updateProfile } from 'firebase/auth'; // Correct modular import for profile update
import { setDoc, doc } from 'firebase/firestore'; // Firestore functions
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify styles
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

const Register = ({ onToggleForm }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        rolde: 'user', // Default role set to "user"
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New state to handle loading

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
        setIsLoading(true); // Set loading to true when the form is submitted

        // Validation: Check if all fields are filled
        if (!formData.name || !formData.email || !formData.phoneNumber || !formData.address || !formData.username || !formData.password) {
            setError('All fields are required!');
            setIsLoading(false); // Set loading to false if validation fails
            return;
        }

        try {
            // Register user with email and password using the modular approach
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            console.log('User registered:', user);

            // After successful registration, you can update the user profile
            await updateProfile(user, {
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

            // Display success notification
            toast.success('Registration successful! Now you can login with your credentials', { position: "top-center", autoClose: 5000 });

        } catch (err) {
            console.error('Error during registration:', err.message);
            setError(err.message); // Display Firebase error message
            toast.error(`Error: ${err.message}`, { position: "top-center", autoClose: 5000 });
        } finally {
            setIsLoading(false); // Set loading to false once the operation is complete
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
                    disabled={isLoading} // Disable the button when loading
                >
                    {isLoading ? (
                        <CircularProgress size={24} color="inherit" /> // Display Circular Progress when loading
                    ) : (
                        'Register Now'
                    )}
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

            {/* Toast container */}
            <ToastContainer />
        </div>
    );
};

export default Register;
