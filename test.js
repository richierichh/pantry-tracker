// testGenerateRecipe.js
import { generateRecipe } from './app/openaiAPI/page'; // Adjust the path as needed

const test = async () => {
  const testPantryItems = ["tomato", "pasta", "cheese"];  // Example items

  try {
    const recipe = await generateRecipe(testPantryItems);  // Call the function
    console.log("Generated Recipe:\n", recipe);  // Output the result
  } catch (error) {
    console.error("Test failed:", error);  // Handle errors
  }
};

test();  // Run the test
