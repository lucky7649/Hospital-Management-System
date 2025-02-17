import React from 'react'

const Hero = () => {
  return (
    <div className="h-fit md:h-[60vh] flex mb-10  rounded-3xl flex-col-reverse  md:flex-row gap-8 p-2 md:px-6 md:py-8">
      {/* Left Section - Text and Button */}
      <div className="w-full lg:w-3/4 flex flex-col items-center  lg:items-start justify-center mb-4">
        <h1 className="text-3xl lg:text-6xl font-bold text-gray-700 text-center lg:text-left transition-all duration-500 ease-in-out transform hover:scale-105">
          Your <span className="text-blue-500">Digital</span> Health Command
          Center
        </h1>
        <h1 className="text-xl mt-4">
          From{" "}
          <span className="px-2 py-1 bg-purple-500 text-lg text-white rounded-lg">
            Appointment
          </span>{" "}
          to{" "}
          <span className="px-3 py-1 bg-green-500 text-lg text-white rounded-lg">
            Recovery
          </span>
        </h1>
        <p className="mt-4 text-sm md:text-lg text-zinc-500 text-center lg:text-left transition-all duration-500 ease-in-out opacity-90 hover:opacity-100">
          Providing compassionate care, advanced medical treatments, and a
          patient-centered approach to ensure your well-being. Book your
          appointments seamlessly with us today.
        </p>
        <div className="bg-blue-600 rounded mt-8 text-xl lg:text-2xl text-white px-6 py-3 w-fit cursor-pointer transform transition-all duration-300 hover:bg-blue-700 hover:scale-105">
          Book Appointment
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-full px-0 relative lg:w-3/6 h-fit lg:h-[100%] flex items-center justify-center">
        <img
          src="./heroDoctor.png"
          alt="hero-img"
          className=" w-full md:w-full rounded-xl   object-contain"
        />
        <img
          src="./hero1.png"
          alt=""
          className="absolute w-20 md:w-28 top-0 left-0 animate-float delay-0"
        />
        <img
          src="./hero2.png"
          alt=""
          className="absolute w-20 md:w-32 top-6 right-0 animate-float delay-1000"
        />
        <img
          src="./capsule1.png"
          alt=""
          className="absolute w-20 md:w-24 bottom-0 left-0 lg:-left-20 animate-float delay-2000"
        />
      </div>
    </div>
  );
}

export default Hero