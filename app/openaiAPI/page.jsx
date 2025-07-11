import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateRecipe = async (pantryItems) => {
  const itemsList = pantryItems.join(", ");

  const prompt = `
I have the following items in my pantry: ${itemsList}.
Please give me 2–3 recipes that use ONLY these ingredients (plus common seasonings).
Respond ONLY in valid JSON format, like this:

[
  {
    "name": "Banana Omelette",
    "ingredients": ["2 bananas", "2 eggs", "Salt (to taste)", "Pepper (to taste)"],
    "instructions": [
      "Mash the bananas.",
      "Beat the eggs and mix with the bananas.",
      "Heat oil in a pan and pour in the mixture.",
      "Cook until golden brown on both sides."
    ]
  }
]
`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = chatCompletion.choices[0].message.content;

    // Extract just the JSON portion
    const jsonStart = raw.indexOf("[");
    const jsonEnd = raw.lastIndexOf("]") + 1;
    const jsonString = raw.slice(jsonStart, jsonEnd);

    console.log("Final JSON to parse:", jsonString);

    return JSON.parse(jsonString); // ✅ THIS IS THE ONLY PARSE
  } catch (error) {
    console.error("Error generating or parsing recipe:", error);
    return [];
  }
};
