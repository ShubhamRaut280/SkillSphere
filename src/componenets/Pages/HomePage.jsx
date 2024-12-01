import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import ProfileCard from "../ProfileCard";
import LeftSidebar from "../LeftSidebar";
import CircularProgress from '@mui/material/CircularProgress';
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



  const navigate = useNavigate();

  if (localStorage.getItem("role") === "freelance") {
    navigate("/dashboard");
  }


  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [skillsList, setSkillsList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [ratingList, setRatingList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userImg, setUserImg] = useState("https://placehold.co/40x40");




  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setCurrentUserId(localStorage.getItem("userId"));
      const userDocRef = doc(db, "users", localStorage.getItem("userId"));
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUserImg(userData.img);
      }

    };
    fetchCurrentUser();
  }, []);

  // Fetch freelancers
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const freelancersQuery = query(
          collection(db, "users"),
          where("role", "==", "freelance")
        );
        const querySnapshot = await getDocs(freelancersQuery);
        const freelancersData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((freelancer) => freelancer.id !== currentUserId);

        setFreelancers(freelancersData);
        setSkillsList(getUniqueSkills(freelancersData));
        setLocationList(getUniqueLocations(freelancersData));
        setRatingList(getUniqueRatings(freelancersData));
        setFilteredFreelancers(freelancersData);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) fetchFreelancers();
  }, [currentUserId]);

  // Filter freelancers
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

    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((freelancer) =>
        freelancer.name?.toLowerCase().includes(lowerCaseQuery) ||
        freelancer.bio?.toLowerCase().includes(lowerCaseQuery) ||
        freelancer.skills?.toLowerCase().includes(lowerCaseQuery)
      );
    }
    setFilteredFreelancers(filtered);
  }, [selectedSkills, selectedLocation, selectedRating, searchQuery, freelancers]);

  // Filter handlers
  const handleSkillFilter = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleLocationFilter = (location) => setSelectedLocation(location);
  const handleRatingFilter = (rating) => setSelectedRating(rating);

  // Search handler
  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  // Clear filters
  const clearFilter = () => {
    setSelectedSkills([]);
    setSelectedLocation("");
    setSelectedRating("");
    setSearchQuery("");
  };

  // Toggle drawer
  const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);

  // Navigate to profile
  const handleProfileClick = () => {
    navigate(localStorage.getItem("role") === "user" ? "/userprofile" : "/profile");
  };



  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <CircularProgress />
        </div>
      ) : (
        <div className="h-screen w-screen bg-white flex flex-col">
          <header className="bg-white shadow top-0 left-0 w-full z-10">
            <div className="container mx-auto py-4 flex justify-between items-center">
              <div className="text-2xl font-bold">Local Search</div>
              <div className="flex-grow mx-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search"
                  className="w-full px-4 py-2 border rounded-full"
                />
              </div>
              <div className="flex-shrink-0">
                <Link to={localStorage.getItem("role") === "user" ? "/userprofile" : "/profile"}>
                  <img
                    src={userImg}
                    alt="Current User"
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
              <div className="container mx-auto px-8 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredFreelancers.map((freelancer) => (
                  <ProfileCard
                    key={freelancer.id}
                    freelancer={freelancer}
                  />
                ))}
              </div>
            </main>
          </div>
          <NotificationDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
