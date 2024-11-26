import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NotificationCard from "../Cards/NotificationCard";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const NotificationDrawer = ({ isOpen, toggleDrawer }) => {
  const [jobRequests, setJobRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  // Fetch job requests and listen to real-time changes
  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "jobrequest"), where("freelancerId", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobRequests(requests);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userId]);

  // Update the status of the job request in Firebase and local state
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const requestDoc = doc(db, "jobrequest", requestId);
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
