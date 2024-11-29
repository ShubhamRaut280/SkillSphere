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

const UserProfilePage = () => {
    const [showBioDialog, setShowBioDialog] = useState(false);
    const [showEditDetailsDialog, setShowEditDetailsDialog] = useState(false); // Dialog state
    const [jobs, setJobs] = useState([])

    const navigate = useNavigate(); // Initialize the navigate function
    const [loading, setLoading] = useState(true);


    const [bio, setBio] = useState(
        ''
    );
    const [profileImage, setProfileImage] = useState("https://placehold.co/100x100");
    const [name, setName] = useState("Shubham K.");
    const [phone, setPhone] = useState("+91 1234567890");
    const [location, setLocation] = useState("Pune, India");
    const [email, setEmail] = useState("");
    const [user, setUser] = useState({}); // User object


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


                    setPhone(userdata.phoneNumber || '');
                    setLocation(userdata.address || '');
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
                    where("userId", "==", localStorage.getItem("userId"))
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const jobRequests = await Promise.all(
                        querySnapshot.docs.map(async (document) => {
                            const reqdata = document.data();
                            const recDocRef = doc(db, "users", reqdata.freelancerId);
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
        console.log("Updated details:", { name, phone, location });
        try {
            const userDocRef = doc(db, "users", localStorage.getItem('userId'));

            await updateDoc(userDocRef, {
                'name': name,
                'phoneNumber': phone,
                'address': location,
            });

            console.log(`Details updated successfully.`);
        } catch (error) {
            console.error("Error updating details", error);
        }
        setShowEditDetailsDialog(false); // Close the dialog after updating details
    };

    const handleLogout = () =>{
        console.log("preseing   ")
        setLoading(true)
        auth.signOut()
        .then(() => {
            setLoading(false)
          navigate('/');
          console.log('Signed Out');
          localStorage.clear();

        })
        .catch((error) => {
            setLoading(false)
          console.log(error)
          alert("Unable to logut, please try again");
        });
    }



    return (
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
                    <div className="flex ms-10 w-full justify-between items-center">
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
                    <div className="ml-auto  grid grid-col-1 gap-4 justify-end">
                    <button
                            className="bg-purple-500 hover:bg-purple-400 font-semibold text-white px-6 py-2 rounded-lg"
                            onClick={() => setShowEditDetailsDialog(true)} // Open the edit details dialog
                        >
                            Update Details
                        </button>

                        <button
                            className="bg-red-500 hover:bg-red-400 font-semibold text-white px-6 py-2 rounded-lg"
                            onClick={handleLogout} // Open the edit details dialog
                        >
                            Logout
                        </button>
                    </div>
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
            </div>

            {/* Hiring History Section */}
            <div className="border-t pt-4">
                <h2 className="text-xl font-bold mb-2">Hiring History</h2>
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
        </div >
    );
};

export default UserProfilePage;
