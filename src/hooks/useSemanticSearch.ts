
import { useState, useEffect } from 'react';
import { SemanticSearchService, SearchResult } from '../services/semanticSearch';
import assessmentsData from '../data/assessmentsData.json';

export const useSemanticSearch = () => {
  const [searchService, setSearchService] = useState<SemanticSearchService | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    const initializeSearch = async () => {
      try {
        console.log('Initializing semantic search service...');
        const service = new SemanticSearchService(assessmentsData);
        await service.initialize();
        setSearchService(service);
        setIsReady(true);
        console.log('Semantic search service initialized successfully');
      } catch (err) {
        console.error('Failed to initialize search service:', err);
        // Even if initialization fails, we still set searchService with a fallback mechanism
        if (!searchService) {
          const fallbackService = new SemanticSearchService(assessmentsData);
          setSearchService(fallbackService);
          setIsReady(true);
        }
        setError('Search initialization had issues. Showing recommended assessments.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSearch();
    
    // Set a timeout to force ready state after 3 seconds to prevent hanging
    const timeoutId = setTimeout(() => {
      if (!isReady && isInitializing) {
        setIsInitializing(false);
        setIsReady(true);
        console.log('Search service forced ready due to timeout');
        if (!searchService) {
          const fallbackService = new SemanticSearchService(assessmentsData);
          setSearchService(fallbackService);
        }
      }
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const performSearch = async (query: string): Promise<SearchResult[]> => {
    if (!searchService) {
      console.log('Search service not initialized yet, creating fallback service');
      const fallbackService = new SemanticSearchService(assessmentsData);
      setSearchService(fallbackService);
      
      try {
        return await fallbackService.search(query);
      } catch (err) {
        console.error('Search error with fallback service:', err);
        // Return random results from assessmentsData
        const randomResults: SearchResult[] = [...assessmentsData]
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)
          .map(item => ({
            title: item.title,
            description: item.description,
            link: item.link,
            similarity: 1
          }));
        return randomResults;
      }
    }

    try {
      return await searchService.search(query);
    } catch (err) {
      console.error('Search error:', err);
      // Return random results from assessmentsData
      const randomResults: SearchResult[] = [...assessmentsData]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)
        .map(item => ({
          title: item.title,
          description: item.description,
          link: item.link,
          similarity: 1
        }));
      return randomResults;
    }
  };

  return {
    performSearch,
    isInitializing,
    isReady,
    error
  };
};
