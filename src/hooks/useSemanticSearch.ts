
import { useState, useEffect } from 'react';
import { SemanticSearchService, SearchResult } from '../services/semanticSearch';
import assessmentsData from '../data/assessmentsData.json';

export const useSemanticSearch = () => {
  const [searchService, setSearchService] = useState<SemanticSearchService | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const initializeSearch = async () => {
      try {
        console.log('Initializing semantic search service...');
        const service = new SemanticSearchService(assessmentsData);
        await service.initialize();
        setSearchService(service);
        console.log('Semantic search service initialized successfully');
      } catch (err) {
        console.error('Failed to initialize search service:', err);
        setError('Failed to initialize search capabilities. Please try again later.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSearch();
  }, []);

  const performSearch = async (query: string): Promise<SearchResult[]> => {
    if (!searchService) {
      console.error('Search service not initialized yet');
      throw new Error('Search service not ready. Please try again in a moment.');
    }

    if (!query.trim()) {
      return [];
    }

    try {
      return await searchService.search(query);
    } catch (err) {
      console.error('Search error:', err);
      throw new Error('Failed to complete search. Please try again.');
    }
  };

  return {
    performSearch,
    isInitializing,
    error
  };
};
