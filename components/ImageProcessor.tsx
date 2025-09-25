import React, { useState, useCallback, useRef } from 'react';
import { Tab } from '../types';
import { editImageWithGemini } from '../services/geminiService';
import Loader from './Loader';
import { UploadIcon, DownloadIcon, ReplaceIcon } from './Icons';

interface ImageProcessorProps {
  activeTab: Tab;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({ activeTab }) => {
  const [originalImage, setOriginalImage] = useState<{ file: File; url: string } | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setProcessedImage(null);
    setError(null);
  }, []);

  const processFile = useCallback((file: File | undefined) => {
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError('Image size should be less than 4MB.');
        return;
      }
      setOriginalImage({ file, url: URL.createObjectURL(file) });
      resetState();
    }
  }, [resetState]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0]);
  };
  
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    processFile(event.dataTransfer.files?.[0]);
  };


  const handleSubmit = async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    resetState();

    try {
      const finalPrompt = activeTab === Tab.COLORIZE
        ? 'Colorize this black and white manga panel. Use a vibrant, modern anime art style. Make the colors pop.'
        : prompt;
      
      if(activeTab === Tab.EDIT && !finalPrompt) {
          setError('Please enter an editing instruction.');
          setIsLoading(false);
          return;
      }

      const newImageUrl = await editImageWithGemini(originalImage.file, finalPrompt);
      setProcessedImage(newImageUrl);
    } catch (err) {
      console.error(err);
      setError('Failed to process the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const examplePrompts = [
      "remove the background",
      "add cherry blossoms falling",
      "change the character's hair to blue",
      "make the setting a futuristic city",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Controls Pane */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Controls</h3>
          {originalImage ? (
            <div className="space-y-4">
              <img src={originalImage.url} alt="Thumbnail" className="rounded-md w-full object-contain max-h-40"/>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-md font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <ReplaceIcon />
                Change Image
              </button>
            </div>
          ) : (
            <p className="text-gray-400">Upload a panel to get started.</p>
          )}
        </div>
        
        {activeTab === Tab.EDIT && originalImage && (
          <div className="space-y-4 bg-gray-900 p-4 rounded-lg border border-gray-800">
            <label htmlFor="prompt" className="block text-lg font-medium text-gray-300">Editing Instruction</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'remove the text bubbles'"
              rows={4}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map(p => (
                   <button key={p} onClick={() => setPrompt(p)} className="px-3 py-1 text-sm bg-gray-700/80 hover:bg-gray-700 rounded-full transition-colors">
                       {p}
                   </button>
              ))}
            </div>
          </div>
        )}

        {originalImage && (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              {isLoading ? 'Processing...' : (activeTab === Tab.COLORIZE ? 'Colorize It!' : 'Apply Edit')}
            </button>
          </div>
        )}
      </div>

      {/* Image Display Pane */}
      <div className="lg:col-span-3">
        {!originalImage ? (
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`flex justify-center items-center w-full h-full min-h-[400px] lg:min-h-[600px] border-2 border-dashed rounded-lg transition-colors ${
              isDragging ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-800 bg-black/20'
            }`}
          >
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center text-gray-400 hover:text-indigo-400 transition-colors p-8 text-center">
              <UploadIcon />
              <span className="mt-2 text-lg font-medium">{isDragging ? "Drop the panel here!" : "Click or drag & drop a manga panel"}</span>
              <span className="text-sm">PNG, JPG, WEBP (Max 4MB)</span>
            </label>
          </div>
        ) : (
           <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-300">Original</h3>
              <img src={originalImage.url} alt="Original manga panel" className="rounded-lg shadow-lg w-full h-auto object-contain max-h-[500px]" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-300">Result</h3>
              <div className="relative w-full aspect-square md:aspect-auto min-h-[400px] bg-gray-900 rounded-lg flex items-center justify-center shadow-lg border border-gray-800">
                {isLoading && <Loader />}
                {!isLoading && processedImage && (
                   <>
                      <img src={processedImage} alt="Processed manga panel" className="rounded-lg w-full h-full object-contain max-h-[500px]" />
                       <a href={processedImage} download="processed-manga.png" className="absolute top-2 right-2 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500">
                          <DownloadIcon />
                      </a>
                   </>
                )}
                {!isLoading && !processedImage && <p className="text-gray-400">Your result will appear here</p>}
              </div>
            </div>
          </div>
        )}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </div>
      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} ref={fileInputRef} />
    </div>
  );
};

export default ImageProcessor;