import React, { useState, useEffect } from 'react';
import { ScriptData, PexelsPhoto } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Download, Youtube, RotateCcw, Hash, Edit3, Film, CheckCircle, ImageOff } from './icons';
import { Spinner } from './ui/Spinner';
import { fetchBrollImages } from '../services/pexelsService';

interface PreviewStepProps {
  scriptData: ScriptData;
  onRestart: () => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ scriptData, onRestart }) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [bRollImages, setBRollImages] = useState<PexelsPhoto[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoadingImages(true);
      const images = await fetchBrollImages(scriptData.bRollKeywords);
      setBRollImages(images);
      setIsLoadingImages(false);
    };
    loadImages();
  }, [scriptData.bRollKeywords]);

  useEffect(() => {
    if (bRollImages.length === 0) return;

    // Cycle through images faster than captions to create more visual movement
    const imageInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % bRollImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(imageInterval);
  }, [bRollImages]);

  useEffect(() => {
    if (scriptData.captions.length === 0) return;
    
    const captionInterval = setInterval(() => {
        setCurrentCaptionIndex(prev => (prev + 1) % scriptData.captions.length);
    }, 4000); // Change caption every 4 seconds

    return () => clearInterval(captionInterval);
  }, [scriptData.captions]);


  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const handleDownload = () => {
    showNotification("Download started! (Simulation)");
  };
  
  const handleUpload = () => {
    showNotification("Upload to YouTube started! (Simulation)");
  };
  
  const currentImage = bRollImages[currentImageIndex];
  const currentCaption = scriptData.captions[currentCaptionIndex] || scriptData.title;

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-semibold mb-4 text-center text-white">Preview & Export</h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
        {/* Left side: Video player */}
        <div className="lg:col-span-2 flex items-center justify-center">
          <div className="relative aspect-[9/16] w-full max-w-[270px] bg-black rounded-xl border-4 border-gray-700 flex items-center justify-center overflow-hidden shadow-lg">
            {isLoadingImages ? (
              <div className="flex flex-col items-center text-gray-400">
                <Spinner />
                <span className="mt-2 text-sm">Loading B-Roll...</span>
              </div>
            ) : currentImage ? (
                <img src={currentImage.src.portrait} alt={currentImage.alt} className="w-full h-full object-cover transition-opacity duration-500" />
            ) : (
              <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center text-center p-4">
                 <ImageOff className="w-16 h-16 text-gray-600 mb-4"/>
                 <p className="text-gray-500 font-semibold">Could not load B-roll</p>
                 <p className="text-xs text-gray-600 mt-2">(Check Pexels API key or try other keywords)</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-1/4 w-full px-2">
                <p className="text-white text-3xl font-extrabold text-center uppercase tracking-wide leading-tight [text-shadow:_0_2px_5px_rgba(0,0,0,0.9)]">
                    {currentCaption}
                </p>
            </div>
          </div>
        </div>

        {/* Right side: Details and actions */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card>
            <h3 className="font-semibold text-lg mb-3 flex items-center text-cyan-300"><Edit3 className="mr-2"/> Final Details</h3>
            <div className="space-y-3">
              <p><strong>Title:</strong> {scriptData.title}</p>
              <p><strong>Description:</strong> {scriptData.description}</p>
              <div>
                <strong className="flex items-center"><Hash className="mr-2 w-4 h-4"/> Hashtags:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {scriptData.hashtags.map((tag) => (
                    <span key={tag} className="bg-gray-600 text-gray-200 px-3 py-1 text-sm rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={handleDownload} size="lg">
              <Download className="mr-2 h-5 w-5" /> Download MP4
            </Button>
            <Button onClick={handleUpload} variant="secondary" size="lg">
              <Youtube className="mr-2 h-5 w-5" /> Upload to YouTube
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Button onClick={onRestart} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" /> Start Over
        </Button>
      </div>

      {notification && (
        <div className="fixed bottom-5 left-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-out z-50">
          <CheckCircle className="w-6 h-6 mr-3" />
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
};

export default PreviewStep;