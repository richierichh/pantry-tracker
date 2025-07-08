'use client';
import React, { useState } from 'react';
import Navbar from '../components/navbar'; // Ensure the correct path
import TableDemo from '../components/table';
import { parseRecipes } from '../components/utils';

const Home = () => {
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pantryItems, setPantryItems] = useState([]);

  // Function to handle fetching recipes
  const handleGenerateRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      // Only use pantry items for recipe generation
      const itemsToSend = pantryItems.filter(item => !isSeasoning(item));
      console.log('pantryItems used for recipe generation:', itemsToSend);
      const response = await fetch('api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: itemsToSend }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recipes. Please try again.');
      }
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (err) {
      console.error('Error generating recipes:', err);
      setError('Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to filter out seasonings
  function isSeasoning(item) {
    const seasonings = [
      'salt', 'pepper', 'oil', 'olive oil', 'canola oil', 'vegetable oil', 'soy sauce', 'vinegar', 'sugar', 'honey',
      'spices', 'herbs', 'garlic powder', 'onion powder', 'paprika', 'cumin', 'coriander', 'oregano', 'basil', 'thyme',
      'rosemary', 'chili powder', 'cinnamon', 'nutmeg', 'cloves', 'ginger', 'mustard', 'ketchup', 'mayonnaise', 'hot sauce',
      'bbq sauce', 'seasoning', 'seasonings', 'dressing', 'syrup', 'lemon juice', 'lime juice', 'bay leaf', 'bay leaves'
    ];
    return seasonings.some(seasoning => item.toLowerCase().includes(seasoning));
  }

  return (
    <div className="p-6">
      <Navbar/>
      <TableDemo onPantryItemsChange={setPantryItems} onGenerateRecipes={handleGenerateRecipes} />
      <button
        onClick={handleGenerateRecipes}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Generate Recipes
      </button>
      {loading && <p>Loading recipes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {recipes && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Generated Recipes:</h3>
          {parseRecipes(recipes).length === 0 ? (
            <p>{recipes}</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {parseRecipes(recipes).map((recipe, idx) => (
                <div key={idx} className="border rounded-lg p-4 shadow bg-white flex flex-col">
                  <h2 className="text-xl font-bold mb-2">{recipe.name}</h2>
                  <h3 className="font-semibold">Ingredients:</h3>
                  <ul className="list-disc list-inside mb-2">
                    {recipe.ingredients.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <h3 className="font-semibold">Instructions:</h3>
                  <p>{recipe.instructions}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
