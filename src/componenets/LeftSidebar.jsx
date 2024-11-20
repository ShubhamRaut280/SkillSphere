import React, { useState } from "react";
import CheckboxWithAnimation from "./CheckboxWithAnimation";
import ClearBtn from "./ClearBtn";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const LeftSidebar = ({
  skillsList,
  locationList,
  ratingList,
  selectedSkills,
  selectedLocation,
  selectedRating,
  handleSkillFilter,
  handleLocationFilter,
  handleRatingFilter,
  clearFilter,
}) => {
  const [checkedSkills, setCheckedSkills] = useState(selectedSkills);
  const [checkedLocations, setCheckedLocations] = useState(selectedLocation);
  const [checkedRatings, setCheckedRatings] = useState(selectedRating);

  // Set dropdown visibility to false by default
  const [isSkillsDivVisible, setSkillsDivVisible] = useState(false);
  const [isLocationDivVisible, setLocationDivVisible] = useState(false);
  const [isRatingDivVisible, setRatingDivVisible] = useState(false);

  // Toggle visibility of sections
  const toggleSkillsDiv = () => setSkillsDivVisible((prev) => !prev);
  const toggleLocationDiv = () => setLocationDivVisible((prev) => !prev);
  const toggleRatingDiv = () => setRatingDivVisible((prev) => !prev);

  const handleCheckboxChange = (skill) => {
    if (checkedSkills.includes(skill)) {
      setCheckedSkills(checkedSkills.filter((s) => s !== skill));
    } else {
      setCheckedSkills([...checkedSkills, skill]);
    }
    handleSkillFilter(skill);
  };

  const handleLocationChange = (location) => {
    if (checkedLocations.includes(location)) {
      setCheckedLocations(checkedLocations.filter((l) => l !== location));
    } else {
      setCheckedLocations([...checkedLocations, location]);
    }
    handleLocationFilter(location);
  };

  const handleRatingChange = (rating) => {
    if (checkedRatings.includes(rating)) {
      setCheckedRatings(checkedRatings.filter((r) => r !== rating));
    } else {
      setCheckedRatings([...checkedRatings, rating]);
    }
    handleRatingFilter(rating);
  };

  const handleClearFilter = () => {
    setCheckedSkills([]);
    setCheckedLocations([]);
    setCheckedRatings([]);
    clearFilter();
  };

  return (
    <div className="w-auto p-4 border-r bg-gray-100">
      {/* Clear Button on the left */}
      <ClearBtn onClick={handleClearFilter} />

      {/* Skills Filter */}
      <div
        className="SkillsTitleDiv flex justify-between items-center mt-2 mb-3 px-5 py-3 rounded-2xl bg-purple-200 cursor-pointer"
        onClick={toggleSkillsDiv}
      >
        <h3 className="text-lg px-6 py-3 font-semibold">Filter by Skills</h3>
        <div className="ml-2">
          {isSkillsDivVisible ? (
            <FaChevronUp size={18} />
          ) : (
            <FaChevronDown size={18} />
          )}
        </div>
      </div>

      {isSkillsDivVisible && (
        <div className="SkillsDiv space-y-2">
          {skillsList.map((skill, index) => (
            <label
              key={index}
              className={`flex items-center p-3 mb-2 rounded-lg border cursor-pointer transition-colors ${
                checkedSkills.includes(skill)
                  ? "bg-purple-300 border-purple-50"
                  : "bg-white border-gray-300"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleCheckboxChange(skill);
              }}
            >
              <CheckboxWithAnimation
                checked={checkedSkills.includes(skill)}
                onChange={() => handleCheckboxChange(skill)}
                className="mr-2"
              />
              <div className="label px-3">{skill}</div>
            </label>
          ))}
        </div>
      )}

      {/* Location Filter */}
      <div
        className="LocationTitleDiv flex justify-between items-center mt-2 mb-3 px-5 py-3 rounded-2xl bg-purple-200 cursor-pointer"
        onClick={toggleLocationDiv}
      >
        <h3 className="text-lg px-6 py-3 font-semibold">Filter by Location</h3>
        <div className="ml-2">
          {isLocationDivVisible ? (
            <FaChevronUp size={18} />
          ) : (
            <FaChevronDown size={18} />
          )}
        </div>
      </div>

      {isLocationDivVisible && (
        <div className="LocationDiv space-y-2">
          {locationList.map((location, index) => (
            <label
              key={index}
              className={`flex items-center p-3 mb-2 rounded-lg border cursor-pointer transition-colors ${
                checkedLocations.includes(location)
                  ? "bg-purple-300 border-purple-50"
                  : "bg-white border-gray-300"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleLocationChange(location);
              }}
            >
              <CheckboxWithAnimation
                checked={checkedLocations.includes(location)}
                onChange={() => handleLocationChange(location)}
                className="mr-2"
              />
              <div className="label px-3">{location}</div>
            </label>
          ))}
        </div>
      )}

      {/* Rating Filter */}
      <div
        className="RatingTitleDiv flex justify-between items-center mt-2 mb-3 px-5 py-3 rounded-2xl bg-purple-200 cursor-pointer"
        onClick={toggleRatingDiv}
      >
        <h3 className="text-lg px-6 py-3 font-semibold">Filter by Rating</h3>
        <div className="ml-2">
          {isRatingDivVisible ? (
            <FaChevronUp size={18} />
          ) : (
            <FaChevronDown size={18} />
          )}
        </div>
      </div>

      {isRatingDivVisible && (
        <div className="RatingDiv space-y-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <label
              key={rating}
              className={`flex items-center p-3 mb-2 rounded-lg border cursor-pointer transition-colors ${
                checkedRatings.includes(`${rating}+`)
                  ? "bg-purple-300 border-purple-50"
                  : "bg-white border-gray-300"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleRatingChange(`${rating}+`);
              }}
            >
              <CheckboxWithAnimation
                checked={checkedRatings.includes(`${rating}+`)}
                onChange={() => handleRatingChange(`${rating}+`)}
                className="mr-2"
              />
              <div className="label px-3">{rating}+</div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
