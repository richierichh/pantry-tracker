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
    router.push('/auth/login');
  };

  return (
    <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200'>
      {user ? (
        <button onClick={handleLogout} className='text-sm text-blue-600 underline'>
          Logout
        </button>
      ) : (
        <>
          <a href='/home'> 
            Pantry
          </a>
          <a>
            Recipes
          </a>
          <Link href='/login' className='text-sm text-blue-600 underline'>
            Login
          </Link>
          <Link href='/register' className='text-sm text-blue-600 underline'>
            Register new account
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
