
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sampleQueries } from '../data/assessments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const SearchForm: React.FC = () => {
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('');
  const [isUrl, setIsUrl] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isUrl) {
      if (!url.trim()) {
        setError('Please enter a valid URL');
        return;
      }
      
      // In a real application, we would fetch the job description from the URL
      // For now, we'll just use the URL as the query
      navigate(`/results?query=${encodeURIComponent(url)}`);
    } else {
      if (!query.trim()) {
        setError('Please enter a job description or query');
        return;
      }
      
      navigate(`/results?query=${encodeURIComponent(query)}`);
    }
  };
  
  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
    setIsUrl(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsUrl(false)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
              !isUrl 
                ? 'bg-white text-shl border-b-2 border-shl' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Job Description
          </button>
          <button
            type="button"
            onClick={() => setIsUrl(true)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
              isUrl 
                ? 'bg-white text-shl border-b-2 border-shl' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Job URL
          </button>
        </div>
        
        {isUrl ? (
          <div>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste job description URL here"
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-shl focus:border-shl transition-all"
            />
          </div>
        ) : (
          <div>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., Hiring a mid-level Python developer who also knows SQL and JS"
              className="min-h-[150px] w-full p-4 border rounded-lg focus:ring-2 focus:ring-shl focus:border-shl transition-all"
            />
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <Button
          type="submit"
          className="w-full py-3 rounded-lg bg-shl hover:bg-shl-600 transition-colors"
        >
          Find Relevant Assessments
        </Button>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">OR Try a Sample Query</p>
          <div className="flex flex-wrap justify-center gap-2">
            {sampleQueries.map((sample, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSampleQuery(sample.query)}
                className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors"
              >
                {sample.query}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
