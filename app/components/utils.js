import React from "react";
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Improved parser for more flexible recipe formats
export function parseRecipes(recipeString) {
  if (!recipeString || typeof recipeString !== 'string') return [];

  // Remove ** and split by numbered recipes
  const recipeBlocks = recipeString
    .replace(/\*\*/g, '')
    .split(/\d+\.\s+/)
    .map(block => block.trim())
    .filter(block => block && !/^certainly!?/i.test(block) && !/here (are|is) (a|some) (few )?simple recipes?/i.test(block));

  const recipes = recipeBlocks.map(block => {
    // Extract name before Ingredients or colon
    const nameMatch = block.match(/^(.+?)(?:\n|Ingredients:|:)/i);
    const name = nameMatch ? nameMatch[1].replace(/^[\d.\s]+/, '').trim() : 'Recipe';

    // Find - Ingredients: and - Instructions:
    const ingredients = [];
    const instructions = [];
    const lines = block.split(/\r?\n/).map(l => l.trim());
    let inIngredients = false;
    let inInstructions = false;
    for (let line of lines) {
      if (/^-\s*Ingredients?:/i.test(line)) {
        inIngredients = true;
        inInstructions = false;
        continue;
      }
      if (/^-\s*Instructions?:/i.test(line)) {
        inIngredients = false;
        inInstructions = true;
        continue;
      }
      if (inIngredients && line.startsWith('-') && !/^-\s*Instructions?:/i.test(line)) {
        ingredients.push(line.replace(/^-\s*/, ''));
      } else if (inInstructions && line.startsWith('-')) {
        instructions.push(line.replace(/^-\s*/, ''));
      } else if (inInstructions && line && !line.startsWith('-')) {
        instructions.push(line);
      }
    }
    // If no explicit - Ingredients: section, try to extract from the first line after the name
    if (ingredients.length === 0) {
      const ingMatch = block.match(/Ingredients?:\s*([^\n]+)/i);
      if (ingMatch) {
        ingredients.push(...ingMatch[1].split(',').map(i => i.trim()).filter(Boolean));
      }
    }
    // If no explicit - Instructions: section, try to extract from the block
    if (instructions.length === 0) {
      const instrMatch = block.match(/Instructions?:\s*([\s\S]+)/i);
      if (instrMatch) {
        instructions.push(instrMatch[1].trim());
      }
    }

    return {
      name,
      ingredients,
      instructions
    };
  });

  // Filter out any blocks that are not real recipes
  return recipes.filter(r => r.name && (r.ingredients.length > 0 || r.instructions.length > 10));
}
