
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-sm text-gray-600">
            Built for SHL AI Intern Challenge 2025
          </span>
        </div>
        <div>
          <a 
            href="https://www.shl.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-gray-600 hover:text-shl transition-colors"
          >
            <span className="font-semibold text-shl">SHL</span>
            <span className="ml-1 text-sm">Official Website</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
