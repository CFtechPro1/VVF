
import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader, Film, Mic, Type as TypeIcon } from './icons';
import { Spinner } from './ui/Spinner';

interface VideoGenerationStepProps {
  onComplete: () => void;
}

const steps = [
  { text: "Generating high-quality voiceover...", icon: Mic },
  { text: "Sourcing royalty-free B-roll footage...", icon: Film },
  { text: "Styling and timing captions...", icon: TypeIcon },
  { text: "Assembling video layers...", icon: Loader },
  { text: "Finalizing 9:16 vertical render...", icon: Loader },
  { text: "Video creation complete!", icon: CheckCircle },
];

const VideoGenerationStep: React.FC<VideoGenerationStepProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentStepIndex < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1500); // Simulate time for each step
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 1000); // Wait a moment on the final step before proceeding
      return () => clearTimeout(finalTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, onComplete]);

  return (
    <div className="flex flex-col items-center text-center p-8">
      <h2 className="text-2xl font-semibold mb-6 text-white">Your Video is Brewing...</h2>
      <div className="w-full max-w-md">
        <ul className="space-y-4">
          {steps.map((step, index) => (
            <li key={index} className="flex items-center text-lg">
              <div className="w-8 h-8 mr-4 flex items-center justify-center">
                {currentStepIndex > index ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : currentStepIndex === index ? (
                  <Spinner />
                ) : (
                  <step.icon className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <span className={`transition-colors duration-300 ${currentStepIndex >= index ? 'text-gray-200' : 'text-gray-500'}`}>
                {step.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoGenerationStep;
