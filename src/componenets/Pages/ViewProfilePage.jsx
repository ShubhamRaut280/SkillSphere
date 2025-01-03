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
import { useNavigate, useParams } from "react-router-dom";
import ProjectCard from "../Cards/ProjectCard";
import ReviewsCard from "../Cards/ReviewsCard";

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
const ViewProfilePage = () => {
    const [hourlyRate, setHourlyRate] = useState("");  // Add state for hourly rate
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true);


    const { userId } = useParams(); 

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
                const userDocRef = doc(db, 'users',userId);
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
                    where("freelancerId", "==", userId)
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




    const handleBackClick = () => {
        navigate("/home"); // Navigate to the homepage
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
                       
                        </div>
                         {/* Bio and Skills Section */}
                    <div className="flex flex-col md:flex-row mb-4 gap-4">
                        <div className="flex-1 p-4 border rounded-lg relative">
                            <h2 className="text-xl font-bold mb-2">Bio</h2>
                            <p className="text-gray-700">{bio}</p>
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
                            
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No skills listed</span>
                                )}
                            </div>
                        
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
                                    role={'freelance'}
                                />
                            ))}
                        </div>
                    </div>

                     {/* Reviews History Section */}
                     <div className="border-t pt-4">
                        <h2 className="text-xl font-bold mb-2">Reviews History</h2>
                        <ReviewsCard freelancerId={userId} />

                    </div>

                    </div>

                   
            </div>
        )}
    </div>
    );
};

export default ViewProfilePage;
