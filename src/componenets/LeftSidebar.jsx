import React from 'react';

const LeftSidebar = () => {
    return (
        <aside className="w-64 bg-gray-100 p-4">
            <nav className="space-y-4">
                <a
                    href="#"
                    className="block text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                    Development & IT
                </a>
                <a
                    href="#"
                    className="block text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                    AI Services
                </a>
                <a
                    href="#"
                    className="block text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                    Design & Creative
                </a>
                <a
                    href="#"
                    className="block text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                    Sales & Marketing
                </a>
                <a
                    href="#"
                    className="block text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                    Admin & Customer Support
                </a>
                <a
                    href="#"
                    className="block text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                    More
                </a>
            </nav>
        </aside>
    );
};

export default LeftSidebar;
