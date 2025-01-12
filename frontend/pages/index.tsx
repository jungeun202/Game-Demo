import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CdPlayer from '../components/CdPlayer';
import { LuMusic4 } from "react-icons/lu";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Extract token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const retrievedToken = urlParams.get('token');
    setToken(retrievedToken);
  }, []);

  const handleStartGame = () => {
    if (!token) {
      // Redirect to the Spotify login page if no token is found
      window.location.href = process.env.NEXT_PUBLIC_SPOTIFY_LOGIN_URL || 'http://localhost:3001/login';
    } else {
      console.log('Starting the game...');
    }
  };

  const handleInfoClick = () => {
    router.push('/info');
  };

  return (
    <div className="flex h-screen items-center font-primary justify-center gap-40 bg-gradientStart">

      {/* Left Column */}
      <div className="flex flex-col items-start justify-center space-y-4 text-primary">
        <h1 className="text-9xl font-bold">
          <span className="block text-left">Guess</span>
          <span className="block text-left">That</span>
          <span className="inline-flex items-center text-left">Jam <LuMusic4 /> </span>
          </h1>

        <div className="flex space-x-2">
          <button
            onClick={handleStartGame}
            className="px-6 py-2 text-2xl bg-gradientStart rounded-lg hover:bg-gradientEnd transition"
          >
            Start the Game
          </button>
          <button
            onClick={handleInfoClick}
            className="px-6 py-2 text-2xl bg-gradientStart rounded-lg hover:bg-gradientEnd transition"
          >
            Info
          </button>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex items-center justify-center rounded-lg">
        <CdPlayer />
      </div>
    </div>
  
  );
}
