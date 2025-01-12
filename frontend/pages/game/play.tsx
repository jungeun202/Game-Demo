import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { LuCircleCheckBig, LuCirclePlay, LuFrown} from "react-icons/lu";

declare global {
  interface Window {
    Spotify: any;
  }
}

interface Song {
  title: string;
  uri: string;
}

export default function PlayGame() {
  const router = useRouter();
  const { year } = router.query;

  const [player, setPlayer] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playbackOffset, setPlaybackOffset] = useState(0);
  const [progress, setProgress] = useState(0);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [revealAnswer, setRevealAnswer] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  // Fetch token and song details
  useEffect(() => {
    const fetchTokenAndSong = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('token');
      if (!accessToken) {
        window.location.href = 'http://localhost:3001/login';
        return;
      }
      setToken(accessToken);

      if (year) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/songs?year=${year}`
          );
          const uri = response.data.spotify_uri;

          const fetchSongDetails = async (uri: string, token: string): Promise<string | null> => {
            try {
              const trackId = uri.split(':').pop();
              const trackResponse = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              return trackResponse.data.name; // Song title
            } catch (error) {
              console.error('Error fetching song details:', error);
              return null;
            }
          };

          const title = await fetchSongDetails(uri, accessToken);

          if (title && uri) {
            setCurrentSong({ title, uri });
          } else {
            setWarningMessage('Error: Could not load song details.');
          }
        } catch (error) {
          console.error('Error fetching song:', error);
          setWarningMessage('Error loading the song. Please try again.');
        }
      }
    };

    fetchTokenAndSong();
  }, [year]);

  // Initialize Spotify Player
  useEffect(() => {
    if (!token || !window.Spotify) return;

    const spotifyPlayer = new window.Spotify.Player({
      name: 'Guess the Song Player',
      getOAuthToken: (cb: (token: string) => void) => {
        cb(token);
      },
      volume: 0.8,
    });

    spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
      setDeviceId(device_id);
    });

    spotifyPlayer.connect();
    setPlayer(spotifyPlayer);

    return () => spotifyPlayer.disconnect();
  }, [token]);

  const playSong = async () => {
    if (!currentSong) {
      setWarningMessage('Error: No song is loaded. Please wait.');
      return;
    }

    try {
      setIsPlaying(true);
      setCanSubmit(false);
      setProgress(0);

      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          uris: [currentSong.uri],
          position_ms: playbackOffset * 1000,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 15) {
            clearInterval(interval);
            player?.pause();
            setIsPlaying(false);
            setCanSubmit(true);
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error playing song:', error);
      setIsPlaying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setWarningMessage('Submission is only allowed after the song finishes.');
      return;
    }

    const userAnswer = (e.target as HTMLFormElement).elements.namedItem('guess') as HTMLInputElement;
    const answer = userAnswer.value.trim().toLowerCase();

    if (!currentSong || !currentSong.title?.trim()) {
      setWarningMessage('Error: No song is loaded. Please refresh the page.');
      return;
    }

    setAttempts((prev) => prev + 1);

    if (answer === currentSong.title.toLowerCase()) {
      setCorrectAnswer(true);
    } else if (attempts + 1 >= 5) {
      setRevealAnswer(true);
    } else {
      setCorrectAnswer(false);
      setWarningMessage('Wrong answer! Try again.');
      setPlaybackOffset((prev) => prev + 15);
    }
  };


  if (correctAnswer) {
    return (
      <div className="min-h-screen bg-gradientStart text-center flex flex-col items-center justify-center text-primary font-primary">
        <div className="mt-12">
          <h1 className="text-4xl justify-center items-center inline-flex">
            <LuCircleCheckBig className="mr-2" />
          Congratulations! You guessed it right! </h1>
          <h2 className="text-3xl mt-16 font-bold">{currentSong?.title}</h2>
          <div className="mt-16 space-x-4 text-2xl">
            <button
              onClick={() => router.push('/game/setup')}
              className="px-4 py-2 rounded bg-gradientStart hover:bg-gradientEnd"
            >
              Replay
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded bg-gradientStart hover:bg-gradientEnd"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (revealAnswer) {
    return (
      <div className="min-h-screen bg-gradientStart text-center flex flex-col items-center justify-center text-primary font-primary">
        <div className="mt-12">
          <h1 className="text-4xl justify-center items-center inline-flex">
          <LuFrown className="mr-2" />
          Out of Attempts! The correct answer was:
          </h1>
          <h2 className="text-3xl mt-16 font-bold">{currentSong?.title}</h2>
          <div className="mt-16 space-x-4 text-2xl">
            <button
              onClick={() => router.push('/game/setup')}
              className="px-4 py-2 rounded bg-gradientStart hover:bg-gradientEnd"
            >
              Replay
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded bg-gradientStart hover:bg-gradientEnd"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradientStart min-h-screen flex flex-col items-center justify-center font-primary">

    <div className="text-center">
      <h1 className="text-6xl mb-24 font-bold text-primary">Guess the Song</h1>
      <div
        className={`w-auto p-6 rounded-xl transition-colors flex flex-col items-start justify-center gap-4 ${
          isPlaying ? 'bg-gradientEnd' : 'bg-gradientStart'
        }`}
        style={{ height: '150px' }} // Adjust height as needed
      >
        {/* Icon with Progress Bar */}
        <div className="flex items-center w-full max-w-xs">
          <LuCirclePlay className="mr-4 text-4xl" />
          <div className="w-full h-3 bg-grey-600 rounded overflow-hidden border-2 border-slate-950">
            <div
              className="h-full bg-blue-950"
              style={{ width: `${(progress / 15) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Play/Playing Text */}
        <div className="flex items-center w-full max-w-xs">
          <button
            onClick={playSong}
            disabled={isPlaying}
            className={`py-2 rounded  text-xl ${
              isPlaying ? 'cursor-not-allowed' : 'text-primary'
            }`}
          >
            {isPlaying ? (
              <>
                Playing...
              </>
            ) : (
              'Play'
            )}
          </button>
        </div>
      </div>
      {warningMessage && <p className="text-red-600 font-primary mt-2">{warningMessage}</p>}
      <p className="text-left mt-24 text-primary">Attempts: {attempts}/5</p>
      <form onSubmit={handleSubmit} className="text-primary space-y-4 text-left">
        <input
          type="text"
          name="guess"
          placeholder="Guess the song title"
          className="w-80 px-4 py-2 border rounded focus:ring-2 focus:ring-[#F5B041] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className={`ml-4 px-6 py-2 rounded-lg ${
            canSubmit ? 'bg-gradientStart hover:bg-gradientEnd' : 'cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </form>
    </div>
    </div>
  );
}
