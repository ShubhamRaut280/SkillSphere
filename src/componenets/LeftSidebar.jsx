import React from "react";
import CheckboxWithAnimation from "./CheckboxWithAnimation";

const LeftSidebar = ({ skillsList, selectedSkills, handleSkillFilter, clearFilter }) => {
    return (
        <div className="w-1/4 p-4 border-r bg-gray-100">
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Filter by Skills</h3>
                <div className="space-y-2">
                    {skillsList.map((skill, index) => (
                        <label key={index} className="block">
                            <input
                                type="checkbox"
                                checked={selectedSkills.includes(skill)}
                                onChange={() => handleSkillFilter(skill)}
                                className="mr-2"
                            />
                            {skill}
                        </label>
                    ))}
                </div>
            </div>
            <button
                onClick={clearFilter}
                className="w-full py-2 bg-purple-600 text-white rounded-full mt-4"
            >
                Clear Filter
            </button>
            <CheckboxWithAnimation/>
        </div>
    );
};

export default LeftSidebar;
