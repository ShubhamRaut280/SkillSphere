import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FreelancerUpdateForm = ({ userDetails, onToggleForm }) => {
    const [updateFormData, setUpdateFormData] = useState({
        name: '',
        availabilityStart: '',
        availabilityEnd: '',
        skills: '',
        hourlyRate: 0,
    });
    const [isLoading, setIsLoading] = useState(false);

    // Set initial form data when userDetails prop is available
    useEffect(() => {
        if (userDetails) {
            setUpdateFormData({
                name: userDetails.name || '',
                availabilityStart: userDetails.availabilityStart || '',
                availabilityEnd: userDetails.availabilityEnd || '',
                skills: userDetails.skills || '',
                hourlyRate: userDetails.hourlyRate || 0,
            });
        }
    }, [userDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData({
            ...updateFormData,
            [name]: value,
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Check if userDetails or userDetails.uid is undefined
        if (!userDetails || !userDetails.uid) {
            console.log(userDetails)
            toast.error('User details are invalid or missing.');
            setIsLoading(false);
            return;
        }

        try {
            // Check if freelancer document exists in the 'freelance' collection
            const freelanceDocRef = doc(db, 'freelance', userDetails.uid);
            const freelanceDocSnapshot = await getDoc(freelanceDocRef);

            if (!freelanceDocSnapshot.exists()) {
                // Create a new document if it doesn't exist
                await setDoc(freelanceDocRef, {
                    freelanceId: userDetails.uid,
                    skills: updateFormData.skills,
                    availabilityStart: updateFormData.availabilityStart,
                    availabilityEnd: updateFormData.availabilityEnd,
                    hourlyRate: updateFormData.hourlyRate,
                });
                toast.success('Profile created successfully!', { position: 'top-center', autoClose: 5000 });
            } else {
                // Update the existing document with new values
                await setDoc(freelanceDocRef, {
                    freelanceId: userDetails.uid,
                    skills: updateFormData.skills,
                    availabilityStart: updateFormData.availabilityStart,
                    availabilityEnd: updateFormData.availabilityEnd,
                    hourlyRate: updateFormData.hourlyRate,
                }, { merge: true });

                toast.success('Profile updated successfully!', { position: 'top-center', autoClose: 5000 });
            }
        } catch (err) {
            console.error('Profile update error:', err.message);
            toast.error(`Error: ${err.message}`, { position: 'top-center', autoClose: 5000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8 p-4 border rounded bg-gray-100">
            <h2 className="text-xl font-bold mb-4">Freelancer Profile Update</h2>
            <form onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full p-2 border rounded"
                        value={updateFormData.name}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Availability Start</label>
                    <input
                        type="datetime-local"
                        name="availabilityStart"
                        className="w-full p-2 border rounded"
                        value={updateFormData.availabilityStart}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Availability End</label>
                    <input
                        type="datetime-local"
                        name="availabilityEnd"
                        className="w-full p-2 border rounded"
                        value={updateFormData.availabilityEnd}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Skills</label>
                    <input
                        type="text"
                        name="skills"
                        className="w-full p-2 border rounded"
                        value={updateFormData.skills}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Hourly Rate</label>
                    <input
                        type="number"
                        name="hourlyRate"
                        className="w-full p-2 border rounded"
                        value={updateFormData.hourlyRate}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-purple-500 text-white rounded-lg py-2 px-4 w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <button
                    onClick={() => onToggleForm(false)}
                    className="text-purple-500"
                >
                    Go Back to Login
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default FreelancerUpdateForm;
