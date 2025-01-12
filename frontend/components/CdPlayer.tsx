const CdPlayer: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-[#fdf6e4] h-screen">
          {/* Outer Frame */}
          <div className="relative w-64 h-64 bg-gray-200 border-4 border-black rounded-xl shadow-md">
            {/* Inner Frame */}
            <div className="absolute inset-[6px] w-[calc(100%-12px)] h-[calc(100%-12px)] bg-white rounded-lg border-4 border-black flex items-center justify-center">
              {/* CD */}
              <div className="w-48 h-48 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full border-4 border-black relative shadow-lg animate-spin-slow">
                {/* Thin Surrounding Ring */}
                <div className="w-12 h-12 bg-transparent rounded-full border-[2px] border-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {/* Innermost Circle */}
                  <div className="w-10 h-10 bg-black rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            </div>
          </div>
      
          <div className="flex ml-10">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 200" 
                className="w-20 h-40"
            >
                <path
                d="M25,0 C30,50 15,100 25,150 C35,200 20,250 25,300" 
                stroke="black"
                strokeWidth="4"
                fill="none"
                />
            </svg>
           </div>

        </div>
      );
      
};

export default CdPlayer;
