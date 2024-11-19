import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
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

const HomePage = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSkills, setSelectedSkills] = useState([]); // State to store selected skills
    const [filteredFreelancers, setFilteredFreelancers] = useState([]); // Filtered freelancers based on selected skills
    const [skillsList, setSkillsList] = useState([]); // List of unique skills

    useEffect(() => {
        const fetchFreelancers = async () => {
            try {
                const q = query(
                    collection(db, "users"),
                    where("role", "==", "freelance") // Fetch users with "freelance" role
                );
                const querySnapshot = await getDocs(q);

                const fetchedFreelancers = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFreelancers(fetchedFreelancers);
                setSkillsList(getUniqueSkills(fetchedFreelancers)); // Extract unique skills
                setFilteredFreelancers(fetchedFreelancers); // Initially show all freelancers
            } catch (error) {
                console.error("Error fetching freelancers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFreelancers();
    }, []);

    // Function to filter freelancers based on selected skills
    const handleSkillFilter = (skill) => {
        setSelectedSkills((prevSelectedSkills) => {
            const updatedSkills = prevSelectedSkills.includes(skill)
                ? prevSelectedSkills.filter((selected) => selected !== skill) // Deselect skill
                : [...prevSelectedSkills, skill]; // Add skill to the selected list
            return updatedSkills;
        });
    };

    // Update the filtered freelancers when the selected skills change
    useEffect(() => {
        if (selectedSkills.length === 0) {
            setFilteredFreelancers(freelancers); // Show all freelancers if no skill is selected
        } else {
            const filtered = freelancers.filter((freelancer) =>
                selectedSkills.every((skill) =>
                    freelancer.skills?.split(",").map((s) => s.trim()).includes(skill)
                )
            );
            setFilteredFreelancers(filtered);
        }
    }, [selectedSkills, freelancers]);

    // Clear the selected skills filter
    const clearFilter = () => {
        setSelectedSkills([]);
        setFilteredFreelancers(freelancers); // Show all freelancers
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
                    selectedSkills={selectedSkills}
                    handleSkillFilter={handleSkillFilter}
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
