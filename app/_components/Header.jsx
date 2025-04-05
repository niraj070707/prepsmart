// "use client"
// import React, { useEffect } from 'react'

// import Image from 'next/image';
// import { UserButton } from '@clerk/nextjs';
// import { usePathname, useRouter } from 'next/navigation';


// const Header = () => {
//   const path = usePathname();
//   const router = useRouter();
//   useEffect(()=>{
//     console.log(path);
//   })
//   return (
//     <div className='flex p-4 items-center justify-between bg-[#0F0F0F] shadow-sm'>
//         {/* <Image src='/logo1.svg' alt="logo" width={ 160 } height={ 100 } /> */}
//         <a href="/" class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
//                             <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="prepSmart Logo" />
//                             {/* <Image src='/logo1.svg' alt="logo" width={ 160 } height={ 100 } /> */}
//                             <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">prepSmart</span>
//                         </a>
//         <ul className=' hidden md:flex gap-6'>
//          <li onClick={() => router.replace('/')} className={`hover:text-primary hover:font-bold hover:underline transition-all cursor-pointer ${path=='/dashboard' && 'text-primary font-bold'}`}>Home</li>
//           <li onClick={() => router.replace('/dashboard')} className={`hover:text-primary hover:font-bold hover:underline transition-all cursor-pointer ${path=='/dashboard' && 'text-primary font-bold'}`}>Dashboard</li>
//           <li className={`hover:text-primary hover:font-bold hover:underline transition-all cursor-pointer ${path=='/dashboard/questions' && 'text-primary font-bold'}`}>Questions</li>
//           <li className={`hover:text-primary hover:font-bold hover:underline transition-all cursor-pointer ${path=='/dashboard/upgrade' && 'text-primary font-bold'}`}>Upgrade</li>
//           <li onClick={() => router.replace('/about')} className={`hover:text-primary hover:font-bold hover:underline transition-all cursor-pointer ${path=='/dashboard/how it works' && 'text-primary font-bold'}`}>How it Works?</li>
//         </ul>
//         <UserButton/>
//     </div>
//   )
// }

// export default Header
"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(path);
  });

  return (
    <div className="flex p-4 items-center justify-between bg-[#0F0F0F] shadow-sm">
      <a
        href="/"
        className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
      >
        <Image src='/logo_update.svg' alt="logo" width={32} height={32} />
        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
          prepSmart
        </span>
      </a>
      <ul className="hidden md:flex gap-6 text-white">
        <li
          onClick={() => router.replace("/")}
          className={`hover:text-gray-300 hover:font-bold hover:underline transition-all cursor-pointer ${
            path === "/" && "text-gray-300 font-bold"
          }`}
        >
          <span className="text-lg">Home</span>
        </li>
        <li
          onClick={() => router.replace("/dashboard")}
          className={`hover:text-gray-300 hover:font-bold hover:underline transition-all cursor-pointer ${
            path === "/dashboard" && "text-gray-300 font-bold"
          }`}
        >
          <span className="text-lg">Dashboard</span>
        </li>
        <li
          onClick={() => router.replace("/dashboard/questions")}
          className={`hover:text-gray-300 hover:font-bold hover:underline transition-all cursor-pointer ${
            path === "/dashboard/questions" && "text-gray-300 font-bold"
          }`}
        >
          <span className="text-lg">Questions</span>
        </li>
        <li
          onClick={() => router.replace("/about")}
          className={`hover:text-gray-300 hover:font-bold hover:underline transition-all cursor-pointer ${
            path === "/about" && "text-gray-300 font-bold"
          }`}
        >
          <span className="text-lg">About</span>
        </li>
        <li
          onClick={() => router.replace("/contact")}
          className={`hover:text-gray-300 hover:font-bold hover:underline transition-all cursor-pointer ${
            path === "/contact" && "text-gray-3300 font-bold"
          }`}
        >
          <span className="text-lg">Contact</span>
        </li>
      </ul>
      <UserButton />
    </div>
  );
};

export default Header;