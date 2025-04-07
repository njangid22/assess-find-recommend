
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            About This Project
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-4">
              This AI-powered tool was built as part of the SHL AI Internship 2025 challenge. 
              It recommends SHL assessments based on a given job description or query using 
              advanced semantic search and NLP techniques.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              How It Works
            </h2>
            
            <p className="text-gray-700 mb-4">
              When you enter a job description, our system:
            </p>
            
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li className="text-gray-700">
                Analyzes the text to identify key skills, requirements, and job attributes
              </li>
              <li className="text-gray-700">
                Matches these attributes against SHL's assessment catalog using semantic search
              </li>
              <li className="text-gray-700">
                Ranks the most relevant assessments based on match quality
              </li>
              <li className="text-gray-700">
                Returns a prioritized list of assessments for your specific recruiting needs
              </li>
            </ol>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              Technology Stack
            </h2>
            
            <p className="text-gray-700 mb-6">
              Built using React, TypeScript, and Tailwind CSS for the frontend. 
              The recommendation engine uses natural language processing techniques 
              and vector search to find the most relevant assessments.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
              About SHL Labs
            </h2>
            
            <p className="text-gray-700 mb-4">
              SHL Labs is the innovation hub of SHL, focused on developing cutting-edge 
              assessment technologies and methodologies.
            </p>
            
            <div className="mt-6">
              <a 
                href="https://www.shl.com/en-in/resources/shl-labs/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Button className="bg-shl hover:bg-shl-600">
                  Visit SHL Labs
                  <ExternalLink className="ml-2" size={16} />
                </Button>
              </a>
            </div>
            
            <p className="text-gray-600 mt-12 italic">
              Built by Nikhil Jangid using LLMs, vector search, and SHL's product catalog.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
