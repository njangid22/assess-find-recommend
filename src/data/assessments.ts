
export interface Assessment {
  id: string;
  name: string;
  url: string;
  type: string;
  duration: string;
  remote_support: string;
  adaptive: string;
}

export const sampleAssessments: Assessment[] = [
  {
    id: "1",
    name: "Cognitive Ability Test",
    url: "https://www.shl.com/en-in/assessments/cognitive-ability-tests/",
    type: "Cognitive",
    duration: "30 mins",
    remote_support: "Yes",
    adaptive: "Yes"
  },
  {
    id: "2",
    name: "Personality Inventory",
    url: "https://www.shl.com/en-in/assessments/personality-assessments/",
    type: "Personality",
    duration: "25 mins",
    remote_support: "Yes",
    adaptive: "No"
  },
  {
    id: "3",
    name: "Coding Assessment - Python",
    url: "https://www.shl.com/en-in/assessments/coding-assessments/",
    type: "Technical",
    duration: "45 mins",
    remote_support: "Yes",
    adaptive: "No"
  },
  {
    id: "4",
    name: "SQL Database Knowledge",
    url: "https://www.shl.com/en-in/assessments/tech-assessments/",
    type: "Technical",
    duration: "40 mins",
    remote_support: "Yes",
    adaptive: "No"
  },
  {
    id: "5",
    name: "JavaScript Proficiency",
    url: "https://www.shl.com/en-in/assessments/tech-assessments/",
    type: "Technical",
    duration: "35 mins",
    remote_support: "Yes",
    adaptive: "No"
  },
  {
    id: "6",
    name: "Leadership Situational Judgment",
    url: "https://www.shl.com/en-in/assessments/situational-judgment-tests/",
    type: "Behavioral",
    duration: "50 mins",
    remote_support: "Yes",
    adaptive: "No"
  },
  {
    id: "7",
    name: "Verbal Reasoning",
    url: "https://www.shl.com/en-in/assessments/cognitive-ability-tests/",
    type: "Cognitive",
    duration: "25 mins",
    remote_support: "Yes",
    adaptive: "Yes"
  },
  {
    id: "8",
    name: "Numerical Reasoning",
    url: "https://www.shl.com/en-in/assessments/cognitive-ability-tests/",
    type: "Cognitive",
    duration: "30 mins",
    remote_support: "Yes",
    adaptive: "Yes"
  },
  {
    id: "9",
    name: "Full Stack Developer Assessment",
    url: "https://www.shl.com/en-in/assessments/tech-assessments/",
    type: "Technical",
    duration: "60 mins",
    remote_support: "Yes",
    adaptive: "No"
  },
  {
    id: "10",
    name: "Emotional Intelligence Assessment",
    url: "https://www.shl.com/en-in/assessments/personality-assessments/",
    type: "Personality",
    duration: "40 mins",
    remote_support: "Yes",
    adaptive: "No"
  }
];

// Sample queries with appropriate assessments for each
export const sampleQueries = [
  {
    query: "Hiring a mid-level Python developer who also knows SQL and JS",
    recommendedIds: ["3", "4", "5", "9", "1"]
  },
  {
    query: "Looking for a leadership position in engineering department",
    recommendedIds: ["6", "1", "10", "7", "8"]
  },
  {
    query: "Entry level data analyst with statistical knowledge",
    recommendedIds: ["8", "1", "7", "4", "2"]
  }
];

// Mock API function to simulate getting recommendations
export function get_recommendations(query: string) {
  // Check if the query matches any of our sample queries
  const matchingSample = sampleQueries.find(
    sample => sample.query.toLowerCase() === query.toLowerCase()
  );
  
  if (matchingSample) {
    // Return recommended assessments in order
    return matchingSample.recommendedIds.map(
      id => sampleAssessments.find(assessment => assessment.id === id)
    ).filter(Boolean);
  }
  
  // For non-matching queries, perform a simple keyword matching
  const keywords = query.toLowerCase().split(/\s+/);
  
  // Score assessments based on keyword matches
  const scoredAssessments = sampleAssessments.map(assessment => {
    const nameScore = keywords.filter(word => 
      assessment.name.toLowerCase().includes(word)
    ).length * 2;
    
    const typeScore = keywords.filter(word => 
      assessment.type.toLowerCase().includes(word)
    ).length;
    
    return {
      assessment,
      score: nameScore + typeScore
    };
  });
  
  // Sort by score (highest first) and return top 5
  return scoredAssessments
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.assessment);
}
