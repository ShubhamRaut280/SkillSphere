import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faHourglassHalf, faThumbsUp, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const ProjectCard = ({ projectName, projectDescription, hiredBy, status, cost }) => {
    // Map status to corresponding icons and styles
    const statusDetails = {
        completed: { icon: faCheckCircle, color: "text-green-500", label: "Completed" },
        inProgress: { icon: faHourglassHalf, color: "text-yellow-500", label: "In Progress" },
        accepted: { icon: faThumbsUp, color: "text-blue-500", label: "Accepted" },
        rejected: { icon: faTimesCircle, color: "text-red-500", label: "Rejected" },
    };

    const currentStatus = statusDetails[status] || {};

    return (
        <div className="p-6 border rounded-[30px] shadow-lg bg-white hover:shadow-xl transition">
            {/* Project Title */}
            <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{projectName}</h3>
                <span className="bg-purple-100 text-purple-700 font-semibold py-1 px-3 rounded-lg text-lg shadow-sm">
                    ${cost}
                </span>
            </div>

            {/* Project Description */}
            <p className="text-gray-600 mb-4">{projectDescription}</p>

            {/* Hired By Section */}
            <div className="flex items-center mb-4">
                <span className="text-gray-500 font-medium mr-2">Hired By:</span>
                <span className="text-gray-800 font-semibold">{hiredBy}</span>
            </div>

            {/* Status Section */}
            <div className="flex items-center">
                <span className="text-gray-500 font-medium mr-2">Status:</span>
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={currentStatus.icon} className={`${currentStatus.color} text-lg`} />
                    <span className="text-gray-800 font-medium">{currentStatus.label}</span>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
