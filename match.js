const fs = require('fs');
const path = require('path');
const express = require('express');
const { SemanticSearchService } = require('./semanticsearch');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

// Load the dataset
const datasetPath = path.join(__dirname, 'src/data/assessmentsData.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
const searchService = new SemanticSearchService(dataset);

// Initialize embeddings on server startup
(async () => {
  try {
    await searchService.initialize();
    console.log('Semantic search service initialized successfully.');
  } catch (error) {
    console.error('Error initializing semantic search service:', error);
  }
})();

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Assessment Recommendation Endpoint
app.post('/recommend', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
    const recommendations = await searchService.search(query, 10);
    const formattedRecommendations = recommendations.map((rec) => ({
      url: rec.link,
      adaptive_support: 'No', // Placeholder, update based on your dataset
      description: rec.description,
      duration: 60, // Placeholder, update based on your dataset
      remote_support: 'Yes', // Placeholder, update based on your dataset
      test_type: ['Knowledge & Skills'], // Placeholder, update based on your dataset
    }));

    res.status(200).json({ recommended_assessments: formattedRecommendations });
  } catch (error) {
    console.error('Error processing recommendation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
