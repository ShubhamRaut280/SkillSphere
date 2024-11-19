import React from "react";

const ProfileCard = ({ freelancer}) => {
    console.log(`id is ${freelancer.id}`)
    const skillsArray = freelancer.skills
        ? freelancer.skills.split(",").map((skill) => skill.trim())
        : []; // Fallback in case skills are undefined or empty

    return (
        <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <img
                src="https://placehold.co/100x100"
                alt={freelancer.name}
                className="w-16 h-16 rounded-full mb-4 mx-auto"
            />
            <h2 className="text-lg font-bold text-center">{freelancer.name}</h2>
            <p className="text-center text-gray-600">{freelancer.bio}</p>
            <p className="text-center text-gray-800 font-semibold">
                ${freelancer.hourlyRate}/hr
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
                {skillsArray.length > 0 ? (
                    skillsArray.map((skill, index) => (
                        <span
                            key={index}
                            className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded"
                        >
                            {skill}
                        </span>
                    ))
                ) : (
                    <span className="text-gray-500 text-sm">No skills listed</span>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;
