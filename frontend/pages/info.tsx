import Link from 'next/link';
import { useRouter } from 'next/router';
import { LuInfo } from "react-icons/lu";

export default function Info() {
  const router = useRouter();
  const handleInfoClick = () => {
    router.push('/');
  };
  return (
    <div className="min-h-screen bg-gradientStart text-center flex flex-col text-primary font-primary">
        <div className="mt-12 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-800">
  <h1 className="text-4xl flex items-center justify-center font-bold mb-6 text-primary">
    <LuInfo className="mr-2 text-accent" />
    About
  </h1>
  <p className="text-lg text-primary leading-relaxed mb-6">
    Hello everyone! This web game is a fun challenge where players guess the song's title from short audio clips. The song data is sourced from the{" "}
    <a
      href="https://github.com/madelinehamilton/BiMMuDa"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-accent"
    >
      BiMMuDa GitHub repository
    </a>, which includes the top five singles from the Billboard Year-End Singles Charts for each year from 1950 to 2022.
    <br />
    <br />
    Users can select a year and listen to 15-second song clips sequentially. You have up to 5 attempts to guess the title of each song. I hope you enjoy playing this game. Thank you! 😊
  </p>
  <div className="text-center">
    <button
      onClick={handleInfoClick}
      className="px-6 py-2 text-xl bg-gradientStart text-primary rounded-lg hover:bg-gradientEnd transition"
    >
      Back to Home
    </button>
  </div>
</div>


    </div>
      
  );
}
