
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

  constructor(assessments: AssessmentData[]) {
    this.assessments = assessments;
    this.initialized = true; // Simple initialization without model loading
    console.log('Semantic search service initialized with fallback mechanism');
  }

  async initialize(): Promise<void> {
    // We're using a simple keyword-based search as fallback
    // No initialization needed
    this.initialized = true;
    return Promise.resolve();
  }

  private calculateRelevanceScore(query: string, assessment: AssessmentData): number {
    // Simple keyword matching algorithm instead of embeddings
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

  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      console.log(`Searching for: "${query}"`);
      
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
      
      // Return top K results
      return rankedResults.slice(0, topK).map(item => ({
        title: item.assessment.title,
        description: item.assessment.description,
        link: item.assessment.link,
        similarity: item.similarity
      }));
    } catch (error) {
      console.error('Error during search:', error);
      throw new Error('Failed to complete search. Please try again.');
    }
  }
}
