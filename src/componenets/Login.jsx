import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ onToggleForm, onUserLoggedIn }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission (Login)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        if (!formData.email || !formData.password) {
            setError('Email and password are required!');
            setIsLoading(false);
            return;
        }

        try {
            // Sign in with email and password
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // Get the user's role from the Firestore 'users' collection
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const { role } = userData;

                // Check if user is a freelancer
                if (role === 'freelance') {
                    // Pass the user details to the parent component
                    onUserLoggedIn(userData, user.uid);
                    // Optionally, show success toast
                    toast.success('Login successful', { position: 'top-center', autoClose: 5000 });
                } else {
                    setError('User is not a freelancer');
                }
            } else {
                setError('User data not found!');
            }
        } catch (err) {
            console.error('Login error:', err.message);
            setError(err.message);
            toast.error(`Error: ${err.message}`, { position: 'top-center', autoClose: 5000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="font-sans text-3xl font-bold mb-4">LOGIN</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>} {/* Error message */}
            <form onSubmit={handleSubmit}>
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
                    disabled={isLoading} // Disable the button while loading
                >
                    {isLoading ? 'Logging in...' : 'Login'}
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

            <ToastContainer />
        </div>
    );
};

export default Login;
