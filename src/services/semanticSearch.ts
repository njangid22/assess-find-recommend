
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
    this.initialized = true;
    console.log('Search service initialized with keyword matching');
  }

  async initialize(): Promise<void> {
    // Simple initialization with no model loading
    this.initialized = true;
    return Promise.resolve();
  }

  private extractKeywords(text: string): string[] {
    // Extract words with at least 4 characters, converting to lowercase
    // and removing common words like 'and', 'the', 'for', etc.
    const stopWords = ['and', 'the', 'for', 'with', 'this', 'that', 'from', 'your'];
    
    // Extract words, remove punctuation
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => 
        word.length >= 4 && !stopWords.includes(word)
      );
  }

  private calculateRelevanceScore(query: string, assessment: AssessmentData): number {
    // Extract keywords from query and assessment content
    const queryKeywords = this.extractKeywords(query);
    const titleKeywords = this.extractKeywords(assessment.title);
    const descKeywords = this.extractKeywords(assessment.description || '');
    
    if (queryKeywords.length === 0) {
      return 0; // No valid keywords to match
    }
    
    // Calculate score based on keyword matches
    let score = 0;
    let matchCount = 0;
    
    for (const keyword of queryKeywords) {
      // Check for exact or partial matches in title (more weight)
      for (const titleWord of titleKeywords) {
        if (titleWord.includes(keyword) || keyword.includes(titleWord)) {
          score += 3;
          matchCount++;
          break;
        }
      }
      
      // Check for exact or partial matches in description
      for (const descWord of descKeywords) {
        if (descWord.includes(keyword) || keyword.includes(descWord)) {
          score += 1;
          matchCount++;
          break;
        }
      }
      
      // Direct match in full text
      if (assessment.title.toLowerCase().includes(keyword)) {
        score += 2;
      }
      if ((assessment.description || '').toLowerCase().includes(keyword)) {
        score += 1;
      }
    }
    
    // Bonus for matching ratio (what percentage of query keywords were found)
    const matchRatio = matchCount / queryKeywords.length;
    score += matchRatio * 5;
    
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
