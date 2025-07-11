import { generateRecipe } from '../../app/openaiAPI/page';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items } = req.body;
    const recipes = await generateRecipe(items); // already parsed!
    res.status(200).json({ recipes });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
}
