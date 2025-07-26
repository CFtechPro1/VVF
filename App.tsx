
import React, { useState, useCallback } from 'react';
import { AppStep, ScriptData } from './types';
import { generateScriptForTopic } from './services/geminiService';
import TopicInputStep from './components/TopicInputStep';
import ScriptEditorStep from './components/ScriptEditorStep';
import VideoGenerationStep from './components/VideoGenerationStep';
import PreviewStep from './components/PreviewStep';
import { Film, Clapperboard, Sparkles } from './components/icons';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.TOPIC);
  const [topic, setTopic] = useState<string>('');
  const [scriptData, setScriptData] = useState<ScriptData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateScript = useCallback(async (newTopic: string) => {
    setTopic(newTopic);
    setIsLoading(true);
    setError(null);
    setScriptData(null);

    try {
      const data = await generateScriptForTopic(newTopic);
      setScriptData(data);
      setCurrentStep(AppStep.SCRIPT);
    } catch (e) {
      console.error(e);
      setError('Failed to generate script. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleScriptAccept = useCallback((updatedScriptData: ScriptData) => {
    setScriptData(updatedScriptData);
    setCurrentStep(AppStep.GENERATING);
  }, []);

  const handleGenerationComplete = useCallback(() => {
    setCurrentStep(AppStep.PREVIEW);
  }, []);

  const handleRestart = useCallback(() => {
    setTopic('');
    setScriptData(null);
    setError(null);
    setCurrentStep(AppStep.TOPIC);
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case AppStep.TOPIC:
        return (
          <TopicInputStep
            onGenerate={handleGenerateScript}
            isLoading={isLoading}
            error={error}
          />
        );
      case AppStep.SCRIPT:
        return (
          scriptData && (
            <ScriptEditorStep
              scriptData={scriptData}
              onAccept={handleScriptAccept}
              onRegenerate={() => handleGenerateScript(topic)}
              isRegenerating={isLoading}
            />
          )
        );
      case AppStep.GENERATING:
        return <VideoGenerationStep onComplete={handleGenerationComplete} />;
      case AppStep.PREVIEW:
        return scriptData && <PreviewStep scriptData={scriptData} onRestart={handleRestart} />;
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <Clapperboard className="w-12 h-12 text-cyan-400" />
            <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Viral Video Factory
            </h1>
            <Sparkles className="w-12 h-12 text-purple-500" />
          </div>
          <p className="text-lg text-gray-400">
            Turn any topic into a viral short video in minutes.
          </p>
        </header>
        
        <main className="w-full">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8 transition-all duration-500">
            {renderStep()}
          </div>
        </main>

        <footer className="text-center mt-8 text-gray-500">
          <p>Powered by Gemini & React</p>
        </footer>
      </div>
    </div>
  );
}
