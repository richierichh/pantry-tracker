import React from 'react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  const handleLogin = () => { 
    router.push('/login');
  };

  const handleSignup = () => { 
    router.push('/register');
  };

  return (
    <div className="relative h-screen w-screen bg-cover bg-center overflow-hidden flex flex-col justify-center" style={{backgroundImage: 'url(fruits.jpg)'}}>
      <div className="text-black font-semibold text-8xl font-mono text-center">
        Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Pantry</span> Finds into
      </div>
      <div className="text-black font-semibold text-8xl mb-14 font-mono text-center">
        Culinary Delights 👨🏻‍🍳
      </div>
      <div className="text-black text-3xl font-mono mb-10 text-center ">
      Find food recipes for all your pantry items
      </div>
      <div className="flex justify-center"> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-4 rounded-md"
          onClick={handleLogin}>
          Log in 
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          onClick={handleSignup}>
          Sign up 
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
