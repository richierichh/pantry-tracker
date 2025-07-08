// page.js
import OpenAI from "openai";
// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateRecipe = async (pantryItems) => {
  const createPrompt = (items) => {
    if (items.length === 0) {
      return "I have no ingredients in my pantry. Can you suggest something I could cook with minimal ingredients?";
    }
    const itemsList = items.join(", ");
    console.log(itemsList)
    return `I have ${itemsList} in my pantry. Please suggest recipes that use ONLY these ingredients (and common seasonings/condiments if needed), and do NOT include any other main ingredients.`;
  };

  const prompt = createPrompt(pantryItems);

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    throw error;
  }
};