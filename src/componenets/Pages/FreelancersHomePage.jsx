import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import NotificationBtn from "../Buttons/NotificationBtn";
import NotificationDrawer from "../Modals/NotificationDrawer";
import ProfilePage from "./ProfilePage";

const FreelancersHomePage = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setCurrentUserId(localStorage.getItem("userId"));
      const userDocRef = doc(db, "users", localStorage.getItem("userId"));
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        // setUserImg(userData.img);
      }
    };
    fetchCurrentUser();
  }, []);

  // Toggle drawer
  const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);

  return (
    <div className="h-screen w-screen bg-white flex flex-col">
      <header className="bg-white shadow top-0 left-0 w-full z-10">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">Freelancer Dashboard</div>
          <div className="ms-5">
            {localStorage.getItem("role") !== "user" && (
              <NotificationBtn toggleDrawer={toggleDrawer} />
            )}
          </div>
        </div>
      </header>

      <div>
          <ProfilePage />
      </div>    

      <NotificationDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </div>
  );
};

export default FreelancersHomePage;
