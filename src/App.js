import React, { useState } from 'react';

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-blue-600 shadow-md">
      <div className="text-2xl font-bold text-white">
        🗺️ YatrAI
      </div>
      <div className="flex gap-8 text-white font-medium">
        <span className="cursor-pointer hover:text-blue-200">Home</span>
        <span className="cursor-pointer hover:text-blue-200">Explore</span>
        <span className="cursor-pointer hover:text-blue-200">My Trips</span>
      </div>
      <button className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-blue-100">
        Login
      </button>
    </nav>
  );
}

function Footer() {
  return (
    <div className="bg-blue-600 text-white py-10 px-8 text-center">
      <div className="text-3xl font-bold mb-2">
        🗺️ YatrAI
      </div>
      <p className="text-blue-100 mb-4">
        Made with ❤️ for India
      </p>
      <div className="flex justify-center gap-8 text-blue-200 mb-6">
        <span className="cursor-pointer hover:text-white">Home</span>
        <span className="cursor-pointer hover:text-white">Explore</span>
        <span className="cursor-pointer hover:text-white">My Trips</span>
        <span className="cursor-pointer hover:text-white">Contact</span>
      </div>
      <p className="text-blue-300 text-sm">
        © 2024 YatrAI. All rights reserved.
      </p>
    </div>
  );
}

function Hero() {
  const [destination, setDestination] = useState('');
  return (
    <div className="bg-gradient-to-b from-blue-600 to-blue-400 text-white py-20 px-8 text-center">
      <h1 className="text-5xl font-bold mb-4">
        🇮🇳 Plan Your Perfect India Trip
      </h1>
      <p className="text-xl mb-10 text-blue-100">
        Enter a destination and let AI build your day by day itinerary
      </p>
      <div className="flex justify-center gap-4 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Where do you want to go? e.g. Goa, Rajasthan..."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="flex-1 px-6 py-4 rounded-full text-gray-800 text-lg outline-none"
        />
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold">
          Generate 🚀
        </button>
      </div>
      <div className="mt-8 flex justify-center gap-4 flex-wrap">
        <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-opacity-30">🏯 Rajasthan</span>
        <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-opacity-30">🌊 Goa</span>
        <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-opacity-30">🏔️ Manali</span>
        <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-opacity-30">🛕 Kerala</span>
        <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-opacity-30">🕌 Delhi</span>
      </div>
    </div>
  );
}

function DestinationCards() {
  const destinations = [
    { emoji: '🏯', name: 'Rajasthan', desc: 'Forts, palaces & desert', days: '4-5 days', color: 'bg-orange-100' },
    { emoji: '🌊', name: 'Goa', desc: 'Beaches, food & nightlife', days: '3-4 days', color: 'bg-blue-100' },
    { emoji: '🏔️', name: 'Manali', desc: 'Mountains & adventure', days: '5-6 days', color: 'bg-green-100' },
    { emoji: '🛕', name: 'Kerala', desc: 'Backwaters & nature', days: '4-5 days', color: 'bg-teal-100' },
    { emoji: '🕌', name: 'Delhi', desc: 'History & street food', days: '2-3 days', color: 'bg-red-100' },
    { emoji: '🌅', name: 'Varanasi', desc: 'Spirituality & culture', days: '2-3 days', color: 'bg-yellow-100' },
  ];

  return (
    <div className="py-16 px-8 bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Popular Destinations 🇮🇳
      </h2>
      <p className="text-center text-gray-500 mb-10">
        Explore the most loved places across India
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {destinations.map((dest) => (
          <div
            key={dest.name}
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className={`${dest.color} rounded-xl p-4 text-5xl text-center mb-4`}>
              {dest.emoji}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{dest.name}</h3>
            <p className="text-gray-500 text-sm mb-3">{dest.desc}</p>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-medium text-sm">📅 {dest.days}</span>
              <button className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-700">
                Plan Trip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <DestinationCards />
      <Footer />
    </div>
  );
}

export default App;