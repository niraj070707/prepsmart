"use client";
import React from "react";
import Image from 'next/image';
import Link from "next/link";
import { Button } from "@/components/ui/button"; 
import { useState } from "react";
import { FaChevronLeft, FaChevronRight,FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const testimonials = [
  { quote: "PrepSmart transformed my interview preparation. The AI feedback was spot-on!", name: "Rahul S", role: "Software Engineer" },
  { quote: "The mock interviews helped me build confidence. Highly recommend it!", name: "Ananya P", role: "Data Scientist" },
  { quote: "I loved the coding challenges and instant feedback. A game-changer for job seekers!", name: "Vikram K", role: "Full Stack Developer" },
  { quote: "The facial emotion detection feature gave me unique insights into my performance.", name: "Neha M", role: "AI Engineer" },
];

const HomePage = () => {
  const [index, setIndex] = useState(0);

  const prevTestimonial = () => setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const nextTestimonial = () => setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      {/* <section className="text-center py-20 px-4">
        <h1 className="text-4xl font-bold md:text-6xl">Prepare Smarter with PrepSmart</h1>
        <p className="mt-4 text-lg text-gray-300">Your AI-powered interview preparation platform.</p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section> */}
          <section className="text-center py-20 px-4 relative">
      {/* Background Image */}
      <Image
        src="/assets/bg-home1.jpg"
        alt="Interview Preparation Background"
        fill
        quality={90}
        priority
        className="absolute inset-0 object-cover z-0 brightness-50"
      />
      
      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold md:text-6xl text-white">Prepare Smarter with PrepSmart</h1>
        <p className="mt-4 text-lg text-gray-300">Your AI-powered interview preparation platform.</p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800">
        <h2 className="text-3xl font-semibold text-center">Why Choose PrepSmart?</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-10 max-w-5xl mx-auto">
          <div className="p-6 bg-gray-700 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">AI Mock Interviews</h3>
            <p className="mt-2 text-gray-300">Simulate real interviews and receive AI-based feedback.</p>
          </div>
          <div className="p-6 bg-gray-700 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Facial Emotion Analysis</h3>
            <p className="mt-2 text-gray-300">Get insights into your confidence level through AI emotion detection.</p>
          </div>
          <div className="p-6 bg-gray-700 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Personalized Reports</h3>
            <p className="mt-2 text-gray-300">Track your progress with detailed performance analysis.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
       
      <section className="py-20 px-4 bg-gray-900 text-white text-center">
      <h2 className="text-4xl font-bold mb-10">What Our Users Say</h2>
      <div className="h-auto w-auto max-w-3xl mx-auto relative p-6 bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-500">
        <FaQuoteLeft className="text-yellow-500 absolute top-4 left-4" />
        <blockquote className="text-lg italic animate-fadeIn">"{testimonials[index].quote}"</blockquote>
        <FaQuoteRight className="text-yellow-500 absolute top-4 right-4" />
        <p className="mt-4 font-semibold text-blue-400">— {testimonials[index].name}, {testimonials[index].role}</p>
        
        {/* Navigation Buttons */}
        <button
          onClick={prevTestimonial}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-all"
        >
          <FaChevronLeft size={15} />
        </button>
        <button
          onClick={nextTestimonial}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition-all"
        >
          <FaChevronRight size={15} />
        </button>
      </div>
    </section> 

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-800">
        <h2 className="text-3xl font-semibold text-center">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto mt-10">
          <details className="mb-4 p-4 bg-gray-700 rounded-lg">
            <summary className="font-semibold cursor-pointer">How does AI-based mock interviews work?</summary>
            <p className="mt-2 text-gray-300">The AI analyzes your answers and provides real-time feedback on content, tone, and confidence.</p>
          </details>
          <details className="mb-4 p-4 bg-gray-700 rounded-lg">
            <summary className="font-semibold cursor-pointer">Do I need to install any software?</summary>
            <p className="mt-2 text-gray-300">No installation is required! You can access PrepSmart directly from your web browser.</p>
          </details>
          <details className="mb-4 p-4 bg-gray-700 rounded-lg">
            <summary className="font-semibold cursor-pointer">What is the best way to improve using PrepSmart?</summary>
            <p className="mt-2 text-gray-300">Consistency is key! Practice regularly, analyze feedback, and apply improvements in real interviews.</p>
          </details>
        </div>
      </section>
    </div>
  );
};

export default HomePage;