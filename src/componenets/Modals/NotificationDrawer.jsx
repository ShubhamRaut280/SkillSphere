import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NotificationCard from "../Cards/NotificationCard";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const NotificationDrawer = ({ isOpen, toggleDrawer }) => {
  const [jobRequests, setJobRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchJobRequests = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const q = query(collection(db, "jobrequest"), where("freelancerId", "==", userId));
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobRequests(requests);
      } catch (error) {
        console.error("Error fetching job requests: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobRequests();
  }, [userId]);

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const requestRef = doc(db, "jobrequest", requestId);
      await updateDoc(requestRef, { status: newStatus });

      // Update the local state to reflect the change
      setJobRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status: newStatus } : request
        )
      );
      console.log(`Job request ${requestId} updated to status: ${newStatus}`);
    } catch (error) {
      console.error("Error updating job request status: ", error);
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
                    onAccept={() => handleUpdateStatus(request.id, "Accepted")}
                    onReject={() => handleUpdateStatus(request.id, "Rejected")}
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
