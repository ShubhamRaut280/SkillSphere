import React, { useState } from 'react';
import CheckboxWithAnimation from './CheckboxWithAnimation';
import ClearBtn from './ClearBtn';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importing chevron icons for dropdown

const LeftSidebar = ({ skillsList, selectedSkills, handleSkillFilter, clearFilter }) => {
    const [checkedSkills, setCheckedSkills] = useState(selectedSkills);
    const [isSkillsDivVisible, setSkillsDivVisible] = useState(true);

    // Toggle visibility of the SkillsDiv
    const toggleSkillsDiv = () => {
        setSkillsDivVisible((prev) => !prev);
    };
    const handleCheckboxChange = (skill) => {
        if (checkedSkills.includes(skill)) {
            setCheckedSkills(checkedSkills.filter(s => s !== skill)); // Uncheck the box
        } else {
            setCheckedSkills([...checkedSkills, skill]); // Check the box
        }
        handleSkillFilter(skill); // Call parent handler to update skill filter
    };

    // Handle the clear filter action
    const handleClearFilter = () => {
        console.log('Clear Filter triggered'); // Log to verify the function is being called
        setCheckedSkills([]); // Reset checked skills state
        clearFilter(); // Call the parent clearFilter function
    };

    return (
        <div className="w-auto p-4 border-r bg-gray-100">
            {/* Skills Title Div */}
            <div
                className="SkillsTitleDiv flex justify-between items-center mt-2 mb-3 px-5 py-3 rounded-2xl bg-purple-200 cursor-pointer"
                onClick={toggleSkillsDiv}
            >
                {/* Clear Button on the left */}
                <ClearBtn onClick={handleClearFilter} /> {/* Pass handleClearFilter to ClearBtn */}
                
                {/* Skills Title */}
                <h3 className="text-lg px-6 py-3 font-semibold">Filter by Skills</h3>

                {/* Dropdown arrow on the right */}
                <div className="ml-2">
                    {isSkillsDivVisible ? (
                        <FaChevronUp size={18} />
                    ) : (
                        <FaChevronDown size={18} />
                    )}
                </div>
            </div>

            {/* Skills Div - Conditionally rendered */}
            {isSkillsDivVisible && (
                <div className="SkillsDiv space-y-2">
                    {skillsList.map((skill, index) => (
                        <label
                            key={index}
                            className={`flex items-center p-3 mb-2 rounded-lg border cursor-pointer transition-colors 
                  ${checkedSkills.includes(skill) ? '' : 'bg-white border-gray-300'}`}
                            onClick={(e) => {
                                e.preventDefault(); // Prevent label's default behavior (which might interfere with the checkbox)
                                handleCheckboxChange(skill); // Toggle checkbox when label is clicked
                            }}
                        >
                            <CheckboxWithAnimation
                                checked={checkedSkills.includes(skill)}
                                onChange={() => handleCheckboxChange(skill)} // Keep the onChange for checkbox component as well
                                className="mr-2"
                            />
                            <div className="label px-3">{skill}</div>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeftSidebar;
