'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/authcontexts'; // Ensure the correct path

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/LandingPage');
  };


  return (
    <nav className="flex justify-center items-center max-w-lg mx-auto pt-4 mt-6 bg-gray-100 rounded-full shadow-md">
    <div className="flex space-x-8 items-center mb-4">
        <Link href='/home' className="text-black font-medium hover:text-blue-600"> 
          Pantry
        </Link>
        <Link href='/recipes' className="text-black font-medium hover:text-blue-600">
          Recipes
        </Link>
        {user && (
          <button onClick={handleLogout} className="text-black font-medium hover:text-blue-600">
            Log Out
          </button>
        )}
        {!user && (
          <Link href='/' className="text-black font-medium hover:text-blue-600">
            Log Out
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;