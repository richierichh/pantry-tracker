import React from "react";
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Parses a ChatGPT recipe string into structured recipe objects
export function parseRecipes(recipeString) {
  // Remove any leading text before the first recipe
  const start = recipeString.search(/\d+\.\s+\*\*/);
  const trimmed = start >= 0 ? recipeString.slice(start) : recipeString;

  // Regex to match each recipe block
  const recipeRegex = /\d+\.\s+\*\*(.+?)\*\*:\s*- Ingredients: (.+?)\.\s*- Instructions: (.+?)(?=(?:\d+\.|\n|$))/gs;
  const recipes = [];
  let match;
  while ((match = recipeRegex.exec(trimmed)) !== null) {
    const [_, name, ingredients, instructions] = match;
    recipes.push({
      name: name.trim(),
      ingredients: ingredients.split(',').map(i => i.trim()),
      instructions: instructions.trim().replace(/\s+/g, ' ')
    });
  }
  return recipes;
}
