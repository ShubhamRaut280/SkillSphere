import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import emailjs from "emailjs-com";

const HireModal = ({ freelancer, onClose }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(""); // User email state
  const [jobStartTime, setJobStartTime] = useState("");
  const [jobEndTime, setJobEndTime] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchUserIdAndEmail = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email); // Set user email from Firebase auth
      } else {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          console.error("User not logged in or ID not found!");
        }
      }
    };
    fetchUserIdAndEmail();
  }, []);

  useEffect(() => emailjs.init("70NdbgtK4irv9cpnX"), []);


  const sendEmail = async (freelancerEmail, freelancerName) => {
    try {
      const emailContent = `
        Job Request Details:
  
        - Job Description: ${jobDescription}
        - Start Time: ${jobStartTime}
        - End Time: ${jobEndTime}
        - Address: ${address}

        
        From: ${userEmail}
            Name: ${localStorage.getItem('name')}
            Phone Number: ${localStorage.getItem('phone')}

      `;
  
      await emailjs.send(
        "service_1g92j5z", // Replace with your EmailJS service ID
        "template_3sjbiif", // Replace with your EmailJS template ID
        {
          to_name: freelancerName || "Freelancer",
          from_name: "Local Services Search Engine Management", // Your app or company name
          message: emailContent,
          to_email: freelancerEmail,
        },
        "70NdbgtK4irv9cpnX" // Replace with your EmailJS user ID
      );
      console.log(`Email sent to ${freelancerEmail}`)
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }
  
    try {
      const jobRequest = {
        userId,
        freelancerId: freelancer.id,
        jobDescription,
        jobStartTime,
        jobEndTime,
        address,
        status,
        createdAt: new Date(),
      };
  
      // Save the job request to Firestore
      await setDoc(doc(db, "jobrequest", userId), jobRequest);
  
      // Fetch freelancer email
      const freelancerDoc = await getDoc(doc(db, "users", freelancer.id));
      if (freelancerDoc.exists()) {
        const freelancerEmail = freelancerDoc.data().email;
        const freelancerName = freelancer.name || "Freelancer";
  
        // Send email directly with dynamic content
        await sendEmail(freelancerEmail, freelancerName);
  
        alert("Job request submitted");
        onClose(); // Close the modal
      } else {
        console.error("Freelancer email not found.");
      }
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
              onClick={onClose}
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
