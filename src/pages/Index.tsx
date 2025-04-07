
import React from 'react';
import SearchForm from '../components/SearchForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            SHL Assessment Recommender
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get the most relevant SHL assessments for your job role in seconds.
          </p>
          <SearchForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
