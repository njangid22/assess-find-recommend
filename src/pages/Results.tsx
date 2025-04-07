
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
import { Alert, AlertDescription } from '@/components/ui/alert';

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('query') || '';
  const { performSearch, isInitializing, isReady, error: serviceError } = useSemanticSearch();
  const [recommendations, setRecommendations] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasAttemptedSearch, setHasAttemptedSearch] = useState(false);

  useEffect(() => {
    if (!query) {
      navigate('/');
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(''); // Clear any previous errors
        
        // Short delay to ensure the service has time to initialize
        if (isInitializing && !isReady) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // Perform the search
        console.log("Performing search for query:", query);
        const results = await performSearch(query);
        console.log("Search results:", results);
        
        if (results.length === 0) {
          toast({
            title: "No matches found",
            description: "Showing some recommended assessments instead.",
            variant: "default"
          });
        }
        
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
        setHasAttemptedSearch(true);
        
      } catch (err) {
        console.error('Error in search:', err);
        setError('Unable to process your search. Showing recommended assessments.');
        
        // Attempt to get random results even after error
        try {
          const randomResults = await performSearch('');
          const fallbackAssessments: Assessment[] = randomResults.map((result, index) => ({
            id: `random-${index}`,
            name: result.title,
            url: result.link,
            type: 'Assessment',
            duration: 'Varies',
            remote_support: 'Yes',
            adaptive: 'Varies',
          }));
          
          setRecommendations(fallbackAssessments);
          setHasAttemptedSearch(true);
          
          // Show toast for fallback
          toast({
            title: "Note",
            description: "Showing recommended assessments.",
            variant: "default"
          });
        } catch (fallbackErr) {
          console.error('Fallback error:', fallbackErr);
          setHasAttemptedSearch(true);
          toast({
            title: "Search Error",
            description: "Unable to retrieve assessments. Please try again later.",
            variant: "destructive"
          });
        }
      } finally {
        setLoading(false);
      }
    };

    // Set a timeout to prevent hanging UI (reduced to 3 seconds)
    const timeoutId = setTimeout(() => {
      if (loading && !hasAttemptedSearch) {
        setLoading(false);
        setError('Search is taking too long. Showing recommended assessments.');
        
        // Force fetch some results to display something
        performSearch('').then(randomResults => {
          const fallbackAssessments: Assessment[] = randomResults.map((result, index) => ({
            id: `timeout-${index}`,
            name: result.title,
            url: result.link,
            type: 'Assessment',
            duration: 'Varies',
            remote_support: 'Yes',
            adaptive: 'Varies',
          }));
          
          setRecommendations(fallbackAssessments);
          setHasAttemptedSearch(true);
          
          toast({
            title: "Search Timeout",
            description: "Showing recommended assessments instead.",
            variant: "default"
          });
        });
      }
    }, 3000);

    fetchRecommendations();

    return () => clearTimeout(timeoutId);
  }, [query, navigate, performSearch, isInitializing, isReady, serviceError]);

  const displayMessage = serviceError ? 
    "Showing recommended assessments based on your query." : 
    `Showing top ${recommendations.length} recommendations for your query:`;

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
        ) : error && recommendations.length === 0 ? (
          <div className="w-full text-center py-16">
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/')}
              className="mt-4 bg-shl hover:bg-shl-600"
            >
              Try Again
            </Button>
          </div>
        ) : recommendations.length > 0 ? (
          <>
            {(error || serviceError) && (
              <Alert className="mb-6">
                <AlertDescription>
                  {error || serviceError}
                </AlertDescription>
              </Alert>
            )}
            <ResultsTable assessments={recommendations} query={query} />
          </>
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
