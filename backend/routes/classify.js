// classify.js
import express from 'express';
import axios from 'axios';

const classifyRoute = express.Router();

classifyRoute.post('/', async (req, res) => {
  const { comment } = req.body;

  try {
    const response = await axios.post('https://drive.google.com/drive/folders/1MwfRkW3pyCCys3OzccfdTBGzGbrXhltB?usp=sharing/predict', { comment });
    res.json(response.data);  // { prediction: 0 or 1 }
  } catch (error) {
    console.error('Error calling Python API:', error.message);
    res.status(500).json({ error: 'Could not get prediction from model' });
  }
});

export default classifyRoute;
