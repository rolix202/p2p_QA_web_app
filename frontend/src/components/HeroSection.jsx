import React from "react";
import collabo from "../assets/collabo.svg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="hero bg-gradient-to-r from-green-500 to-green-700 text-white py-16">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6 md:px-12">
        {/* Left Content */}
        <div className="text-center md:text-left md:w-1/2">
          {/* Bold "3MTT" Branding */}
          <div className="mb-4">
            <span className="text-7xl font-extrabold text-yellow-400 drop-shadow-lg">
            AskMe3MTT
            </span>
            <p className="text-xl text-gray-200 font-light mt-2">
              Share. Inspire. Learn Together.
            </p>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold leading-tight">
            Your Knowledge Matters:
            <span className="block text-yellow-300">
              Share, Inspire, and Learn Together
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed">
            Every question asked and every answer shared is a step towards
            collective growth. Empower the 3MTT community today.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            <Link to="/add-question" className="bg-yellow-400 hover:bg-yellow-300 text-green-900 px-6 py-3 rounded-lg shadow-lg text-lg">
              Ask a Question
            </Link>
            <button className="bg-white hover:bg-gray-200 text-green-700 px-6 py-3 rounded-lg shadow-lg text-lg">
              Explore Questions
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={collabo}
            alt="Collaboration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
