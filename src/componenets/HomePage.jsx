import React from 'react';
import ProfileCard from './ProfileCard';
import LeftSidebar from './LeftSidebar';

const HomePage = () => {
  const freelancers = [
    {
      name: "Yannick G.",
      title: "Java Developer",
      rate: "$100/hr",
      rating: "5.0/5",
      jobs: "6 jobs",
      skills: ["Java", "PostgreSQL Programming"],
      image: "https://placehold.co/100x100",
    },
    {
      name: "Dawn M.",
      title: "Java Developer",
      rate: "$105/hr",
      rating: "4.7/5",
      jobs: "731 jobs",
      skills: ["Java", "CSS", "HTML", "Content Management Systems"],
      image: "https://placehold.co/100x100",
    },
    {
      name: "Andriy S.",
      title: "Java Developer",
      rate: "$40/hr",
      rating: "5.0/5",
      jobs: "10 jobs",
      skills: ["Java", "Distributed Computing"],
      image: "https://placehold.co/100x100",
    },
    {
      name: "Turgay U.",
      title: "Java Developer",
      rate: "$50/hr",
      rating: "5.0/5",
      jobs: "58 jobs",
      skills: ["Java", "Android App", "Android Studio"],
      image: "https://placehold.co/100x100",
    },
    {
      name: "Turgay U.",
      title: "Java Developer",
      rate: "$50/hr",
      rating: "5.0/5",
      jobs: "58 jobs",
      skills: ["Java", "Android App", "Android Studio"],
      image: "https://placehold.co/100x100",
    },
  ];

  return (
    <div className="relative min-h-screen w-screen bg-white flex">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-10">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">Local Search</div>
          <div className="flex-grow mx-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border rounded-full"
            />
          </div>
          <div className="flex-shrink-0">
            <a
              href="#"
              className="hover:opacity-75 transition-opacity duration-300"
            >
              <img
                src="https://placehold.co/40x40"
                alt="Current logged in user"
                className="rounded-full w-10 h-10"
              />
            </a>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-100 w-64 overflow-y-auto">
        <LeftSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 mt-[4rem] overflow-y-auto">
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {freelancers.map((freelancer, index) => (
            <ProfileCard key={index} freelancer={freelancer} />
          ))}
        </div>
      </main>

    </div>
  );
};

export default HomePage;
