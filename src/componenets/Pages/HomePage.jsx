import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import ProfileCard from "../ProfileCard";
import LeftSidebar from "../LeftSidebar";
import Loader from "../Loader";
import NotificationBtn from "../Buttons/NotificationBtn";
import NotificationDrawer from "../Modals/NotificationDrawer";
import { Link, useNavigate } from "react-router-dom";

// Helper functions to extract unique skills, locations, and ratings
const getUniqueSkills = (freelancers) => {
  const allSkills = freelancers
    .map((freelancer) => freelancer.skills?.split(",").map((skill) => skill.trim()))
    .flat();
  return [...new Set(allSkills)];
};

const getUniqueLocations = (freelancers) => {
  const allLocations = freelancers.map((freelancer) => freelancer.location).filter(Boolean);
  return [...new Set(allLocations)];
};

const getUniqueRatings = (freelancers) => {
  const allRatings = freelancers.map((freelancer) => freelancer.rating).filter(Boolean);
  return [...new Set(allRatings)];
};

const HomePage = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [ratingList, setRatingList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userImg, setUserImg] = useState("https://placehold.co/40x40")

  const navigate = useNavigate(); // Hook for programmatic navigation

  // Handle profile image click to navigate to profile page
  const handleProfileClick = () => {
    navigate('/profile');

  };

  // Fetch the current logged-in user's ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUserId(user.uid);
        const recDocRef = doc(db, "users", localStorage.getItem('userId'));
        const userSnap = await getDoc(recDocRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserImg(data.img)
        }

      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch freelancers and filter them based on the current user ID
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("role", "==", "freelance")
        );
        const querySnapshot = await getDocs(q);
        const fetchedFreelancers = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((freelancer) => freelancer.id !== currentUserId);

        setFreelancers(fetchedFreelancers);
        setSkillsList(getUniqueSkills(fetchedFreelancers));
        setLocationList(getUniqueLocations(fetchedFreelancers));
        setRatingList(getUniqueRatings(fetchedFreelancers));
        setFilteredFreelancers(fetchedFreelancers);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId !== null) {
      fetchFreelancers();
    }
  }, [currentUserId]);

  // Filter freelancers based on selected criteria (skills, location, rating)
  useEffect(() => {
    let filtered = freelancers;

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((freelancer) =>
        selectedSkills.every((skill) =>
          freelancer.skills?.split(",").map((s) => s.trim()).includes(skill)
        )
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter((freelancer) => freelancer.location === selectedLocation);
    }

    if (selectedRating) {
      const ratingThreshold = parseInt(selectedRating, 10);
      filtered = filtered.filter((freelancer) => freelancer.rating >= ratingThreshold);
    }

    setFilteredFreelancers(filtered);
  }, [selectedSkills, selectedLocation, selectedRating, freelancers]);

  // Handle selection of skills in the filter
  const handleSkillFilter = (skill) => {
    setSelectedSkills((prevSelectedSkills) => {
      const updatedSkills = prevSelectedSkills.includes(skill)
        ? prevSelectedSkills.filter((selected) => selected !== skill)
        : [...prevSelectedSkills, skill];
      return updatedSkills;
    });
  };

  // Handle location selection in the filter
  const handleLocationFilter = (location) => {
    setSelectedLocation(location);
  };

  // Handle rating selection in the filter
  const handleRatingFilter = (rating) => {
    setSelectedRating(rating);
  };

  // Clear all filters
  const clearFilter = () => {
    setSelectedSkills([]);
    setSelectedLocation("");
    setSelectedRating("");
    setFilteredFreelancers(freelancers);
  };

  // Toggle the notification drawer visibility
  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col">
      <header className="bg-white shadow top-0 left-0 w-full z-10">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">Local Search</div>
          <div className="flex-grow mx-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border rounded-full"
            />
          </div>
          <div className="flex-shrink-0">
           
              <Link to="/profile">
                <img
                  src={userImg}
                  alt="Current logged-in user"
                  className="rounded-full w-10 h-10"
                />
              </Link>
        
          </div>

          <div className="ms-5">
            {localStorage.getItem("role") !== "user" && (
              <NotificationBtn toggleDrawer={toggleDrawer} />
            )}
          </div>
        </div>
      </header>
      <div className="flex flex-grow">
        <LeftSidebar
          skillsList={skillsList}
          locationList={locationList}
          ratingList={ratingList}
          selectedSkills={selectedSkills}
          selectedLocation={selectedLocation}
          selectedRating={selectedRating}
          handleSkillFilter={handleSkillFilter}
          handleLocationFilter={handleLocationFilter}
          handleRatingFilter={handleRatingFilter}
          clearFilter={clearFilter}
        />
        <main className="flex-grow ml-10 overflow-y-auto">
          <div className="container mx-auto px-8 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 justify-start">
            {loading ? (
              <div className="grid place-items-center">
                <Loader />
              </div>
            ) : (
              filteredFreelancers.map((freelancer) => (
                <ProfileCard
                  key={freelancer.id}
                  freelancer={freelancer}
                  onProfileClick={handleProfileClick}
                />
              ))
            )}
          </div>
        </main>
      </div>

      <NotificationDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </div>
  );
};

export default HomePage;
