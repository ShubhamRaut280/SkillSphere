import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NotificationCard from "../Cards/NotificationCard";
import { collection, query, where, onSnapshot, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { toast } from "react-toastify";
import emailjs from 'emailjs-com';

const NotificationDrawer = ({ isOpen, toggleDrawer }) => {
  const [jobRequests, setJobRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const userId = localStorage.getItem("userId"); // This is still needed for the freelancer

  // Fetch user details from Firebase
  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const sendEmailToUser = async (userEmail, userName, job, newStatus) => {
    const status = newStatus === "accepted" ? "Accepted" : "Rejected";
    try {
      const emailContent = `
        Your job request regarding the following job has been ${status}:\n\n
        - Job Description: ${job.jobDescription}\n
        - Start Time: ${new Date(job.jobStartTime).toLocaleString()}\n
        - End Time: ${new Date(job.jobEndTime).toLocaleString()}\n
        - Address: ${job.address}\n

        - Freelancer: ${localStorage.getItem("name")}
               email: ${localStorage.getItem("email")}
        \n
        Thank you!\n
      `;

      await emailjs.send(
        "service_1g92j5z", // Replace with your EmailJS service ID
        "template_6r6lhkt", // Replace with your EmailJS template ID
        {
          to_name: userName,
          from_name: localStorage.getItem("name"),
          message: emailContent,
          to_email: userEmail,
        },
        "70NdbgtK4irv9cpnX" // Replace with your EmailJS user ID
      );

      toast.success(`Email sent to ${userEmail}`);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email.");
    }
  };

  // Fetch job requests and listen to real-time changes
  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "jobrequest"), where("freelancerId", "==", localStorage.getItem('userId')));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort requests by 'createdAt' field in descending order (newest first)
      const sortedRequests = requests.sort((a, b) => b.createdAt - a.createdAt);
      setJobRequests(sortedRequests);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userId]);

  // Update the status of the job request in Firebase and local state
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const requestDoc = doc(db, "jobrequest", requestId);
      const requestSnapshot = await getDoc(requestDoc);

      if (!requestSnapshot.exists()) {
        console.log("Job request not found.");
        return;
      }

      const job = requestSnapshot.data();
      const clientId = job.userId; // Assuming 'userId' refers to the client who made the request

      // Fetch user details of the client
      const userDoc = await getDoc(doc(db, "users", clientId));
      if (!userDoc.exists()) {
        console.log("User not found.");
        return;
      }

      const user = userDoc.data();
      const userName = user.name;
      const userEmail = user.email;

      // Send email to the client user
      if (userEmail) {
        sendEmailToUser(userEmail, userName, job, newStatus);
      }

      await updateDoc(requestDoc, { status: newStatus });

      // Optionally update local state (if needed, but real-time listener will handle this)
      setJobRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  return (
    <DrawerWrapper isOpen={isOpen}>
      <div className="drawer">
        <div className="header">
          <h2>Notifications</h2>
          <button className="close-btn" onClick={toggleDrawer}>
            ✕
          </button>
        </div>
        <div className="content">
          {loading ? (
            <p>Loading...</p>
          ) : jobRequests.length > 0 ? (
            <ul>
              {jobRequests.map((request) => (
                <li key={request.id}>
                  {console.log(`request data :${request.jobDescription} ${request.status}`)}
                  <NotificationCard
                    jobRequest={request}
                    onAccept={() => handleStatusUpdate(request.id, "accepted")}
                    onReject={() => handleStatusUpdate(request.id, "rejected")}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No job requests found.</p>
          )}
        </div>
      </div>
    </DrawerWrapper>
  );
};

const DrawerWrapper = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? "0" : "-50%")};
  width: 50%;
  height: 100%;
  background-color: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  z-index: 1000;

  .drawer {
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ddd;
    }

    .content {
      padding: 1rem;
      overflow-y: auto;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
`;

export default NotificationDrawer;
