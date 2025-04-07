
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Assessment } from '../data/assessments';
import { ExternalLink } from 'lucide-react';

interface ResultsTableProps {
  assessments: Assessment[];
  query: string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ assessments, query }) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-lg text-gray-600">
          Showing top {assessments.length} recommendations for your query:
        </h2>
        <p className="text-gray-800 font-medium mt-1">"{query}"</p>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Assessment Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Remote Testing</TableHead>
              <TableHead>Adaptive/IRT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell className="font-medium">
                  <a 
                    href={assessment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-shl hover:text-shl-600 hover:underline"
                  >
                    {assessment.name}
                    <ExternalLink className="ml-1" size={14} />
                  </a>
                </TableCell>
                <TableCell>{assessment.type}</TableCell>
                <TableCell>{assessment.duration}</TableCell>
                <TableCell>{assessment.remote_support}</TableCell>
                <TableCell>{assessment.adaptive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ResultsTable;
