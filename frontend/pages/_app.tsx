// import { useEffect } from 'react';

// export default function App({ Component, pageProps }: any) {
//   useEffect(() => {
//     // Define the global function required by Spotify SDK
//     window.onSpotifyWebPlaybackSDKReady = () => {
//       console.log('Spotify SDK is ready');
//     };

//     // Load the Spotify Web Playback SDK script
//     const script = document.createElement('script');
//     script.src = 'https://sdk.scdn.co/spotify-player.js';
//     script.async = true;
//     document.body.appendChild(script);

//     // Cleanup the global function when the component unmounts
//     return () => {
//       delete window.onSpotifyWebPlaybackSDKReady;
//     };
//   }, []);

//   return <Component {...pageProps} />;
// }

import { useEffect } from 'react';
import '../styles/globals.css';

export default function App({ Component, pageProps }: any) {
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('Spotify SDK is ready');
    };

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      delete window.onSpotifyWebPlaybackSDKReady;
    };
  }, []);

  return <Component {...pageProps} />;
}
