
import { AssessmentData } from '../types/assessment';

// Interface for search results
export interface SearchResult {
  title: string;
  description: string;
  link: string;
  similarity: number;
}

export class SemanticSearchService {
  private assessments: AssessmentData[] = [];
  private initialized: boolean = false;
  private modelLoaded: boolean = false;

  constructor(assessments: AssessmentData[]) {
    this.assessments = assessments;
    this.initialized = true;
    console.log('Semantic search service initialized');
  }

  async initialize(): Promise<void> {
    // We're using a simple initialization
    // If we had a model, we'd load it here
    try {
      // Simulate model loading with a quick timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      this.modelLoaded = true;
    } catch (error) {
      console.error('Failed to load model, will use fallback', error);
      this.modelLoaded = false;
    }
    
    this.initialized = true;
    return Promise.resolve();
  }

  private calculateRelevanceScore(query: string, assessment: AssessmentData): number {
    // Simple keyword matching algorithm
    const queryLower = query.toLowerCase();
    const titleLower = assessment.title.toLowerCase();
    const descLower = assessment.description.toLowerCase();
    
    // Calculate a score based on keyword presence
    let score = 0;
    
    // Split query into words
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
    // Score based on word matches in title and description
    for (const word of queryWords) {
      if (titleLower.includes(word)) {
        score += 3; // Title matches are weighted higher
      }
      if (descLower.includes(word)) {
        score += 1;
      }
    }
    
    // Exact phrase matches get bonus points
    if (titleLower.includes(queryLower)) {
      score += 5;
    }
    if (descLower.includes(queryLower)) {
      score += 2;
    }
    
    return score;
  }

  // Get random assessments as a fallback
  private getRandomAssessments(count: number = 5): SearchResult[] {
    // Shuffle array and take first 'count' elements
    const shuffled = [...this.assessments]
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
    
    return shuffled.map(assessment => ({
      title: assessment.title,
      description: assessment.description,
      link: assessment.link,
      similarity: 1 // Default similarity for random results
    }));
  }

  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      console.log(`Searching for: "${query}"`);
      
      // If query is empty or too short, return random results
      if (!query || query.trim().length < 3) {
        console.log('Query too short, returning random results');
        return this.getRandomAssessments(topK);
      }
      
      // For each assessment, calculate a relevance score
      const scoredResults = this.assessments.map(assessment => {
        const relevanceScore = this.calculateRelevanceScore(query, assessment);
        return {
          assessment,
          similarity: relevanceScore
        };
      });
      
      // Sort by score (highest first) and filter out zero scores
      const rankedResults = scoredResults
        .filter(item => item.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity);
      
      // If no results found, return random assessments
      if (rankedResults.length === 0) {
        console.log('No results found, returning random assessments');
        return this.getRandomAssessments(topK);
      }
      
      // Return top K results
      return rankedResults.slice(0, topK).map(item => ({
        title: item.assessment.title,
        description: item.assessment.description,
        link: item.assessment.link,
        similarity: item.similarity
      }));
    } catch (error) {
      console.error('Error during search, falling back to random results:', error);
      // If any error occurs during search, fall back to random results
      return this.getRandomAssessments(topK);
    }
  }
}
