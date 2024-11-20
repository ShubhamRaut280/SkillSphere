import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Ensure `auth` is imported for current user info
import ProfileCard from "./ProfileCard";
import LeftSidebar from "./LeftSidebar";
import Loader from "./Loader";

// Helper function to get unique skills from freelancers
const getUniqueSkills = (freelancers) => {
    const allSkills = freelancers
        .map((freelancer) => freelancer.skills?.split(",").map((skill) => skill.trim()))
        .flat();
    return [...new Set(allSkills)];
};

// Helper function to get unique locations from freelancers
const getUniqueLocations = (freelancers) => {
    const allLocations = freelancers.map((freelancer) => freelancer.location).filter(Boolean);
    return [...new Set(allLocations)];
};

// Helper function to get unique ratings from freelancers
const getUniqueRatings = (freelancers) => {
    const allRatings = freelancers.map((freelancer) => freelancer.rating).filter(Boolean);
    return [...new Set(allRatings)];
};

const HomePage = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSkills, setSelectedSkills] = useState([]); // State to store selected skills
    const [selectedLocation, setSelectedLocation] = useState(""); // Selected location filter
    const [selectedRating, setSelectedRating] = useState(""); // Selected rating filter
    const [filteredFreelancers, setFilteredFreelancers] = useState([]); // Filtered freelancers based on selected filters
    const [skillsList, setSkillsList] = useState([]); // List of unique skills
    const [locationList, setLocationList] = useState([]); // List of unique locations
    const [ratingList, setRatingList] = useState([]); // List of unique ratings
    const [currentUserId, setCurrentUserId] = useState(null); // Current user ID

    useEffect(() => {
        const fetchCurrentUser = () => {
            const user = auth.currentUser;
            if (user) {
                setCurrentUserId(user.uid);
            }
        };
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchFreelancers = async () => {
            try {
                const q = query(
                    collection(db, "users"),
                    where("role", "==", "freelance") // Fetch users with "freelance" role
                );
                const querySnapshot = await getDocs(q);
                const fetchedFreelancers = querySnapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .filter((freelancer) => freelancer.id !== currentUserId); // Exclude the current user

                setFreelancers(fetchedFreelancers);
                setSkillsList(getUniqueSkills(fetchedFreelancers)); // Extract unique skills
                setLocationList(getUniqueLocations(fetchedFreelancers)); // Extract unique locations
                setRatingList(getUniqueRatings(fetchedFreelancers)); // Extract unique ratings
                setFilteredFreelancers(fetchedFreelancers); // Initially show all freelancers
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

    // Handle filtering by skills
    const handleSkillFilter = (skill) => {
        setSelectedSkills((prevSelectedSkills) => {
            const updatedSkills = prevSelectedSkills.includes(skill)
                ? prevSelectedSkills.filter((selected) => selected !== skill)
                : [...prevSelectedSkills, skill];
            return updatedSkills;
        });
    };

    // Handle filtering by location
    const handleLocationFilter = (location) => {
        setSelectedLocation(location); // Set selected location
    };

    // Handle filtering by rating
    const handleRatingFilter = (rating) => {
        setSelectedRating(rating); // Set selected rating
    };

    // Update filtered freelancers when any filter changes
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
            const ratingThreshold = parseInt(selectedRating, 10); // Convert "rating+" to a numeric value
            filtered = filtered.filter((freelancer) => freelancer.rating >= ratingThreshold);
        }

        setFilteredFreelancers(filtered);
    }, [selectedSkills, selectedLocation, selectedRating, freelancers]);

    // Clear all filters
    const clearFilter = () => {
        setSelectedSkills([]);
        setSelectedLocation("");
        setSelectedRating("");
        setFilteredFreelancers(freelancers); // Reset to all freelancers
    };

    return (
        <div className="min-h-screen w-screen bg-white flex flex-col">
            <header className="bg-white shadow fixed top-0 left-0 w-full z-10">
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
                        <a
                            href="#"
                            className="hover:opacity-75 transition-opacity duration-300"
                        >
                            <img
                                src="https://placehold.co/40x40"
                                alt="Current logged in user"
                                className="rounded-full w-10 h-10"
                            />
                        </a>
                    </div>
                </div>
            </header>
            <div className="flex flex-grow mt-16">
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
                                <ProfileCard key={freelancer.id} freelancer={freelancer} />
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HomePage;
