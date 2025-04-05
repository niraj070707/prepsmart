"use client";
import React, { useEffect } from "react";
import "../styles/about.css";

const AboutUs = () => {

  // useEffect(() => {
  //   const request = async () => {
  //     try {
  //       // Fetch the ZIP file from the public folder or another location
  //       const response = await fetch("/images.zip"); // Adjust the path as needed
  //       const zipBlob = await response.blob(); // Convert to Blob
  
  //       const formData = new FormData();
  //       formData.append("zipfile", zipBlob, "interview_snapshots.zip");
  
  //       const uploadResponse = await fetch("http://localhost:4000/upload", {
  //         method: "POST",
  //         body: formData,
  //         credentials: "include",
  //       });
  
  //       if (!uploadResponse.ok) {
  //         throw new Error(`Upload failed: ${uploadResponse.statusText}`);
  //       }
  
  //       const analysisResult = await uploadResponse.json();
  //       console.log("analysisResult:", analysisResult);
  //     } catch (error) {
  //       console.error("Error uploading file:", error);
  //     }
  //   };
  
  //   request();
  // }, []);
  
  return (
    // <div className="bg-gray-100 text-gray-900">
    //   {/* Hero Section */}
    //   <section className="bg-[#0F0F0F] text-white py-16 text-center">
    //     <div className="max-w-4xl mx-auto px-6">
    //       <h1 className="text-4xl font-bold mb-4">About PrepSmart</h1>
    //       <p className="text-lg">
    //         Your ultimate platform for interview preparation, combining AI-powered tools with expert guidance to help you land your dream job.
    //       </p>
    //     </div>
    //   </section>

    //   {/* Mission & Vision Section */}
    //   <section className="max-w-5xl mx-auto px-6 py-16">
    //     <div className="grid md:grid-cols-2 gap-10">
    //       <div className="bg-white p-6 shadow-lg rounded-lg">
    //         <h2 className="text-2xl font-bold mb-4">🎯 Our Mission</h2>
    //         <p className="text-gray-700">
    //           We aim to empower job seekers by providing a seamless interview preparation experience with personalized feedback and real-time AI analysis.
    //         </p>
    //       </div>
    //       <div className="bg-white p-6 shadow-lg rounded-lg">
    //         <h2 className="text-2xl font-bold mb-4">🚀 Our Vision</h2>
    //         <p className="text-gray-700">
    //           To be the leading AI-driven interview preparation platform that helps candidates ace their interviews with confidence.
    //         </p>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Team Section (Optional) */}
    //   <section className="bg-gray-200 py-16 text-center">
    //     <div className="max-w-4xl mx-auto px-6">
    //       <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
    //       <p className="text-lg text-gray-700 mb-10">
    //         Our team of experts and engineers are dedicated to making interview prep effortless and efficient for you.
    //       </p>
    //       <div className="grid md:grid-cols-3 gap-8">
    //         <div className="bg-white p-6 shadow-lg rounded-lg">
    //           <h3 className="text-xl font-semibold">John Doe</h3>
    //           <p className="text-gray-600">CEO & Co-Founder</p>
    //         </div>
    //         <div className="bg-white p-6 shadow-lg rounded-lg">
    //           <h3 className="text-xl font-semibold">Jane Smith</h3>
    //           <p className="text-gray-600">CTO</p>
    //         </div>
    //         <div className="bg-white p-6 shadow-lg rounded-lg">
    //           <h3 className="text-xl font-semibold">Mark Johnson</h3>
    //           <p className="text-gray-600">Lead Developer</p>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   {/* Call to Action */}
    //   <section className="text-center py-16">
    //     <h2 className="text-3xl font-bold mb-4">Start Preparing Today!</h2>
    //     <p className="text-lg text-gray-700 mb-6">
    //       Join PrepSmart and take your interview skills to the next level.
    //     </p>
    //     <a href="/signup" className="bg-[#0F0F0F] text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition">
    //       Get Started
    //     </a>
    //   </section>
    // </div>
    <div>
      <section id="abt_us">
        <div id="logo_info">
          <div id="abt_img">
            <div id="abt_img_cover">
              <p id="abt_logo">
                <img src=""></img>
                <span id="sp_1">prep</span>
                <span id="sp_2">Smart</span>
              </p>
              <p id="abt_logo_info">
                Your ultimate AI-powered interview coach, helping you practice smarter, boost confidence, and ace every opportunity with ease!
              </p>
            </div>
          </div>
          <p id="abt_desc" class="pcnt">
            "PrepSmart is an advanced online platform designed to help job seekers excel in their interview preparation. Our AI-powered features include real-time facial emotion analysis, personalized feedback, and a curated set of mock interview questions tailored to various industries. We provide an intuitive and structured approach to mastering interviews, ensuring that candidates build confidence, improve their responses, and stand out to recruiters. Whether you're a fresher or an experienced professional, PrepSmart is your go-to solution for landing your dream job. Start your journey today and elevate your interview skills with PrepSmart! 🚀"
          </p>
        </div>
        <div id="our_msn">
          <section className="max-w-5xl">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-[#5072A7] p-6 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4">🎯 Our Mission</h2>
                <p className="text-white italic">
                  We aim to empower job seekers by providing a seamless
                  interview preparation experience with personalized feedback
                  and real-time AI analysis.
                </p>
              </div>
              <div className="bg-[#5072A7] p-6 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4">🚀 Our Vision</h2>
                <p className="text-white italic">
                  To be the leading AI-driven interview preparation platform
                  that helps candidates ace their interviews with confidence.
                </p>
              </div>
            </div>
          </section>
        </div>
        <div id="our_tm">
          <h2>Our dedicated Team</h2>
          <p id="team_desc" class="pcnt">
            Meet the PrepSmart Team, the minds behind our smart and effective interview preparation platform!
          </p>
          <div id="team">
            <div class="mem_img" id="m1"></div>
            <div id="d1" class="mem_d">
              <p class="mem_name">Niraj Karande</p>
              <p class="mem_work">Full Stack Developer</p>
              <p class="social_med">
                <ul class="sc_med_ic">
                  <li>
                    <a
                      href=""
                      class="li_link"
                    ></a>
                  </li>
                  <li>
                    <a href="" class="in_link"></a>
                  </li>
                  <li>
                    <a href="" class="fb_link"></a>
                  </li>
                </ul>
              </p>
            </div>

            <div class="mem_img" id="m2"></div>
            <div id="d2" class="mem_d">
              <p class="mem_name">Sarthak Nirgude</p>
              <p class="mem_work">Full Stack Developer</p>
              <p class="social_med">
                <ul class="sc_med_ic">
                  <li>
                    <a
                      href="https://www.linkedin.com/in/sarthaknirgude7/"
                      class="li_link"
                    ></a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/_i_am_srn/"
                      class="in_link"
                    ></a>
                  </li>
                  <li>
                    <a
                      href=""
                      class="fb_link"
                    ></a>
                  </li>
                </ul>
              </p>
            </div>

            <div class="mem_img" id="m3"></div>
            <div id="d3" class="mem_d">
              <p class="mem_name">Sumit Sunke</p>
              <p class="mem_work">Full Stack Developer</p>
              <p class="social_med">
                <ul class="sc_med_ic">
                  <li>
                    <a
                      href=""
                      class="li_link"
                    ></a>
                  </li>
                  <li>
                    <a
                      href=""
                      class="in_link"
                    ></a>
                  </li>
                  <li>
                    <a href="" class="fb_link"></a>
                  </li>
                </ul>
              </p>
            </div>

            <div class="mem_img" id="m4"></div>
            <div id="d4" class="mem_d">
              <p class="mem_name">Rushikesh Mane</p>
              <p class="mem_work">Full Stack Developer</p>
              <p class="social_med">
                <ul class="sc_med_ic">
                  <li>
                    <a href="" class="li_link"></a>
                  </li>
                  <li>
                    <a
                      href=""
                      class="in_link"
                    ></a>
                  </li>
                  <li>
                    <a
                      href=""
                      class="fb_link"
                    ></a>
                  </li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;