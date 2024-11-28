import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faEdit,
    faEye,
    faCog,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";


import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const ProfilePage = () => {
    const [showBioDialog, setShowBioDialog] = useState(false);
    const [showSkillsDialog, setShowSkillsDialog] = useState(false);
    const [showEditDetailsDialog, setShowEditDetailsDialog] = useState(false); // Dialog state



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


    useEffect(() => {
        const fetchData = async () => {
            const userDocRef = doc(db, 'users', localStorage.getItem('userId'));
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                const userdata = userDocSnapshot.data()
                setName(userdata.name)
                setBio(userdata.bio)
                setEmail(userdata.email)
    
                const skillsArray = userdata.skills
                    ? userdata.skills.split(",").map((skill) => skill.trim())
                    : [];
                setSkills(skillsArray)
                setPhone(userdata.phoneNumber)
                setLocation(userdata.address)

                console.log(userdata)
            }
        }

        fetchData()
    })


    const handleAddSkill = () => {
        if (newSkill.trim() !== "") {
            setSkills([...skills, newSkill]);
            setNewSkill("");
        }
    };

    const handleDeleteSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const editDetails = () => {
        // You can perform validation or send updated details to the server here.
        console.log("Updated details:", { name, phone, location });
        setShowEditDetailsDialog(false); // Close the dialog after updating details
    };

    return (
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
                        className="absolute bottom-0 right-0 bg-white p-1 text-green-500 rounded-full cursor-pointer"
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
                        <h1 className="text-2xl font-bold">
                            {name}
                        </h1>
                        <p className="text-gray-600">
                            {location}
                        </p>
                        <p className="text-gray-600 mt-1">
                            Phone: {phone}
                        </p>

                        <p className="text-gray-600">Email: {email}</p>
                    </div>
                </div>
                <div className="ml-auto flex justify-center">
                    <button
                        className="bg-green-500 text-white px-6 py-2 rounded-lg"
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
                        className="absolute top-4 right-4 text-green-500 cursor-pointer"
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
                        className="absolute top-4 right-4 text-green-500 cursor-pointer"
                        onClick={() => setShowSkillsDialog(true)}
                    />
                </div>
            </div>

            {/* Hiring History Section */}
            <div className="border-t pt-4">
                <h2 className="text-xl font-bold mb-2">Hiring History</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="p-4 border rounded-lg">
                            <h3 className="text-lg font-bold mb-2">Project {i + 1}</h3>
                            <p className="text-gray-700">Description of project {i + 1}.</p>
                        </div>
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
                            onChange={(e) => setBio(e.target.value)}
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
                                className="bg-green-500 text-white px-4 py-2 rounded-lg"
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
                            className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
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
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => setShowEditDetailsDialog(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                onClick={editDetails}
                            >
                                Update Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
