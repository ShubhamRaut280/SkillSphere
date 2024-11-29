import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Ensure your Firebase config is properly imported

const NotificationCard = ({ jobRequest, onAccept, onReject }) => {
  const { address, jobDescription, jobStartTime, jobEndTime, status, userId } = jobRequest;

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
    <div className="block font-sans items-center rounded-2xl p-4 bg-purple-100 m-2">
      <p className="font-bold flex flex-col gap-3 mb-2">Job Request</p>

      <p className="mb-2">Description : {jobDescription}</p>

      <div className="flex flex-wrap">
        {/* Left Column */}
        <div className="flex-1 mr-4">
          <p className="mb-2">From: {userDetails?.name || "Loading..."}</p>
          <p className="mb-2">Email: {userDetails?.email || "Loading..."}</p>
          <p className="mb-2">Phone: {userDetails?.phoneNumber || "Loading..."}</p>
        </div>

        {/* Right Column */}
        <div className="flex-1">
          <p className="mb-2">Address: {address}</p>
          <p className="mb-2">Start Time: {new Date(jobStartTime).toLocaleString()}</p>
          <p className="mb-2">End Time: {new Date(jobEndTime).toLocaleString()}</p>
        </div>
      </div>

      {
        status === "pending" ?  (<p className="mb-2">Status : Not yet responded</p>)
        : status === "accepted" ?  (<p className="mb-2">Status : Accepted</p>)
        :  ( <p className="mb-2">Status : Rejected</p>)

      }

      {/* Status-based rendering */}
      {status !== 'pending' ? (
        <p className="mt-4 text-gray-500">You already responded to this request.</p>
      ) : (
        <div className="flex space-x-4 mt-4">
          <button
            className="w-32 bg-green-500 px-4 py-3 rounded-3xl text-white font-semibold hover:bg-green-700"
            onClick={onAccept}
          >
            Accept
          </button>
          <button
            className="w-32 bg-red-500 px-4 py-3 rounded-3xl text-white font-semibold hover:bg-red-700"
            onClick={onReject}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
