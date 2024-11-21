import React, { useState } from "react";
import HireButton from "./HireButton";
import HireModal from "./HireModal";
// Helper function to render stars based on the rating
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-6.91-.58L12 2 8.91 8.66 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
    </div>
  );
};

const ProfileCard = ({ freelancer }) => {
  console.log(`id is ${freelancer.id}`);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHireClick = () => {
    setIsModalOpen(true); // Open modal when the Hire button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
  };
  const skillsArray = freelancer.skills
    ? freelancer.skills.split(",").map((skill) => skill.trim())
    : []; // Fallback in case skills are undefined or empty

  const rating = parseFloat(freelancer.rating) || 0;  // Ensure rating is a number
  const reviewsCount = freelancer.reviews || 0; // Number of reviews

  return (
    <div className="border cursor-pointer hover:bg-purple-50 rounded-[20px] px-7 py-8 shadow hover:shadow-lg transition">
      <img
        src="https://placehold.co/100x100"
        alt={freelancer.name}
        className="w-16 h-16 rounded-full mb-4 mx-auto"
      />
      <h2 className="text-lg font-bold text-center">{freelancer.name}</h2>
      <p className="text-center text-gray-600">
        {freelancer.bio?.split(" ").slice(0, 5).join(" ")}{freelancer.bio?.split(" ").length > 5 && " ..."}
      </p>  
            <p className="text-center text-gray-800 font-semibold">
        ${freelancer.hourlyRate}/hr
      </p>
      
      {/* Render the stars based on the freelancer's rating */}
      <div className="text-center mt-2">
        {renderStars(rating)}
      </div>

      {/* Render the number of reviews */}
      <div className="text-center text-gray-600 mt-1">
        {reviewsCount} {reviewsCount === 1 ? "review" : "reviews"}
      </div>

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

      <div className="hire flex flex-wrap justify-center px-5 pt-8">
        {/* Pass the handleHireClick function to the HireButton */}
        <HireButton onClick={handleHireClick} />
      </div>

      {/* Modal to show job request form */}
      {isModalOpen && <HireModal freelancer={freelancer} onClose={handleCloseModal} />}
    </div>
  );
};

export default ProfileCard;
