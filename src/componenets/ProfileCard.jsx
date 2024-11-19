import React from 'react';

const ProfileCard = ({ freelancer }) => {
    return (
        <div className="border rounded-lg p-4 m-4 w-64 hover:shadow-lg transition-shadow duration-300">
            <img
                src={freelancer.image}
                alt={`Profile of ${freelancer.name}`}
                className="rounded-full w-24 h-24 mx-auto"
            />
            <div className="text-center mt-4">
                <div className="text-lg font-bold">{freelancer.name}</div>
                <div className="text-gray-600">{freelancer.title}</div>
                <div className="text-green-600 mt-2">{freelancer.rate}</div>
                <div className="text-gray-600 mt-2">
                    <i className="fas fa-star text-green-500"></i> {freelancer.rating} ({freelancer.jobs})
                </div>
                <div className="mt-2">
                    {freelancer.skills.map((skill) => (
                        <span
                            key={skill}
                            className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
                <button className="bg-green-600 text-white rounded-full px-4 py-2 mt-4 hover:bg-green-700 transition-colors duration-300">
                    See more
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;
