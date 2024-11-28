import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faEdit,
    faEye,
    faCog,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

const ProfilePage = () => {
    const [showBioDialog, setShowBioDialog] = useState(false);
    const [showSkillsDialog, setShowSkillsDialog] = useState(false);
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

    const handleAddSkill = () => {
        if (newSkill.trim() !== "") {
            setSkills([...skills, newSkill]);
            setNewSkill("");
        }
    };

    const handleDeleteSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white min-h-screen mt-5 flex flex-col p-6 md:max-w-6xl mx-auto border rounded-lg">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="relative">
                    <img
                        src="https://placehold.co/100x100"
                        alt="Profile picture"
                        className="rounded-full w-20 h-20"
                    />
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="absolute bottom-0 left-0 bg-white p-1 text-green-500 rounded-full cursor-pointer"
                        onClick={() => alert("Update Profile Image")}
                    />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Shubham K.</h1>
                        <p className="text-gray-600">Pune, India – 11:35 pm local time</p>
                        <p className="text-gray-600 mt-2">Phone: +91 1234567890</p>
                        <p className="text-gray-600">Email: example@example.com</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="border border-green-500 text-green-500 px-4 py-2 rounded-lg">
                            <FontAwesomeIcon icon={faEye} /> See public view
                        </button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                            <FontAwesomeIcon icon={faCog} /> Profile settings
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
                                e.target.style.height = "auto"; // Reset height to recalculate
                                e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll height
                            }}
                            style={{ overflow: "hidden" }} // Prevent unnecessary scrollbars
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
        </div>
    );
};

export default ProfilePage;
