
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ResultsTable from '../components/ResultsTable';
import { useSemanticSearch } from '../hooks/useSemanticSearch';
import { Assessment } from '../types/assessment';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('query') || '';
  const { performSearch, isInitializing, error: serviceError } = useSemanticSearch();
  const [recommendations, setRecommendations] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      navigate('/');
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        if (isInitializing) {
          // Wait a bit to see if initialization completes
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (serviceError) {
            throw new Error(serviceError);
          }
        }
        
        const results = await performSearch(query);
        
        // Convert search results to Assessment format
        const assessments: Assessment[] = results.map((result, index) => ({
          id: `result-${index}`,
          name: result.title,
          url: result.link,
          type: 'Assessment', // Default type since we don't have this in our JSON
          duration: 'Varies',  // Default duration
          remote_support: 'Yes', // Default
          adaptive: 'Varies',  // Default
        }));
        
        setRecommendations(assessments);
        
        if (assessments.length === 0) {
          setError('No matching assessments found. Please try a different query.');
        }
      } catch (err) {
        console.error('Error in semantic search:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recommendations. Please try again.');
        toast({
          title: "Search Error",
          description: "There was a problem with your search. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [query, navigate, performSearch, isInitializing, serviceError]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Home
        </Button>

        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-shl" />
            <p className="mt-4 text-gray-600">Analyzing your job description...</p>
          </div>
        ) : error ? (
          <div className="w-full text-center py-16">
            <p className="text-red-500">{error}</p>
            <Button 
              onClick={() => navigate('/')}
              className="mt-4 bg-shl hover:bg-shl-600"
            >
              Try Again
            </Button>
          </div>
        ) : recommendations.length > 0 ? (
          <ResultsTable assessments={recommendations} query={query} />
        ) : (
          <div className="w-full text-center py-16">
            <p className="text-gray-600">No assessments found for your query. Try a different search.</p>
            <Button 
              onClick={() => navigate('/')}
              className="mt-4 bg-shl hover:bg-shl-600"
            >
              Return to Search
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Results;
