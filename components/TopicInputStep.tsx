
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Spinner } from './ui/Spinner';
import { Sparkles } from './icons';

interface TopicInputStepProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
  error: string | null;
}

const TopicInputStep: React.FC<TopicInputStepProps> = ({ onGenerate, isLoading, error }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onGenerate(topic);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-2xl font-semibold mb-2 text-white">Start with a Topic</h2>
      <p className="text-gray-400 mb-6">
        Enter a subject, trend, or keyword, and let AI do the rest.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'The future of space travel'"
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !topic.trim()}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Script
              </>
            )}
          </Button>
        </div>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </form>
       <div className="mt-8 text-left w-full max-w-lg">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Popular Ideas:</h3>
        <div className="flex flex-wrap gap-2">
            {['Ancient Roman secrets', 'The psychology of procrastination', 'Mind-blowing facts about the ocean', 'AI in everyday life'].map((idea) => (
                <button 
                  key={idea}
                  onClick={() => setTopic(idea)}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm px-3 py-1 rounded-full transition-colors"
                >
                  {idea}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TopicInputStep;
