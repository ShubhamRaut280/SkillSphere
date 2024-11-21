import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const HireModal = ({ freelancer, onClose }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState("Pending"); // Initial status is "Pending"
  const [userId, setUserId] = useState(null); // Dynamically fetch user ID
  const [jobStartTime, setJobStartTime] = useState(""); // For job start time
  const [jobEndTime, setJobEndTime] = useState(""); // For job end time
  const [address, setAddress] = useState(""); // For job address

  useEffect(() => {
    // Fetch user ID from Firebase Auth or Local Storage
    const fetchUserId = () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
      } else {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          console.error("User not logged in or ID not found!");
        }
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    try {
      // Save the job request document with the user ID as the document ID
      await setDoc(doc(db, "jobrequest", userId), {
        userId,
        freelancerId: freelancer.id,
        jobDescription,
        jobStartTime,
        jobEndTime,
        address,
        status,
        createdAt: new Date(),
      });
      alert("Job request submitted successfully!");
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error submitting job request: ", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-center mb-4">Job Details</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Describe the job you want to hire for"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            className="w-full h-24 p-3 border border-gray-300 rounded-lg mb-4"
          />
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Job Start Time</label>
            <input
              type="datetime-local"
              value={jobStartTime}
              onChange={(e) => setJobStartTime(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Job End Time</label>
            <input
              type="datetime-local"
              value={jobEndTime}
              onChange={(e) => setJobEndTime(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Address</label>
            <textarea
              placeholder="Enter job address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Submit Job Request
            </button>
            <button
              type="button"
              onClick={onClose} // Close the modal without submitting
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HireModal;
