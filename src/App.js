import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

function Navbar({ user, onLogin, onLogout, onShowTrips }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="flex justify-between items-center px-4 py-4">
        <div className="text-xl font-bold text-white">🗺️ YatrAI</div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white md:hidden text-2xl"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <div className="hidden md:flex gap-8 text-white font-medium">
          <span className="cursor-pointer hover:text-blue-200">Home</span>
          <span className="cursor-pointer hover:text-blue-200">Explore</span>
          {user && (
            <span onClick={onShowTrips} className="cursor-pointer hover:text-blue-200">
              My Trips
            </span>
          )}
        </div>
        {user ? (
          <div className="hidden md:flex items-center gap-4">
            <img src={user.photoURL} alt="profile" className="w-8 h-8 rounded-full" />
            <span className="text-white text-sm">{user.displayName}</span>
            <button onClick={onLogout} className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 text-sm">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={onLogin} className="hidden md:flex bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-blue-100 items-center gap-2">
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-4 flex flex-col gap-4">
          <span className="text-white cursor-pointer hover:text-blue-200">Home</span>
          <span className="text-white cursor-pointer hover:text-blue-200">Explore</span>
          {user && (
            <span onClick={() => { onShowTrips(); setMenuOpen(false); }} className="text-white cursor-pointer hover:text-blue-200">
              My Trips
            </span>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <img src={user.photoURL} alt="profile" className="w-8 h-8 rounded-full" />
              <span className="text-white text-sm">{user.displayName}</span>
              <button onClick={onLogout} className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => { onLogin(); setMenuOpen(false); }} className="bg-white text-blue-600 px-6 py-2 rounded-full w-full">
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

function Hero({ onGenerate }) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState('3');

  const handlePillClick = (name) => {
    setDestination(name);
    onGenerate(name, days);
  };

  return (
  <div className="bg-gradient-to-b from-blue-600 to-blue-400 text-white py-16 px-4 text-center">
    <h1 className="text-3xl md:text-5xl font-bold mb-4">Plan Your Perfect India Trip</h1>
    <p className="text-lg md:text-xl mb-10 text-blue-100">Enter a destination and let AI build your itinerary</p>
    <div className="flex flex-col md:flex-row justify-center gap-3 max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Where do you want to go? e.g. Goa..."
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="flex-1 px-6 py-4 rounded-full text-gray-800 text-lg outline-none"
      />
      <select
        value={days}
        onChange={(e) => setDays(e.target.value)}
        className="px-4 py-4 rounded-full text-gray-800 text-lg outline-none"
      >
        <option value="1">1 Day</option>
        <option value="2">2 Days</option>
        <option value="3">3 Days</option>
        <option value="4">4 Days</option>
        <option value="5">5 Days</option>
      </select>
      <button
        onClick={() => onGenerate(destination, days)}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold"
      >
        Generate
      </button>
    </div>
    <div className="mt-8 flex justify-center gap-3 flex-wrap">
      {[
        { emoji: '🏯', name: 'Rajasthan' },
        { emoji: '🌊', name: 'Goa' },
        { emoji: '🏔️', name: 'Manali' },
        { emoji: '🛕', name: 'Kerala' },
        { emoji: '🕌', name: 'Delhi' },
      ].map((place) => (
        <span
          key={place.name}
          onClick={() => handlePillClick(place.name)}
          className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-opacity-40"
        >
          {place.emoji} {place.name}
        </span>
      ))}
    </div>
  </div>
);
}

function DestinationCards({ onCardClick }) {
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
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Popular Destinations</h2>
      <p className="text-center text-gray-500 mb-10">Click any destination to instantly generate an itinerary!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {destinations.map((dest) => (
          <div
            key={dest.name}
            onClick={() => onCardClick(dest.name)}
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
          >
            <div className={`${dest.color} rounded-xl p-4 text-5xl text-center mb-4`}>{dest.emoji}</div>
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

function Itinerary({ itinerary, loading, onSave, user }) {
  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="text-6xl mb-4">🤖</div>
        <h2 className="text-2xl font-bold text-gray-700">AI is building your itinerary...</h2>
        <p className="text-gray-500 mt-2">This will take a few seconds!</p>
      </div>
    );
  }
  if (!itinerary) return null;
  const lines = itinerary.split('\n');
  return (
    <div className="py-16 px-8 bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Your AI Generated Itinerary
      </h2>
      <div className="max-w-4xl mx-auto">
        {lines.map((line, index) => {
          if (line.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold text-blue-600 mt-8 mb-4">{line.replace('## ', '')}</h2>;
          } else if (line.startsWith('#### ')) {
            return <p key={index} className="font-semibold text-gray-700 mt-4 mb-2">{line.replace('#### ', '')}</p>;
          } else if (line.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3 border-l-4 border-blue-500 pl-4">{line.replace('### ', '')}</h3>;
          } else if (line.startsWith('**')) {
            return <p key={index} className="font-bold text-gray-800 mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>;
          } else if (line.startsWith('*   ')) {
            return (
              <div key={index} className="flex gap-3 mb-2 ml-4">
                <span className="text-blue-500 mt-1">•</span>
                <p className="text-gray-600">{line.replace('*   ', '')}</p>
              </div>
            );
          } else if (line.startsWith('---')) {
            return <hr key={index} className="my-6 border-gray-200" />;
          } else if (line.trim() === '') {
            return <div key={index} className="mb-2" />;
          } else {
            return <p key={index} className="text-gray-600 mb-2">{line}</p>;
          }
        })}
          <div className="text-center mt-10 flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-blue-700"
          >
            Print / Save as PDF
          </button>
          {user && (
            <button
              onClick={onSave}
              className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-green-600"
            >
              Save Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-blue-600 text-white py-10 px-8 text-center">
      <div className="text-3xl font-bold mb-2">🗺️ YatrAI</div>
      <p className="text-blue-100 mb-4">Made with love for India</p>
      <div className="flex justify-center gap-8 text-blue-200 mb-6">
        <span className="cursor-pointer hover:text-white">Home</span>
        <span className="cursor-pointer hover:text-white">Explore</span>
        <span className="cursor-pointer hover:text-white">My Trips</span>
        <span className="cursor-pointer hover:text-white">Contact</span>
      </div>
      <p className="text-blue-300 text-sm">2024 YatrAI. All rights reserved.</p>
    </div>
  );
}

function LoginPage({ onLogin, onGoogleLogin, onSwitch, isSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-400 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-blue-600 mb-2">🗺️ YatrAI</div>
          <p className="text-gray-500">{isSignup ? 'Create your account' : 'Welcome back!'}</p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-500 text-gray-800"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-500 text-gray-800"
          />
        </div>

        {/* Login/Signup Button */}
        <button
          onClick={() => onLogin(email, password)}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 mb-4"
        >
          {isSignup ? 'Create Account' : 'Login'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={onGoogleLogin}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 flex items-center justify-center gap-2 mb-6"
        >
          <img src="https://www.google.com/favicon.ico" alt="google" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Switch between Login and Signup */}
        <p className="text-center text-gray-500 text-sm">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span
            onClick={onSwitch}
            className="text-blue-600 font-medium cursor-pointer ml-1"
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </span>
        </p>

      </div>
    </div>
  );
}

function TripMap({ destination }) {
  const [coords, setCoords] = useState([20.5937, 78.9629]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destination) return;
    setLoading(true);
    fetch(`https://nominatim.openstreetmap.org/search?q=${destination},India&format=json&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [destination]);

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-8 bg-white">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        📍 {destination} on Map
      </h2>
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg" style={{ height: '400px' }}>
        <MapContainer
          key={coords.toString()}
          center={coords}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={coords}>
            <Popup>{destination} — Your next adventure!</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

function App() {
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);
  const [showTrips, setShowTrips] = useState(false);
  const [lastDestination, setLastDestination] = useState('');
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((u) => setUser(u));
  }, []);

 // const handleLogin = async () => {
   // try {
     // await signInWithPopup(auth, provider);
    //} catch (error) {
     // alert('Login failed! ' + error.message);
    //}
  //};

 const handleLogout = async () => {
  await signOut(auth);
  setShowTrips(false);
  setShowLoginPage(false);
};
  const handleEmailLogin = async (email, password) => {
  try {
    if (isSignup) {
      await createUserWithEmailAndPassword(auth, email, password);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
    setShowLoginPage(false);
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

const handleGoogleLogin = async () => {
  try {
    await signInWithPopup(auth, provider);
    setShowLoginPage(false);
  } catch (error) {
    alert('Login failed! ' + error.message);
  }
};

  const saveTrip = async () => {
    if (!user) {
      alert('Please login to save trips!');
      return;
    }
    try {
      await addDoc(collection(db, 'trips'), {
        userId: user.uid,
        destination: lastDestination,
        itinerary: itinerary,
        createdAt: new Date()
      });
      alert('Trip saved successfully!');
    } catch (error) {
      alert('Failed to save trip! ' + error.message);
    }
  };

  const loadSavedTrips = async () => {
    if (!user) return;
    const q = query(collection(db, 'trips'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSavedTrips(trips);
    setShowTrips(true);
  };

  const generateItinerary = async (destination, days) => {
    if (!destination) {
      alert('Please enter a destination!');
      return;
    }
    setLastDestination(destination);
    setLoading(true);
    setItinerary('');
    setShowTrips(false);
    window.scrollTo({ top: 400, behavior: 'smooth' });
    try {
      const response = await fetch('https://yatr-ai-backend.onrender.com/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, days }),
      });
      const data = await response.json();
      if (data.error) {
        alert('Something went wrong! ' + data.error);
      } else {
        setItinerary(data.itinerary);
      }
    } catch (error) {
      alert('Something went wrong! ' + error.message);
    }
    setLoading(false);
  };

  const handleCardClick = (destinationName) => {
    generateItinerary(destinationName, '3');
  };

  if (showLoginPage && !user) {
  return (
    <LoginPage
      onLogin={handleEmailLogin}
      onGoogleLogin={handleGoogleLogin}
      onSwitch={() => setIsSignup(!isSignup)}
      isSignup={isSignup}
    />
  );
}

  return (
    <div>
     <Navbar
     user={user}
    onLogin={() => setShowLoginPage(true)}
    onLogout={handleLogout}
    onShowTrips={loadSavedTrips}
     />
      <Hero onGenerate={generateItinerary} />
      {showTrips && (
        <div className="py-16 px-8 bg-white max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            My Saved Trips
          </h2>
          {savedTrips.length === 0 ? (
            <p className="text-center text-gray-500">No saved trips yet!</p>
          ) : (
            savedTrips.map(trip => (
              <div
                key={trip.id}
                onClick={() => { setItinerary(trip.itinerary); setShowTrips(false); }}
                className="bg-gray-50 rounded-2xl p-6 mb-4 cursor-pointer hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-blue-600">{trip.destination}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {trip.createdAt?.toDate?.()?.toLocaleDateString() || 'Saved trip'}
                </p>
              </div>
            ))
          )}
        </div>
      )}
      <Itinerary
        itinerary={itinerary}
        loading={loading}
        onSave={saveTrip}
        user={user}
       />

        {itinerary && <TripMap destination={lastDestination} />}

      <DestinationCards onCardClick={handleCardClick} />
      <Footer />
    </div>
  );
}

export default App;
