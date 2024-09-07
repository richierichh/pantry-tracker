// pages/api/generate-recipes.js
import { generateRecipe } from '../../app/openaiAPI/page';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { items } = req.body;

    try {
      const recipes = await generateRecipe(items);
      res.status(200).json({ recipes });
    } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ error: 'Failed to fetch recipes.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}