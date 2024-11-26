import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Ensure your Firebase config is properly imported

const NotificationCard = ({ jobRequest, onAccept, onReject }) => {
  const {
    address,
    createdAt,
    jobDescription,
    jobEndTime,
    jobStartTime,
    status,
    userId,
    freelancerId,
  } = jobRequest;

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        } else {
          console.error("User not found for ID: ", userId);
        }
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <div className="block font-sans items-center rounded-2xl p-3 bg-purple-100 m-2">
      <p className="ml-2 mr-10 mt-1 items-center mb-2 w-auto h-auto font-bold">
        Job Request: {jobDescription}
      </p>
      <p className="ml-2">From: {userDetails?.name || "Loading..."}</p>
      <p className="ml-2">Email: {userDetails?.email || "Loading..."}</p>
      <p className="ml-2">Phone: {userDetails?.phoneNumber || "Loading..."}</p>
      <p className="ml-2">Address: {address}</p>
      <p className="ml-2">Start Time: {new Date(jobStartTime).toLocaleString()}</p>
      <p className="ml-2">End Time: {new Date(jobEndTime).toLocaleString()}</p>

      <div className="inline-flex space-x-2 mt-2">
        <button
          className="w-100 h-auto bg-green-500 px-4 py-3 rounded-3xl text-white font-semibold hover:bg-green-700"
          onClick={onAccept}
        >
          Accept
        </button>
        <button
          className="w-100 h-auto bg-red-500 px-3 py-3 rounded-3xl text-white font-semibold hover:bg-red-700"
          onClick={onReject}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
