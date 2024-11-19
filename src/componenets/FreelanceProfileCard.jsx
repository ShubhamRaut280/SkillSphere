function FreelanceProfileCard() {
    return (
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-6">
            <div className="flex flex-col items-center">
                <img className="w-24 h-24 rounded-full" src="https://placehold.co/100x100" alt="Profile picture of a person" />
                <div className="text-gray-600 mt-2">$40/hr</div>
                <div className="mt-4 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Andriy S.</h2>
                    <p className="text-gray-500">Java Developer</p>
                </div>
                <div className="flex items-center mt-2">
                    <i className="fas fa-star text-green-500"></i>
                    <span className="ml-1 text-gray-800">5.0/5</span>
                    <span className="ml-1 text-gray-500">(10 jobs)</span>
                </div>
                <div className="flex items-center mt-2">
                    <i className="fas fa-trophy text-gray-500"></i>
                    <span className="ml-1 text-gray-800">Java</span>
                </div>
                <div className="mt-2">
                    <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full">Distributed Computing</span>
                </div>
                <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full">See more</button>
            </div>
        </div>
    );
}

export default FreelanceProfileCard;