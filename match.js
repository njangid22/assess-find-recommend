const fs = require('fs');
const path = require('path');
const { SentenceTransformer } = require('sentence-transformers');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const model = new SentenceTransformer('all-MiniLM-L6-v2');

// Load the dataset
const datasetPath = path.join(__dirname, 'src/data/assessmentsData.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));

app.get('/match', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  // Compute embeddings for the query and the dataset
  const queryEmbedding = await model.encode(query);
  const datasetEmbeddings = await model.encode(dataset.map(item => item.description));

  // Compute cosine similarities
  const similarities = await util.cosineSimilarities(queryEmbedding, datasetEmbeddings);

  // Get the top matches
  const topK = Math.min(5, dataset.length);
  const topResults = similarities
    .map((score, idx) => ({ score, idx }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // Prepare the results
  const results = topResults.map(({ score, idx }) => ({
    title: dataset[idx].title,
    description: dataset[idx].description,
    link: dataset[idx].link,
    score
  }));

  res.json({ results });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
