import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { LuMusic4, LuArrowRight} from "react-icons/lu";

export default function SetupGame() {
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('token');
    setToken(accessToken);

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/years`)
      .then((res) => {
        setYears(res.data);
      })
      .catch((err) => {
        console.error('Error fetching years:', err);
      });
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsOpen(false);
  };

  return (
    <div className="bg-gradientStart min-h-screen flex flex-col items-center justify-center font-primary">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-24 text-primary inline-flex ">Guess That Jam <LuMusic4 /> </h1>
        <div className="flex items-center justify-center space-x-5">
          <label className="font-bold text-3xl text-primary">YEARS:</label>
          <div
            className={`relative w-40 p-2 border rounded-lg cursor-pointer bg-white ${
              isOpen ? 'ring-2 ring-[#F5B041]' : 'ring-1 ring-gray-300'
            }`}
            onClick={toggleDropdown}
          >
          <div className="text-primary text-xl">{selectedYear || 'Select Year'}</div>
          {isOpen && (
            <ul className="absolute top-full text-primary left-0 w-full max-h-32 overflow-y-auto border-2 rounded-lg bg-white shadow-lg z-10">
              {years
                .slice()
                .sort((a, b) => b - a)
                .map((year) => (
                  <li
                    key={year}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

        <div className="mt-36">
          <Link
            href={
              selectedYear
                ? `/game/play?year=${selectedYear}&token=${token}`
                : '#'
            }
          >
            <button
              className={`px-6 w-[440px] text-primary py-3 inline-flex items-center justify-center text-3xl font-semibold rounded-lg transition ${
                selectedYear
                  ? 'bg-gradientEnd  hover:gradientEnd'
                  : 'bg-gradientStart cursor-not-allowed'
              }`}
              disabled={!selectedYear}
            >
              Game Start <LuArrowRight />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
  