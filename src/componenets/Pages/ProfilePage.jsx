import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faEdit,
    faEye,
    faCog,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import CircularProgress from '@mui/material/CircularProgress'; // If using Material-UI
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, getFirestore, updateDoc, query, getDocs, collection, where } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import ProjectCard from "../Cards/ProjectCard";

const renderStars = (rating) => {
    const fullStars = Math.floor(rating);  // Full stars for the integer part
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;  // Half star if the decimal part is >= 0.5
    const emptyStars = 5 - fullStars - halfStar;  // Remaining empty stars to complete 5 stars

    return (
        <div className="flex items-center justify-center gap-1">
            {/* Full stars */}
            {[...Array(fullStars)].map((_, index) => (
                <svg key={index} xmlns="http://www.w3.org/2000/svg" fill="#a855f7" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-6.91-.58L12 2 8.91 8.66 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}

            {/* Half star */}
            {halfStar === 1 && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="url(#half)" viewBox="0 0 24 24" width="18" height="18">
                    <defs>
                        <linearGradient id="half" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="50%" stopColor="#a855f7" />  {/* Filled part */}
                            <stop offset="50%" stopColor="#d1d5db" />  {/* Empty part */}
                        </linearGradient>
                    </defs>
                    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-6.91-.58L12 2 8.91 8.66 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            )}

            {/* Empty stars */}
            {[...Array(emptyStars)].map((_, index) => (
                <svg key={index + fullStars + halfStar} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#a855f7" viewBox="0 0 24 24" width="16" height="16">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-6.91-.58L12 2 8.91 8.66 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
        </div>
    );
};
const ProfilePage = () => {
    const [showBioDialog, setShowBioDialog] = useState(false);
    const [showSkillsDialog, setShowSkillsDialog] = useState(false);
    const [showEditDetailsDialog, setShowEditDetailsDialog] = useState(false); // Dialog state
    const [hourlyRate, setHourlyRate] = useState("");  // Add state for hourly rate
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate(); // Initialize the navigate function


    const [bio, setBio] = useState(
        "I’m a developer experienced in building websites for small and medium-sized businesses."
    );
    const [skills, setSkills] = useState([
        "HTML and CSS3",
        "PHP",
        "jQuery",
        "WordPress",
        "SEO",
    ]);
    const [newSkill, setNewSkill] = useState("");
    const [profileImage, setProfileImage] = useState("https://placehold.co/100x100");
    const [name, setName] = useState("Shubham K.");
    const [phone, setPhone] = useState("+91 1234567890");
    const [location, setLocation] = useState("Pune, India");
    const [email, setEmail] = useState("");
    const [user, setUser] = useState({}); // User object
    const [rating, setRating] = useState(0.0);


    useEffect(() => {
        const fetchData = async () => {

            setLoading(true); // Set loading to true

            try {
                const userDocRef = doc(db, 'users', localStorage.getItem('userId'));
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const userdata = userDocSnapshot.data();

                    setUser(userdata);
                    setName(userdata.name || '');
                    setBio(userdata.bio || '');
                    setEmail(userdata.email || '');

                    const rating = parseFloat(userdata.rating) || 0;
                    setRating(rating);

                    const skillsArray = userdata.skills
                        ? userdata.skills.split(',').map((skill) => skill.trim())
                        : [];
                    setSkills(skillsArray);

                    setPhone(userdata.phoneNumber || '');
                    setLocation(userdata.address || '');
                    setHourlyRate(userdata.hourlyRate || 0);
                    setProfileImage(userdata.img || '');
                    console.log(userdata);
                } else {
                    console.log("No user document found");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }

            setLoading(false); // Set loading to true

        };

        const fetchHistory = async () => {
            setLoading(true); // Set loading to true
            try {
                const jobRequestCollection = collection(db, "jobrequest");
                const q = query(
                    jobRequestCollection,
                    where("freelancerId", "==", localStorage.getItem("userId"))
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const jobRequests = await Promise.all(
                        querySnapshot.docs.map(async (document) => {
                            const reqdata = document.data();
                            const recDocRef = doc(db, "users", reqdata.userId);
                            const userSnap = await getDoc(recDocRef);

                            if (userSnap.exists()) {
                                const tempdata = userSnap.data();

                                // Check if the current time is within the job's start and end times
                                const currentTime = new Date();
                                const jobStartTime = new Date(reqdata.jobStartTime);
                                const jobEndTime = new Date(reqdata.jobEndTime);

                                let jobStatus = reqdata.status || "Unknown";


                                if (jobStatus === 'accepted') {
                                    if (
                                        currentTime >= jobStartTime &&
                                        currentTime <= jobEndTime
                                    ) {
                                        jobStatus = "inProgress";
                                    }

                                    if (
                                        currentTime > jobEndTime
                                    ) {
                                        jobStatus = "completed";
                                    }
                                }

                                if (jobStatus === 'pending') {
                                    return null;
                                }

                                return {
                                    projectName: tempdata.name || "Unnamed Project",
                                    projectDescription:
                                        reqdata.jobDescription ||
                                        "No description provided",
                                    status: jobStatus,
                                    cost: reqdata.totalRevenue || 0,
                                };
                            } else {
                                return null;
                            }
                        })
                    );

                    // Filter out null values (in case a referenced user document is missing)
                    setJobs(jobRequests.filter((request) => request !== null));
                } else {
                    console.log("No job requests found for this freelancer.");
                }
            } catch (error) {
                console.error("Error fetching job history:", error);
            }

            setLoading(false); // Set loading to true

        };


        fetchData();
        fetchHistory();
    }, []); // Dependency array intentionally left empty to run once


    const handleAddSkill = async () => {
        if (newSkill.trim() !== "") {
            // Add the new skill to the state and update it immediately
            const updatedSkills = [...skills, newSkill];
            setSkills(updatedSkills);
            setNewSkill(""); // Clear the new skill input

            // Create a comma-separated string
            const tempskills = updatedSkills.join(',');

            try {
                const userDocRef = doc(db, "users", localStorage.getItem('userId'));
                await updateDoc(userDocRef, { 'skills': tempskills });
                console.log("Skills updated successfully.");
            } catch (error) {
                console.error("Error updating skills:", error);
            }
        }
    };

    const handleDeleteSkill = async (index) => {
        // Create a new skills array after removing the skill at the specified index
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills); // Update the state with the new skills array

        // Create a comma-separated string of the updated skills
        const tempskills = updatedSkills.join(',');

        try {
            const userDocRef = doc(db, "users", localStorage.getItem('userId'));
            await updateDoc(userDocRef, { 'skills': tempskills });
            console.log("Skills updated successfully.");
        } catch (error) {
            console.error("Error updating skills:", error);
        }
    };


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result.split(",")[1]; // Extracting only the Base64 data
                setProfileImage(`data:image/jpeg;base64,${base64String}`);
                console.log("Base64 String:", base64String); // Logging the Base64 string
                try {
                    const userDocRef = doc(db, "users", localStorage.getItem('userId'));

                    await updateDoc(userDocRef, { 'img': `data:image/jpeg;base64,${base64String}` });

                    console.log(`Image URL updated successfully.`);
                } catch (error) {
                    console.error("Error updating image URL:", error);
                }
            };
            reader.readAsDataURL(file);


        }
    };



    const handleBackClick = () => {
        navigate("/home"); // Navigate to the homepage
    };

    const handleBioUpdate = async (e) => {
        const bio = e.target.value
        setBio(bio)
        try {
            const userDocRef = doc(db, "users", localStorage.getItem('userId'));
            await updateDoc(userDocRef, { 'bio': bio });
            console.log("Bio updated successfully.");
        } catch (error) {
            console.error("Error updating bio:", error);
        }
    }

    const editDetails = async () => {
        // You can perform validation or send updated details to the server here.
        console.log("Updated details:", { name, phone, location, hourlyRate });
        try {
            const userDocRef = doc(db, "users", localStorage.getItem('userId'));

            await updateDoc(userDocRef, {
                'name': name,
                'phoneNumber': phone,
                'address': location,
                'hourlyRate': hourlyRate
            });

            console.log(`Details updated successfully.`);
        } catch (error) {
            console.error("Error updating details", error);
        }
        setShowEditDetailsDialog(false); // Close the dialog after updating details
    };



    return (<div>
        {loading ? (
            <div className="flex justify-center items-center min-h-screen">
                <CircularProgress />
            </div>
        ) : (
            <div>
                <button
                    className="flex items-center gap-2 text-white bg-purple-500 m-5 px-5 py-3 rounded-lg shadow hover:bg-purple-800 transition"
                    onClick={handleBackClick} // Replace with your back navigation logic
                >
                    <FontAwesomeIcon icon={faArrowLeft} />

                </button>
                <div className="bg-white min-h-screen mt-5 flex flex-col p-6 md:max-w-6xl mx-auto border rounded-lg">
                    {/* Header Section */}
                    <div className="flex items-center mb-4">
                        <div className="relative">
                            <img
                                src={profileImage}
                                alt="Profile picture"
                                className="rounded-full w-20 h-20"
                                onError={(e) => (e.target.src = "https://placehold.co/100x100")}
                            />
                            <FontAwesomeIcon
                                icon={faEdit}
                                className="absolute bottom-0 right-0 bg-white p-1 text-purple-500 rounded-full cursor-pointer"
                                onClick={() => document.getElementById("imageUpload").click()}
                            />
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div className="flex ms-10 justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center text-2xl font-bold gap-1">
                                        {name}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 font-medium text-lg">Address:</span>
                                    <div className="flex items-center gap-1">
                                        {location}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 font-medium text-lg">Phone:</span>
                                    <div className="flex items-center gap-1">
                                        {phone}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 font-medium text-lg">Email:</span>
                                    <div className="flex items-center gap-1">
                                        {email}
                                    </div>
                                </div>

                            </div>

                            <div className="ms-10">
                                {/* Hourly Rate Section */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-purple-100 text-purple-700 font-semibold py-1 px-3 rounded-lg text-lg shadow-sm">
                                        ${hourlyRate}/hr
                                    </span>
                                    <span className="text-gray-600 font-medium">Hourly Rate</span>
                                </div>

                                {/* Ratings Section */}
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 font-medium text-lg">Rating:</span>
                                    <div className="flex items-center gap-1">
                                        {renderStars(rating)}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="ml-auto flex justify-center">
                            <button
                                className="bg-purple-500 text-white px-6 py-2 rounded-lg"
                                onClick={() => setShowEditDetailsDialog(true)} // Open the edit details dialog
                            >
                                Update Details
                            </button>
                        </div>
                    </div>

                    {/* Bio and Skills Section */}
                    <div className="flex flex-col md:flex-row mb-4 gap-4">
                        <div className="flex-1 p-4 border rounded-lg relative">
                            <h2 className="text-xl font-bold mb-2">Bio</h2>
                            <p className="text-gray-700">{bio}</p>
                            <FontAwesomeIcon
                                icon={faEdit}
                                className="absolute top-4 right-4 text-purple-500 cursor-pointer"
                                onClick={() => setShowBioDialog(true)}
                            />
                        </div>
                        <div className="flex-1 p-4 border rounded-lg relative">
                            <h2 className="text-xl font-bold mb-2">Skills</h2>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {skills.length > 0 ? (
                                    skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded flex items-center"
                                        >
                                            {skill}
                                            <button
                                                className="ml-2 text-red-500 hover:text-red-700"
                                                onClick={() => handleDeleteSkill(index)}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No skills listed</span>
                                )}
                            </div>
                            <FontAwesomeIcon
                                icon={faEdit}
                                className="absolute top-4 right-4 text-purple-500 cursor-pointer"
                                onClick={() => setShowSkillsDialog(true)}
                            />
                        </div>
                    </div>

                    {/* Hiring History Section */}
                    <div className="border-t pt-4">
                        <h2 className="text-xl font-bold mb-2">Work History</h2>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((project, index) => (
                                <ProjectCard
                                    key={index}
                                    projectName={project.projectName}
                                    projectDescription={project.projectDescription}
                                    status={project.status}
                                    cost={project.cost}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Dialog for Bio */}
                    {showBioDialog && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                                <h2 className="text-xl font-bold mb-4">Edit Bio</h2>
                                <textarea
                                    className="w-full p-2 border rounded-lg mb-4"
                                    value={bio}
                                    onChange={handleBioUpdate}
                                    onInput={(e) => {
                                        e.target.style.height = "auto";
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                    style={{ overflow: "hidden" }}
                                ></textarea>

                                <div className="flex justify-end gap-2">
                                    <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                        onClick={() => setShowBioDialog(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                                        onClick={() => setShowBioDialog(false)}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dialog for Skills */}
                    {showSkillsDialog && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                                <h2 className="text-xl font-bold mb-4">Edit Skills</h2>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg mb-4"
                                    value={newSkill}
                                    placeholder="Add new skill"
                                    onChange={(e) => setNewSkill(e.target.value)}
                                />
                                <button
                                    className="bg-purple-500 text-white px-4 py-2 rounded-lg mb-4"
                                    onClick={handleAddSkill}
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Add Skill
                                </button>
                                <div className="flex justify-end gap-2">
                                    <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                        onClick={() => setShowSkillsDialog(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dialog for Editing Details */}
                    {showEditDetailsDialog && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                                <h2 className="text-xl font-bold mb-4">Edit Details</h2>
                                <div className="mb-4">
                                    <label className="block mb-2">Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-lg"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Phone</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-lg"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">Location</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-lg"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="hourlyRate" className="block text-sm font-medium">Hourly Rate</label>
                                    <input
                                        type="number"
                                        id="hourlyRate"
                                        className="w-full p-2 border rounded"
                                        value={hourlyRate}
                                        onChange={(e) => setHourlyRate(e.target.value)}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                        onClick={() => setShowEditDetailsDialog(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                                        onClick={editDetails}
                                    >
                                        Update Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
    );
};

export default ProfilePage;
