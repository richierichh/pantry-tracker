'use client';

import React, { useState } from 'react';
import TableDemo from '../components/table'; // Import your table component

const RecipePage = () => {
  const [recipes, setRecipes] = useState(null); // State to hold fetched recipes
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(null); // State to handle errors
  const [items, setItems] = useState([]); // State to manage pantry items

  // Function to handle fetching recipes
  const handleGenerateRecipes = async () => {
    try {
      setLoading(true); // Set loading to true while fetching data
      setError(null); // Clear any previous errors

      // Make an API call to fetch recipes from the backend
      const response = await fetch('api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipes. Please try again.');
      }

      const data = await response.json();
      setRecipes(data.recipes); // Update state with the fetched recipes
    } catch (err) {
      console.error('Error generating recipes:', err);
      setError('Failed to generate recipes. Please try again.'); // Update error state
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Pantry Recipes</h1>

      {/* Render TableDemo component and pass handleGenerateRecipes function */}
      <TableDemo onGenerateRecipes={handleGenerateRecipes} />

      {/* Button to trigger recipe generation */}
      <button
        onClick={handleGenerateRecipes}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Generate Recipes
      </button>

      {/* Show loading indicator */}
      {loading && <p>Loading recipes...</p>}

      {/* Display error message if there's an error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display the fetched recipes */}
      {recipes && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Generated Recipes:</h3>
          <p>{recipes}</p>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
