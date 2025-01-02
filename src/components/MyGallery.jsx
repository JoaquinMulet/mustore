// 📁 src/components/MyGallery.jsx
import React, { useState, useEffect } from 'react';

export default function MyGallery({ productImages, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Precargar la siguiente imagen
  useEffect(() => {
    const nextIndex = currentIndex === productImages.length - 1 ? 0 : currentIndex + 1;
    const img = new Image();
    img.src = productImages[nextIndex];
    img.onload = () => {
      setLoadedImages(prev => ({...prev, [nextIndex]: true}));
    };
  }, [currentIndex, productImages]);

  // Precargar la imagen actual cuando el componente se monta
  useEffect(() => {
    const img = new Image();
    img.src = productImages[currentIndex];
    img.onload = () => {
      setLoadedImages(prev => ({...prev, [currentIndex]: true}));
      setIsLoading(false);
    };
  }, []);

  function handlePrev() {
    setIsLoading(true);
    setCurrentIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  }

  function handleNext() {
    setIsLoading(true);
    setCurrentIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  }

  function handleDotClick(index) {
    setIsLoading(true);
    setCurrentIndex(index);
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Contenedor de imagen con skeleton loader */}
      <div className="flex justify-center items-center bg-white relative">
        {/* Skeleton loader */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        
        {/* Imagen actual */}
        <img
          src={productImages[currentIndex]}
          alt={`${title} - Imagen ${currentIndex + 1}`}
          className={`w-[95vw] md:w-full h-[400px] md:h-[500px] object-contain transition-opacity duration-300 ${
            loadedImages[currentIndex] && !isLoading ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => {
            setLoadedImages(prev => ({...prev, [currentIndex]: true}));
            setIsLoading(false);
          }}
        />

        {/* Precargar siguiente imagen */}
        <img
          src={productImages[(currentIndex + 1) % productImages.length]}
          alt="Preload next"
          className="hidden"
          onLoad={() => {
            setLoadedImages(prev => ({...prev, [(currentIndex + 1) % productImages.length]: true}));
          }}
        />
      </div>

      {/* Botón Prev */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full text-sm text-black transition-all duration-300 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {/* Botón Next */}
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full text-sm text-black transition-all duration-300 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* Dots (paginación) con preview en hover */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {productImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${idx === currentIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-blue-400'}
            `}
          />
        ))}
      </div>
    </div>
  );
}
