import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faHourglassHalf, faThumbsUp, faTimesCircle, faStar } from "@fortawesome/free-solid-svg-icons";

const ProjectCard = ({ projectName, projectDescription, status, cost, role }) => {
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0); // Hover state for stars
    const [comment, setComment] = useState("");

    // Map status to corresponding icons and styles
    const statusDetails = {
        completed: { icon: faCheckCircle, color: "text-green-500", label: "Completed" },
        inProgress: { icon: faHourglassHalf, color: "text-yellow-500", label: "In Progress" },
        accepted: { icon: faThumbsUp, color: "text-blue-500", label: "Accepted" },
        rejected: { icon: faTimesCircle, color: "text-red-500", label: "Rejected" },
    };

    const currentStatus = statusDetails[status] || {};

    const handleRatingSubmit = () => {
        console.log("Rating submitted:", { rating, comment });
        setShowRatingModal(false);
        setRating(0);
        setComment("");
    };

    return (
        <div className="p-6 border rounded-[30px] shadow-lg bg-white hover:shadow-xl transition relative">
            {/* Project Title */}
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{projectName}</h3>
                <span className="bg-purple-100 text-purple-700 font-semibold py-1 px-3 rounded-lg text-lg shadow-sm">
                    ${cost}
                </span>
            </div>

            {/* Project Description */}
            <p className="text-gray-600 mb-4">{projectDescription}</p>

            {/* Status Section */}
            <div className="flex items-center">
                <span className="text-gray-500 font-medium mr-2">Status:</span>
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={currentStatus.icon} className={`${currentStatus.color} text-lg`} />
                    <span className="text-gray-800 font-medium">{currentStatus.label}</span>
                </div>
            </div>

            {/* Rate Experience Button - Show only if role is 'user' and status is 'completed' */}
            {role === "user" && status === "completed" && (
                <div className="absolute bottom-4 right-4 flex items-center group">
                    {/* Star Icon */}
                    <button
                        onClick={() => setShowRatingModal(true)}
                        className="text-yellow-400 hover:text-yellow-500 transition text-xl p-1"
                        aria-label="Rate Experience"
                    >
                        <FontAwesomeIcon icon={faStar} />
                    </button>

                    {/* Text - Only visible on hover */}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-800 bg-gray-100 rounded-lg py-1 px-2 shadow-md text-sm font-medium absolute right-8 bottom-1/2 translate-y-1/2">
                        Rate Experience
                    </span>
                </div>
            )}


            {/* Rating Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Rate Your Experience</h2>

                        {/* Star Rating */}
                        <div className="flex justify-center mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FontAwesomeIcon
                                    key={star}
                                    icon={faStar}
                                    className={`text-2xl cursor-pointer transition ${star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>

                        {/* Comment Box */}
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Leave a comment..."
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        ></textarea>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowRatingModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRatingSubmit}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
