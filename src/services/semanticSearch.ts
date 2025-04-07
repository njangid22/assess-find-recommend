
import { pipeline } from '@huggingface/transformers';
import { AssessmentData } from '../types/assessment';

// Interface for search results
export interface SearchResult {
  title: string;
  description: string;
  link: string;
  similarity: number;
}

export class SemanticSearchService {
  private model: any = null;
  private isLoading: boolean = false;
  private assessments: AssessmentData[] = [];
  private assessmentEmbeddings: number[][] = [];

  constructor(assessments: AssessmentData[]) {
    this.assessments = assessments;
  }

  async initialize(): Promise<void> {
    if (this.model !== null || this.isLoading) return;
    
    this.isLoading = true;
    try {
      console.log('Loading feature extraction model...');
      this.model = await pipeline(
        'feature-extraction',
        'mixedbread-ai/mxbai-embed-xsmall-v1'
      );
      
      console.log('Computing embeddings for all assessments...');
      // Pre-compute embeddings for all assessments
      for (const assessment of this.assessments) {
        const text = `${assessment.title} ${assessment.description}`;
        const embedding = await this.getEmbedding(text);
        this.assessmentEmbeddings.push(embedding);
      }
      console.log('Embeddings computation complete');
    } catch (error) {
      console.error('Error initializing semantic search:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private async getEmbedding(text: string): Promise<number[]> {
    if (!this.model) {
      throw new Error('Model not initialized. Call initialize() first.');
    }

    try {
      const result = await this.model(text, { pooling: 'mean', normalize: true });
      return Array.from(result.data);
    } catch (error) {
      console.error('Error getting embedding:', error);
      throw error;
    }
  }

  private computeCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must be of the same length');
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) {
      return 0;
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    if (!this.model) {
      await this.initialize();
    }

    try {
      console.log(`Searching for: "${query}"`);
      const queryEmbedding = await this.getEmbedding(query);
      
      // Compute similarity with all assessments
      const similarities = this.assessmentEmbeddings.map((embedding, index) => ({
        assessment: this.assessments[index],
        similarity: this.computeCosineSimilarity(queryEmbedding, embedding)
      }));
      
      // Sort by similarity (highest first)
      similarities.sort((a, b) => b.similarity - a.similarity);
      
      // Return top K results
      return similarities.slice(0, topK).map(item => ({
        title: item.assessment.title,
        description: item.assessment.description,
        link: item.assessment.link,
        similarity: item.similarity
      }));
    } catch (error) {
      console.error('Error during search:', error);
      throw error;
    }
  }
}
